# Guide d'installation — CIPREL Compétences sur serveur Debian

- Application : **CIPREL Compétences** (Next.js 14 / React 18 / Supabase)
- Cible : **Debian 12 (Bookworm)**, également valable pour Debian 11 et Ubuntu 22.04+
- Version du guide : septembre 2026

---

## Sommaire

0. [Installation rapide (script automatisé)](#0-installation-rapide-script-automatisé)
1. [Architecture et prérequis](#1-architecture-et-prérequis)
2. [Préparation du serveur](#2-préparation-du-serveur)
3. [Installation des logiciels](#3-installation-des-logiciels)
4. [Copie des sources](#4-copie-des-sources)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Build et premier démarrage](#6-build-et-premier-démarrage)
7. [PM2 : démarrage automatique](#7-pm2--démarrage-automatique)
8. [Nginx + HTTPS (Let's Encrypt)](#8-nginx--https-lets-encrypt)
9. [Sécurité : UFW, Fail2ban, en-têtes](#9-sécurité--ufw-fail2ban-en-têtes)
10. [Intégration SharePoint / Teams](#10-intégration-sharepoint--teams)
11. [Vérifications finales](#11-vérifications-finales)
12. [Exploitation : mises à jour, logs, sauvegardes](#12-exploitation--mises-à-jour-logs-sauvegardes)
13. [Dépannage](#13-dépannage)
14. [Annexe : contenu de l'archive](#14-annexe--contenu-de-larchive)

---

## 0. Installation rapide (script automatisé)

L'archive est un **pack prêt à déployer** : sources, variables d'environnement **déjà renseignées** (`.env.production`), configuration PM2 et Nginx, scripts d'installation. Sur un serveur Debian 12 vierge, l'installation complète tient en 5 commandes (en root) :

```bash
apt update && apt install -y unzip
cd /opt && unzip -q /chemin/vers/ciprel-competences-sources.zip
cd /opt/ciprel-competences
bash deploy/supabase/setup-supabase.sh   # 1. Supabase self-hosted (base, auth, API) — voir GUIDE_SUPABASE_SELF_HOSTED.md
bash deploy/install.sh                   # 2. Application Next.js
```

> **Deux options pour Supabase** : (a) **self-hosted** sur le serveur CIPREL, recommandé, via `setup-supabase.sh` (guide dédié `GUIDE_SUPABASE_SELF_HOSTED.md`) ; (b) conserver le projet **cloud** supabase.com existant : sauter la commande 1, le `.env.production` fourni contient déjà les clés cloud.

Le script demande le **nom de domaine** et un **e-mail** (Let's Encrypt), puis enchaîne toutes les étapes des sections 2 à 9 :
Node 20, PM2, copie dans `/var/www/ciprel-competences`, build, démarrage PM2, Nginx, UFW, Fail2ban, certificat HTTPS.
Durée : 10 à 15 minutes. Il est **ré-exécutable** sans risque.

Mode non interactif :

```bash
DOMAIN=competences.ciprel.ci EMAIL=informatique@ciprel.ci bash deploy/install.sh
# serveur interne sans DNS public / Let's Encrypt impossible :
DOMAIN=competences.ciprel.local SKIP_CERTBOT=1 bash deploy/install.sh
```

À la fin, passer directement à la [section 11 (vérifications)](#11-vérifications-finales). Les sections 2 à 9 détaillent ce que fait le script, pour une installation manuelle ou un diagnostic.

---

## 1. Architecture et prérequis

### Schéma

```
Internet ──HTTPS 443──> Nginx (reverse proxy + Let's Encrypt)
                          ├── competences.ciprel.ci ──> 127.0.0.1:3000  Next.js (PM2)
                          │                                ├──> Supabase (auth + données)
                          │                                └──> ./data/ciprel.db (SQLite local)
                          └── supabase.ciprel.ci ───> 127.0.0.1:8000  Supabase self-hosted (Docker)
                                                          Postgres 17, Auth, REST, Realtime, Storage, Studio
```

- **Supabase** porte l'authentification et l'essentiel des données. Deux modes : **self-hosted** sur le serveur CIPREL (Docker, guide dédié) ou projet **cloud** supabase.com existant (accès sortant HTTPS vers `*.supabase.co`).
- Un petit module (progression de lecture) utilise une base **SQLite locale** dans `./data/`. Le dossier doit être accessible en écriture.
- L'application est intégrée en **iframe dans SharePoint / Teams** : la politique `Content-Security-Policy: frame-ancestors` est déjà configurée dans le code (voir §10).

### Dimensionnement minimal

| Ressource | Application seule (Supabase cloud) | Application + Supabase self-hosted |
|---|---|---|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 Go (+ 2 Go swap) min., 4 Go recommandé | **8 Go** |
| Disque | 20 Go SSD | **40 Go SSD** |
| OS | Debian 12 64 bits | Debian 12 64 bits |

Le `npm run build` consomme jusqu'à 1,5 Go de RAM. Sans swap sur une machine 2 Go, le build peut être tué (voir §13).

### Éléments à préparer avant de commencer

- [ ] Un nom de domaine pointant (enregistrement DNS **A**) vers l'IP publique du serveur. Dans ce guide : `competences.ciprel.ci` — **à remplacer partout par le vôtre**. Pour Supabase self-hosted, un second nom : `supabase.ciprel.ci`.
- [ ] Un accès SSH root ou sudo.
- [ ] Le fichier `.env.production` fourni dans l'archive (déjà rempli : clés Supabase, paramètres application).
- [ ] L'archive `ciprel-competences-sources.zip` fournie.

---

## 2. Préparation du serveur

Toutes les commandes s'exécutent en **root** (ou préfixées de `sudo`).

```bash
apt update && apt full-upgrade -y
apt install -y curl wget git unzip ca-certificates gnupg ufw fail2ban \
               build-essential python3 zip
timedatectl set-timezone Africa/Abidjan
```

### Utilisateur applicatif (non-root)

```bash
adduser --disabled-password --gecos "CIPREL App" deploy
mkdir -p /var/www/ciprel-competences /var/log/pm2
chown -R deploy:deploy /var/www/ciprel-competences /var/log/pm2
```

### Swap (si RAM ≤ 2 Go)

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 3. Installation des logiciels

### 3.1 Node.js 20 LTS (NodeSource)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # attendu : v20.x.x
npm -v    # attendu : 10.x
```

> Le fichier `.nvmrc` du projet mentionne Node 18.19.1 (ancienne cible d'hébergement). Node 20 LTS est pleinement compatible avec Next.js 14 et est la version retenue pour ce serveur.

### 3.2 PM2 (gestionnaire de processus)

```bash
npm install -g pm2
pm2 -v
```

### 3.3 Nginx + Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx
```

---

## 4. Copie des sources

Deux options : archive zip (fournie) ou dépôt Git (si accès accordé). **Choisir une seule.**

### Option A — Archive zip (recommandée pour la première installation)

Depuis votre poste, transférer l'archive :

```bash
scp ciprel-competences-sources.zip root@IP_DU_SERVEUR:/tmp/
```

Sur le serveur (en root) — l'archive contient un dossier racine `ciprel-competences/` :

```bash
cd /var/www
unzip -q /tmp/ciprel-competences-sources.zip      # crée /var/www/ciprel-competences
chown -R deploy:deploy /var/www/ciprel-competences
chmod 600 /var/www/ciprel-competences/.env.production
rm /tmp/ciprel-competences-sources.zip
su - deploy
cd /var/www/ciprel-competences
ls -a   # doit afficher : .env.production  package.json  next.config.js  src/  public/  ecosystem.config.js ...
```

> Avec `deploy/install.sh` (§0), la copie vers `/var/www` est faite par le script : décompresser n'importe où (ex. `/opt`) suffit.

### Option B — Git

```bash
su - deploy
git clone https://github.com/<organisation>/demarchecompetencesciprel.git /var/www/ciprel-competences
cd /var/www/ciprel-competences
```

### Dossier de données (écriture)

```bash
mkdir -p /var/www/ciprel-competences/data
chmod 750 /var/www/ciprel-competences/data
# propriétaire = deploy (déjà le cas si vous êtes connecté en deploy)
```

---

## 5. Variables d'environnement

Le fichier **`.env.production` est fourni pré-rempli** à la racine de l'archive. Il contient :

| Variable | Valeur fournie | Action |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase cloud | **remplacée automatiquement** par `setup-supabase.sh` en mode self-hosted |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publique Supabase cloud | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | clé serveur Supabase cloud (**secrète**) | idem ; protéger le fichier |
| `NEXT_PUBLIC_APP_URL` | `https://competences.ciprel.ci` | **à adapter** au domaine réel (fait automatiquement par `install.sh`) |
| `NEXT_PUBLIC_ALLOW_IFRAME_EMBED` | `true` | aucune (intégration SharePoint) |
| `CACHE_ADMIN_SECRET` | secret aléatoire généré | aucune (à conserver) |
| `TURSO_*` | vide | aucune : base SQLite locale `./data/ciprel.db` |
| `SMTP_*` | vide | optionnel : renseigner pour l'envoi d'e-mails |
| autres `NEXT_PUBLIC_*` | valeurs de production actuelles | aucune |

Installation manuelle (le script le fait seul) :

```bash
cd /var/www/ciprel-competences
chmod 600 .env.production
sed -i 's#^NEXT_PUBLIC_APP_URL=.*#NEXT_PUBLIC_APP_URL=https://VOTRE.DOMAINE.ci#' .env.production
```

> **Confidentialité** : `.env.production` contient la clé `SUPABASE_SERVICE_ROLE_KEY`, qui donne un accès complet à la base. Droits `600`, propriétaire `deploy`, ne jamais copier hors du serveur ni dans un dépôt Git. Le modèle sans valeurs `.env.production.example` peut lui être diffusé librement.

> **Important** : les variables `NEXT_PUBLIC_*` sont **figées au moment du build**. Toute modification impose de relancer `npm run build` (§6) puis `pm2 reload`.

> **Supabase self-hosted** : `deploy/supabase/setup-supabase.sh` génère de nouvelles clés et les écrit lui-même dans ce fichier (puis rebuild l'application si elle est déjà installée). **Supabase cloud** : les valeurs fournies sont celles du projet existant ; le serveur doit pouvoir joindre `https://*.supabase.co` en sortie (port 443).

---

## 6. Build et premier démarrage

```bash
cd /var/www/ciprel-competences

# 1. Dépendances (NE PAS utiliser --omit=dev : le build a besoin de TypeScript/Tailwind)
npm ci --no-audit --no-fund

# 2. sharp : optimisation d'images next/image en production
npm install sharp --no-save --no-audit --no-fund

# 3. Build de production
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

Le build dure 2 à 6 minutes selon le serveur et se termine par un tableau des routes (`Route (app) ... ○ ● ƒ`).

Test manuel (Ctrl+C pour arrêter) :

```bash
npm run start
# autre terminal : curl -I http://127.0.0.1:3000  ->  HTTP/1.1 200 OK
```

> `better-sqlite3` et `@libsql/client` sont des modules natifs. Les binaires précompilés pour Linux x64 / Node 20 sont téléchargés automatiquement. Si `npm ci` tente de compiler et échoue, vérifiez que `build-essential` et `python3` sont installés (§2).

---

## 7. PM2 : démarrage automatique

Le fichier `ecosystem.config.js` est fourni à la racine du projet (chemin `/var/www/ciprel-competences`, port 3000, logs dans `/var/log/pm2/`).

```bash
# en tant que deploy
cd /var/www/ciprel-competences
pm2 start ecosystem.config.js
pm2 status
pm2 logs ciprel-competences --lines 50
pm2 save
```

Démarrage au boot du serveur (la commande `pm2 startup` affiche une ligne à **exécuter en root**) :

```bash
pm2 startup systemd -u deploy --hp /home/deploy
# copier-coller la commande "sudo env PATH=... pm2 startup systemd -u deploy --hp /home/deploy" affichée
```

Puis, de retour en `deploy` : `pm2 save`.

Vérifier après un `reboot` : `pm2 status` doit montrer `ciprel-competences | online`.

### Alternative : service systemd (sans PM2)

<details>
<summary>Cliquer pour afficher</summary>

`/etc/systemd/system/ciprel-competences.service` :

```ini
[Unit]
Description=CIPREL Competences (Next.js)
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/ciprel-competences
EnvironmentFile=/var/www/ciprel-competences/.env.production
Environment=NODE_ENV=production PORT=3000
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now ciprel-competences
journalctl -u ciprel-competences -f
```

</details>

---

## 8. Nginx + HTTPS (Let's Encrypt)

### 8.1 Configuration du site (en root)

Le fichier prêt à l'emploi est fourni : `deploy/nginx-ciprel-competences.conf`.

```bash
cp /var/www/ciprel-competences/deploy/nginx-ciprel-competences.conf \
   /etc/nginx/sites-available/ciprel-competences

# Adapter le nom de domaine
sed -i 's/competences.ciprel.ci/VOTRE.DOMAINE.ci/g' /etc/nginx/sites-available/ciprel-competences

ln -s /etc/nginx/sites-available/ciprel-competences /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Test HTTP : `curl -I http://VOTRE.DOMAINE.ci` → `200 OK` (ou `307` vers `/login`).

### 8.2 Certificat Let's Encrypt

Le DNS doit déjà pointer vers le serveur et le port 80 être ouvert.

```bash
certbot --nginx -d VOTRE.DOMAINE.ci --redirect \
        --agree-tos -m informatique@ciprel.ci --no-eff-email
```

Certbot modifie automatiquement la configuration Nginx (bloc `listen 443 ssl`, redirection 80 → 443).
Renouvellement automatique : déjà planifié par le paquet (`systemctl list-timers | grep certbot`). Test : `certbot renew --dry-run`.

### 8.3 Durcissement TLS (optionnel, recommandé)

Dans `/etc/nginx/sites-available/ciprel-competences`, bloc `server` 443, ajouter :

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Puis `nginx -t && systemctl reload nginx`.

### 8.4 Serveur interne sans Let's Encrypt (certificat d'entreprise)

Si le serveur n'est pas joignable depuis Internet (intranet CIPREL), Let's Encrypt est impossible. Utiliser un certificat émis par la PKI interne ou un certificat commercial :

```bash
mkdir -p /etc/nginx/ssl
cp competences.crt /etc/nginx/ssl/   # certificat + chaîne intermédiaire
cp competences.key /etc/nginx/ssl/ && chmod 600 /etc/nginx/ssl/competences.key
```

Dans `/etc/nginx/sites-available/ciprel-competences`, remplacer `listen 80;` par :

```nginx
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/competences.crt;
    ssl_certificate_key /etc/nginx/ssl/competences.key;
    ssl_protocols TLSv1.2 TLSv1.3;
```

et ajouter un bloc de redirection :

```nginx
server { listen 80; server_name VOTRE.DOMAINE; return 301 https://$host$request_uri; }
```

`nginx -t && systemctl reload nginx`. Le HTTPS reste **obligatoire** : sans lui, les cookies `SameSite=None; Secure` sont refusés et la session ne fonctionne pas dans SharePoint.

---

## 9. Sécurité : UFW, Fail2ban, en-têtes

### 9.1 Pare-feu UFW

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH  (adapter si port SSH personnalisé)
ufw allow 80/tcp    # HTTP (Let's Encrypt + redirection)
ufw allow 443/tcp   # HTTPS
ufw enable
ufw status verbose
```

Le port 3000 **n'est pas** ouvert : Next.js n'est joignable que via Nginx.

### 9.2 Fail2ban (SSH)

```bash
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
EOF
systemctl enable --now fail2ban
fail2ban-client status sshd
```

### 9.3 SSH (recommandé)

Dans `/etc/ssh/sshd_config` : `PermitRootLogin prohibit-password`, `PasswordAuthentication no` (après avoir déposé vos clés publiques). Puis `systemctl restart ssh`.

### 9.4 En-têtes de sécurité

Ils sont **émis par l'application** (`next.config.js`) et n'ont pas à être dupliqués dans Nginx :

| En-tête | Valeur |
|---|---|
| `Content-Security-Policy` | `frame-ancestors 'self' https://ciprel.ci https://*.ciprel.ci https://*.sharepoint.com https://*.office.com https://*.office365.com https://*.microsoft.com https://*.cloud.microsoft https://*.teams.microsoft.com;` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

`X-Frame-Options` est **volontairement absent** (remplacé par `frame-ancestors`, plus précis). **Ne pas** l'ajouter dans Nginx : il casserait l'intégration SharePoint.

---

## 10. Intégration SharePoint / Teams

Pour que l'application s'affiche dans un iframe du tenant `ciprelci.sharepoint.com` :

1. **HTTPS obligatoire** sur l'application (fait au §8).
2. `NEXT_PUBLIC_ALLOW_IFRAME_EMBED=true` dans `.env.production` (cookies de session en `SameSite=None; Secure`), puis rebuild.
3. La CSP `frame-ancestors` autorise déjà `https://*.sharepoint.com` (donc `ciprelci.sharepoint.com`), Teams et Office 365.
4. Côté SharePoint : ajouter un composant *Embed* (ou *Page viewer*) avec l'URL `https://VOTRE.DOMAINE.ci`. Si SharePoint refuse, ajouter le domaine dans *Administration SharePoint > Paramètres > Sécurité > Domaines autorisés pour l'incorporation* (**HTML Field Security**).

Vérification :

```bash
curl -sI https://VOTRE.DOMAINE.ci | grep -i -E "content-security-policy|x-frame-options"
# attendu : la ligne CSP avec frame-ancestors ; AUCUNE ligne x-frame-options
```

---

## 11. Vérifications finales

| # | Test | Commande / action | Résultat attendu |
|---|---|---|---|
| 1 | Processus | `pm2 status` | `online`, 0 restart |
| 2 | Port local | `curl -I http://127.0.0.1:3000` | `200` |
| 3 | HTTPS public | `curl -I https://VOTRE.DOMAINE.ci` | `200`, certificat valide |
| 4 | Redirection HTTP | `curl -I http://VOTRE.DOMAINE.ci` | `301` vers https |
| 5 | En-têtes | `curl -sI https://VOTRE.DOMAINE.ci \| grep -i frame` | CSP présente, pas de X-Frame-Options |
| 6 | Connexion | Navigateur : `/login` avec un compte existant | tableau de bord accessible |
| 7 | Admin | `/admin` avec un compte ADMIN | accès OK |
| 8 | Quiz | dérouler un quiz jusqu'au score | score enregistré (Supabase) |
| 9 | Progression | consulter une page de contenu, revenir | progression mémorisée ; fichier `data/ciprel.db` créé |
| 10 | Iframe | page SharePoint de test | application affichée, session conservée |
| 11 | Pare-feu | `ufw status` | 22, 80, 443 uniquement |
| 12 | Reboot | `reboot` puis `pm2 status` | application relancée seule |

---

## 12. Exploitation : mises à jour, logs, sauvegardes

### Mettre à jour l'application

Script fourni : `deploy/update.sh` (git pull si dépôt git, `npm ci`, build, `pm2 reload`).

```bash
su - deploy
cd /var/www/ciprel-competences
# si livraison par zip : décompresser la nouvelle archive par-dessus le dossier (hors .env.production et data/)
bash deploy/update.sh
```

`pm2 reload` effectue un redémarrage sans interruption de service.

### Logs

```bash
pm2 logs ciprel-competences            # application (temps réel)
tail -f /var/log/pm2/ciprel-competences.error.log
tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```

Rotation des logs PM2 : `pm2 install pm2-logrotate`.

### Sauvegardes

- **Supabase self-hosted** : sauvegarde quotidienne automatique dans `/var/backups/supabase` (installée par `setup-supabase.sh`, voir guide Supabase §7). **Supabase cloud** : sauvegardes gérées côté Supabase (dashboard > Database > Backups).
- **Serveur** : sauvegarder `/var/www/ciprel-competences/.env.production` et `/var/www/ciprel-competences/data/` (SQLite). Exemple cron quotidien (root) :

```bash
cat > /etc/cron.daily/ciprel-backup <<'EOF'
#!/bin/sh
D=/var/backups/ciprel; mkdir -p $D
tar czf $D/ciprel-$(date +%F).tgz -C /var/www/ciprel-competences .env.production data
find $D -name 'ciprel-*.tgz' -mtime +30 -delete
EOF
chmod +x /etc/cron.daily/ciprel-backup
```

### Commandes utiles

```bash
pm2 restart ciprel-competences   # redémarrage complet
pm2 reload  ciprel-competences   # redémarrage sans coupure
pm2 monit                        # CPU / RAM en direct
nginx -t && systemctl reload nginx
certbot certificates             # état des certificats
```

---

## 13. Dépannage

| Symptôme | Cause probable | Correction |
|---|---|---|
| `npm run build` s'arrête avec `Killed` ou `JavaScript heap out of memory` | RAM insuffisante | Ajouter du swap (§2) et lancer avec `NODE_OPTIONS="--max-old-space-size=2048"` |
| `502 Bad Gateway` sur Nginx | Next.js arrêté | `pm2 status`, `pm2 logs` ; vérifier que le port 3000 écoute : `ss -ltnp \| grep 3000` |
| `Missing Supabase environment variables` dans les logs | `.env.production` absent ou incomplet | Vérifier le fichier, puis **rebuild** (les `NEXT_PUBLIC_*` sont figées au build) |
| Page blanche dans SharePoint, console `Refused to display ... frame-ancestors` | Domaine SharePoint non listé, ou `X-Frame-Options` ajouté dans Nginx | Retirer tout `add_header X-Frame-Options` ; vérifier la CSP avec `curl -sI` |
| Déconnexion immédiate dans l'iframe | `NEXT_PUBLIC_ALLOW_IFRAME_EMBED` ≠ `true` ou site en HTTP | Mettre `true`, rebuild, HTTPS obligatoire |
| `SQLITE_CANTOPEN` / erreur écriture `data/ciprel.db` | Droits du dossier `data/` | `chown -R deploy:deploy data && chmod 750 data` |
| Erreur `sharp` au démarrage | Module non installé ou compilé pour une autre plateforme | `npm install sharp --no-save` puis `pm2 restart` |
| `npm ci` échoue sur `better-sqlite3` (node-gyp) | Outils de compilation absents | `apt install -y build-essential python3` puis relancer |
| Certbot : `Challenge failed` | DNS non propagé ou port 80 fermé | `dig +short VOTRE.DOMAINE.ci`, `ufw status` |
| Upload vidéo refusé `413` | Limite Nginx | `client_max_body_size` dans la conf Nginx (120M par défaut) |

---

## 14. Annexe : contenu de l'archive

`ciprel-competences-sources.zip` est un pack prêt à déployer : code source complet **sans** `node_modules`, `.next` ni `.git`, **avec** le fichier `.env.production` renseigné (confidentiel).

```
ciprel-competences/
├── GUIDE_INSTALLATION_SERVEUR_DEBIAN.md   <- ce guide
├── .env.production                        <- variables PRÉ-REMPLIES (confidentiel, chmod 600)
├── .env.production.example                <- même fichier sans valeurs (diffusable)
├── ecosystem.config.js                    <- configuration PM2
├── GUIDE_SUPABASE_SELF_HOSTED.md          <- guide Supabase self-hosted (Docker)
├── deploy/
│   ├── install.sh                         <- installation automatisée de l'application (root)
│   ├── nginx-ciprel-competences.conf      <- reverse proxy Nginx
│   ├── update.sh                          <- script de mise à jour
│   └── supabase/                          <- Supabase self-hosted : setup-supabase.sh, schema.sql, seed-data.sql…
├── package.json / package-lock.json
├── next.config.js                         <- en-têtes CSP frame-ancestors
├── src/                                   <- code applicatif (app router, API, composants)
├── public/                                <- images, vidéos, manifest
├── supabase/                              <- scripts SQL de référence (déjà appliqués en prod)
├── data/                                  <- base SQLite locale (créée au 1er démarrage)
└── docutechnique/                         <- documentation technique complémentaire
```

### Fichiers à ne jamais diffuser ni commiter

- `.env.production` (clés Supabase, secret admin) — transmis uniquement au responsable du serveur, par canal sécurisé
- `data/*.db`

---

*Contact intégrateur : Jean Luc Houédanou — jhouedanou@gmail.com*
