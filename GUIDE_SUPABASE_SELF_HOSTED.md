# Guide Supabase self-hosted — CIPREL Compétences

Complément du **Guide d'installation serveur Debian**. Ce document couvre l'hébergement de Supabase (base de données, authentification, API, temps réel, stockage) **sur le serveur CIPREL**, à la place du service cloud supabase.com.

- Cible : Debian 12, même serveur que l'application ou serveur dédié
- Stack : Supabase self-hosted officiel (Docker Compose), version épinglée `self-hosted/v0.8.1`
- Version du guide : septembre 2026

---

## Sommaire

0. [Installation rapide](#0-installation-rapide)
1. [Architecture](#1-architecture)
2. [Prérequis](#2-prérequis)
3. [Ce que fait le script](#3-ce-que-fait-le-script)
4. [Ordre d'installation avec l'application](#4-ordre-dinstallation-avec-lapplication)
5. [E-mails (SMTP) et réinitialisation de mot de passe](#5-e-mails-smtp-et-réinitialisation-de-mot-de-passe)
6. [Studio : le tableau de bord](#6-studio--le-tableau-de-bord)
7. [Sauvegardes et restauration](#7-sauvegardes-et-restauration)
8. [Exploitation : commandes, mises à jour, logs](#8-exploitation--commandes-mises-à-jour-logs)
9. [Sécurité](#9-sécurité)
10. [Données : ce qui est migré, ce qui ne l'est pas](#10-données--ce-qui-est-migré-ce-qui-ne-lest-pas)
11. [Vérifications finales](#11-vérifications-finales)
12. [Dépannage](#12-dépannage)
13. [Annexe : fichiers du pack](#13-annexe--fichiers-du-pack)

---

## 0. Installation rapide

Sur le serveur, en root, depuis l'archive décompressée (ex. `/opt/ciprel-competences`) :

```bash
bash deploy/supabase/setup-supabase.sh
```

Le script demande 4 informations :

| Question | Exemple | Rôle |
|---|---|---|
| Sous-domaine Supabase | `supabase.ciprel.ci` | URL publique de l'API (doit pointer vers le serveur en DNS) |
| Domaine de l'application | `competences.ciprel.ci` | Redirections d'authentification |
| E-mail du premier administrateur | `admin@ciprel.ci` | Compte ADMIN de l'application, créé automatiquement |
| E-mail Let's Encrypt | `informatique@ciprel.ci` | Alertes d'expiration de certificat |

Durée : 10 à 20 minutes (téléchargement d'environ 3 Go d'images Docker). À la fin, le script affiche **le mot de passe de l'administrateur** (une seule fois) et écrit les clés Supabase dans le `.env.production` de l'application.

Mode non interactif :

```bash
SUPABASE_DOMAIN=supabase.ciprel.ci APP_DOMAIN=competences.ciprel.ci \
ADMIN_EMAIL=admin@ciprel.ci EMAIL=informatique@ciprel.ci \
bash deploy/supabase/setup-supabase.sh
```

Puis installer l'application : `bash deploy/install.sh` (voir §4).

---

## 1. Architecture

```
Internet ──443──> Nginx (hôte, Let's Encrypt)
                    ├── competences.ciprel.ci ──> 127.0.0.1:3000  Next.js (PM2)
                    └── supabase.ciprel.ci    ──> 127.0.0.1:8000  Envoy (passerelle API Supabase)
                                                     ├── /auth/v1     GoTrue (authentification)
                                                     ├── /rest/v1     PostgREST (API données)
                                                     ├── /realtime/v1 Realtime (WebSocket)
                                                     ├── /storage/v1  Storage (fichiers)
                                                     └── /            Studio (tableau de bord, auth basique)
                                                            │
                                                     Postgres 17 (conteneur supabase-db, volume ./volumes/db)
```

- **Tout Docker est lié à `127.0.0.1`** : aucun port de conteneur n'est joignable depuis le réseau. Seul Nginx expose 80/443.
- L'application Next.js parle à Supabase via `https://supabase.ciprel.ci` (navigateur et serveur).
- Le dossier `/opt/supabase` contient la stack officielle, le fichier `.env` (secrets) et les volumes de données.

### Dimensionnement

| Ressource | Application seule | Application + Supabase |
|---|---|---|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2-4 Go | **8 Go** (stack Supabase ≈ 3-4 Go) |
| Disque | 20 Go | **40 Go SSD** (images ≈ 3 Go + données + sauvegardes) |

---

## 2. Prérequis

- [ ] Debian 12 à jour, accès root, **8 Go de RAM** minimum.
- [ ] Deux enregistrements DNS **A** vers le serveur : `competences.ciprel.ci` et `supabase.ciprel.ci` (noms au choix).
- [ ] Accès Internet **sortant** pendant l'installation : `github.com` (scripts), `download.docker.com` (Docker), `docker.io` / `ghcr.io` (images), `letsencrypt.org`.
- [ ] Ports 80 et 443 ouverts en entrée (Let's Encrypt et accès utilisateurs).
- [ ] Optionnel : paramètres SMTP (§5).

---

## 3. Ce que fait le script

`deploy/supabase/setup-supabase.sh`, étape par étape :

1. **Paquets** : curl, git, jq, openssl, nginx, certbot.
2. **Stack officielle** : télécharge le `setup.sh` de Supabase (version `self-hosted/v0.8.1`), qui installe Docker Engine + Compose, clone le dossier `docker/` du dépôt Supabase dans `/opt/supabase`, et **génère tous les secrets** (mot de passe Postgres, `JWT_SECRET`, clés `ANON_KEY` / `SERVICE_ROLE_KEY`, clés asymétriques, mot de passe Studio…).
3. **Surcouche CIPREL** (`docker-compose.ciprel.yml`) : lie la passerelle (8000) et le pooler (5432/6543) à `127.0.0.1`.
4. **Configuration `.env`** : URLs publiques, redirections d'auth vers l'application, SMTP si fourni, sinon confirmation automatique des e-mails.
5. **Démarrage** : `docker compose up -d --wait` (13 conteneurs).
6. **Schéma** : `schema.sql` (16 tables, vue, 10 fonctions, triggers, 35 politiques RLS, publication Realtime, buckets Storage).
7. **Données** : `seed-data.sql` (164 questions, 13 workshops, 12 ateliers métiers, configuration). Ré-exécutable (upsert).
8. **Administrateur** : création via l'API d'administration GoTrue, e-mail confirmé, rôle `ADMIN` dans `profiles`.
9. **Nginx + Certbot** pour `supabase.ciprel.ci` (WebSocket activé pour Realtime).
10. **Application** : écrit `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` dans `.env.production` (archive et/ou `/var/www/ciprel-competences`), rebuild + `pm2 reload` si l'application est déjà installée.
11. **Sauvegarde** quotidienne `/etc/cron.daily/supabase-backup`.

Idempotent : relancer le script ne casse rien (pas de nouvelle génération de clés, upsert des données, admin conservé).

---

## 4. Ordre d'installation avec l'application

**Scénario recommandé (même serveur)** :

```bash
cd /opt && unzip -q ciprel-competences-sources.zip && cd ciprel-competences
bash deploy/supabase/setup-supabase.sh     # 1. Supabase (écrit les clés dans .env.production)
bash deploy/install.sh                     # 2. Application (build avec les bonnes clés)
```

**Application déjà installée avec le Supabase cloud** : lancer seulement `setup-supabase.sh`. Il met à jour `/var/www/ciprel-competences/.env.production`, rebuild et recharge PM2. Les utilisateurs devront se reconnecter (nouvelle instance d'authentification).

**Supabase sur un serveur séparé** : lancer `setup-supabase.sh` sur le serveur Supabase, puis copier les trois valeurs (`sh run.sh secrets` dans `/opt/supabase`) dans le `.env.production` du serveur applicatif, puis `bash deploy/update.sh`.

---

## 5. E-mails (SMTP) et réinitialisation de mot de passe

Sans SMTP, Supabase ne peut pas envoyer d'e-mails. Le script configure alors `ENABLE_EMAIL_AUTOCONFIRM=true` : les comptes créés par inscription sont actifs immédiatement (comportement identique au projet cloud actuel). **La fonction « mot de passe oublié » ne fonctionne pas** ; un administrateur réinitialise les mots de passe depuis Studio (Authentication > Users > … > Reset password) ou en ligne de commande (§8).

Pour activer les e-mails (recommandé), fournir le SMTP CIPREL (Exchange / Microsoft 365) au moment de l'installation :

```bash
SMTP_HOST=smtp.office365.com SMTP_PORT=587 SMTP_USER=noreply@ciprel.ci SMTP_PASS='xxxx' \
SMTP_ADMIN_EMAIL=noreply@ciprel.ci SMTP_SENDER_NAME="CIPREL Compétences" \
bash deploy/supabase/setup-supabase.sh
```

ou après coup, dans `/opt/supabase/.env` : renseigner `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_ADMIN_EMAIL`, `SMTP_SENDER_NAME`, passer `ENABLE_EMAIL_AUTOCONFIRM=false` si l'on souhaite la confirmation par e-mail, puis :

```bash
cd /opt/supabase && sh run.sh restart auth
```

Les liens des e-mails pointent vers `API_EXTERNAL_URL` (`https://supabase.ciprel.ci/auth/v1/…`) puis redirigent vers `SITE_URL` (`https://competences.ciprel.ci`).

---

## 6. Studio : le tableau de bord

- URL : `https://supabase.ciprel.ci/`
- Authentification basique : identifiants `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` (`sh run.sh secrets` dans `/opt/supabase`).
- Permet : consulter/éditer les tables (Table Editor), exécuter du SQL (SQL Editor), gérer les utilisateurs (Authentication), les fichiers (Storage), voir les logs.
- Pour réserver Studio au réseau interne : décommenter le bloc `location = /` dans `/etc/nginx/sites-available/supabase` avec les plages IP CIPREL, puis `nginx -t && systemctl reload nginx`.

---

## 7. Sauvegardes et restauration

### Sauvegarde automatique

`/etc/cron.daily/supabase-backup` → `/var/backups/supabase/` :

| Fichier | Contenu |
|---|---|
| `db-AAAA-MM-JJ_HHMM.sql.gz` | `pg_dumpall` complet (schémas public, auth, storage…) |
| `files-AAAA-MM-JJ_HHMM.tgz` | `.env` (secrets) + `volumes/storage` (fichiers uploadés) |

Rétention 30 jours. **Copier ce dossier hors du serveur** (NAS, sauvegarde centralisée) : il contient tout ce qu'il faut pour reconstruire l'instance.

Sauvegarde manuelle : `supabase-backup`.

### Restauration complète

```bash
cd /opt/supabase && sh run.sh stop
# restaurer .env et volumes/storage depuis files-*.tgz
tar xzf /var/backups/supabase/files-XXXX.tgz -C /opt/supabase
docker compose up -d db --wait
gunzip -c /var/backups/supabase/db-XXXX.sql.gz | docker exec -i supabase-db psql -U postgres -d postgres
sh run.sh start
```

### Restauration d'une seule table

```bash
gunzip -c db-XXXX.sql.gz > /tmp/dump.sql
# extraire la table souhaitée avec un éditeur, ou utiliser pg_restore sur un dump custom
```

---

## 8. Exploitation : commandes, mises à jour, logs

Toutes les commandes s'exécutent dans `/opt/supabase` :

```bash
sh run.sh status              # état des 13 conteneurs
sh run.sh logs auth           # logs d'un service (auth, rest, realtime, storage, db, studio, api-gw…)
sh run.sh restart             # redémarrage complet
sh run.sh secrets             # afficher clés API, mots de passe Postgres et Studio
docker exec -it supabase-db psql -U postgres     # console SQL
```

### Réinitialiser le mot de passe d'un utilisateur (sans SMTP)

Studio > Authentication > Users > menu de l'utilisateur > *Send password recovery* nécessite le SMTP. Sans SMTP, définir un mot de passe directement :

```bash
cd /opt/supabase
SERVICE_KEY=$(grep ^SERVICE_ROLE_KEY= .env | cut -d= -f2-)
USER_ID=$(docker exec supabase-db psql -U postgres -tAc "select id from auth.users where email='utilisateur@ciprel.ci'")
curl -s -X PUT "http://127.0.0.1:8000/auth/v1/admin/users/${USER_ID}" \
  -H "apikey: ${SERVICE_KEY}" -H "Authorization: Bearer ${SERVICE_KEY}" -H "Content-Type: application/json" \
  -d '{"password":"NouveauMotDePasse!2026"}'
```

### Promouvoir un utilisateur administrateur

```bash
docker exec supabase-db psql -U postgres -c "update public.profiles set role='ADMIN' where email='x@ciprel.ci';"
```

### Mettre à jour Supabase

Procédure officielle (sauvegarder d'abord) :

```bash
supabase-backup
cd /opt/supabase
sh update.sh --dry-run        # aperçu des changements
sh update.sh
sh run.sh pull && sh run.sh recreate
```

Vérifier ensuite que `docker-compose.ciprel.yml` figure toujours dans `COMPOSE_FILE` (`sh run.sh config`) et qu'aucun port n'est exposé (`docker ps`).

### Ré-importer les données de référence

Après une mise à jour du contenu (nouvelles questions, ateliers) livrée sous forme de `seed-data.sql` :

```bash
docker exec -i supabase-db psql -U postgres -d postgres < deploy/supabase/seed-data.sql
```

Pour produire un nouveau `seed-data.sql` depuis une instance (cloud ou locale) :

```bash
SUPABASE_URL=https://supabase.ciprel.ci SUPABASE_SERVICE_ROLE_KEY=... node deploy/supabase/export-data.mjs
```

---

## 9. Sécurité

| Point | État |
|---|---|
| Ports Docker | liés à `127.0.0.1` uniquement (`docker-compose.ciprel.yml`) ; vérification en fin de script |
| Secrets | `/opt/supabase/.env` en `chmod 600`, générés aléatoirement à l'installation, jamais dans le pack |
| Clé `SERVICE_ROLE_KEY` | contourne les politiques RLS ; utilisée seulement côté serveur Next.js (`.env.production`, `chmod 600`) |
| Clé `ANON_KEY` | publique (embarquée dans le navigateur), protégée par RLS |
| RLS | activé sur les 16 tables (y compris `visits` et `data_processing_log`, qui étaient ouvertes dans le projet cloud) |
| Studio | authentification basique ; restreindre par IP recommandé (§6) |
| Postgres | non exposé ; accès uniquement via `docker exec` ou `127.0.0.1:5432` |
| HTTPS | obligatoire (cookies `SameSite=None; Secure` pour SharePoint) |
| Inscriptions | ouvertes (`DISABLE_SIGNUP=false`), comme dans le projet cloud. Pour n'autoriser que les comptes créés par un admin : `DISABLE_SIGNUP=true` dans `.env` puis `sh run.sh restart auth` |

Rotation des clés API : `sh utils/rotate-new-api-keys.sh` dans `/opt/supabase` (documentation Supabase), puis reporter les nouvelles clés dans `.env.production` et rebuild.

---

## 10. Données : ce qui est migré, ce qui ne l'est pas

| Élément | Migré | Détail |
|---|---|---|
| Schéma complet | oui | `schema.sql`, reconstruit depuis le projet cloud |
| Questions (164) | oui | `seed-data.sql` |
| Workshops (13), ateliers métiers (12), configuration | oui | `seed-data.sql` |
| Comptes utilisateurs du projet cloud | **non** | 4 comptes de test du prestataire (aucun compte CIPREL). Un compte ADMIN CIPREL est créé à l'installation |
| Résultats de quiz, progression de lecture | **non** | données de test liées aux comptes ci-dessus |
| Fichiers Storage | rien à migrer | buckets `videos` / `images` vides dans le cloud ; les vidéos sont dans `public/videos` de l'application |

Si des comptes CIPREL réels étaient créés dans le cloud avant la bascule, une migration complète (utilisateurs avec mots de passe hachés, résultats) reste possible avec `pg_dump` du projet cloud ; contacter l'intégrateur.

---

## 11. Vérifications finales

| # | Test | Commande | Attendu |
|---|---|---|---|
| 1 | Conteneurs | `cd /opt/supabase && sh run.sh status` | 13 services `running (healthy)` |
| 2 | API REST | `curl -s https://supabase.ciprel.ci/rest/v1/ -H "apikey: $ANON"` | JSON OpenAPI |
| 3 | Auth | `curl -s https://supabase.ciprel.ci/auth/v1/health` | `{"version":...,"name":"GoTrue"}` |
| 4 | Données | `curl -s "https://supabase.ciprel.ci/rest/v1/questions?select=count" -H "apikey: $ANON" -H "Prefer: count=exact" -I \| grep content-range` | `0-0/164` |
| 5 | Studio | navigateur `https://supabase.ciprel.ci/` | invite de mot de passe puis tableau de bord |
| 6 | Ports | `docker ps --format '{{.Ports}}'` | uniquement `127.0.0.1:…` |
| 7 | Connexion admin | `https://competences.ciprel.ci/login` avec le compte affiché par le script | accès `/admin` |
| 8 | Quiz | dérouler un quiz | score enregistré, visible dans Studio > `quiz_results` |
| 9 | Realtime | Studio > éditer `workshops.is_active` | page `/workshops` de l'application mise à jour sans rechargement |
| 10 | Sauvegarde | `supabase-backup && ls -lh /var/backups/supabase` | fichiers `db-*.sql.gz`, `files-*.tgz` |

(`ANON` = valeur de `ANON_KEY` dans `/opt/supabase/.env`.)

---

## 12. Dépannage

| Symptôme | Cause | Correction |
|---|---|---|
| `docker compose up` bloque sur `analytics` ou `vector` | socket Docker inaccessible, ou RAM insuffisante | vérifier `DOCKER_SOCKET_LOCATION=/var/run/docker.sock` ; 8 Go de RAM |
| `Invalid API key` dans l'application | `.env.production` non mis à jour ou build antérieur | vérifier les 3 clés, `npm run build`, `pm2 reload` |
| Connexion impossible, `Email not confirmed` | SMTP sans autoconfirm | confirmer l'utilisateur dans Studio, ou `ENABLE_EMAIL_AUTOCONFIRM=true` + `sh run.sh restart auth` |
| Session perdue dans SharePoint | HTTPS absent sur l'un des deux domaines | certificats valides sur `competences.` **et** `supabase.` |
| `relation "public.xxx" does not exist` | schéma non importé | `docker exec -i supabase-db psql -U postgres < deploy/supabase/schema.sql` |
| PostgREST ne voit pas une table | cache de schéma | `sh run.sh restart rest` |
| Realtime ne pousse rien | table absente de la publication | `alter publication supabase_realtime add table public.workshops;` (déjà dans `schema.sql`) |
| Certbot échoue pour `supabase.` | DNS non propagé | `dig +short supabase.ciprel.ci` puis relancer certbot |
| Port 8000 visible depuis l'extérieur | surcouche non active | `sh run.sh config` doit lister `docker-compose.ciprel.yml` ; sinon `sh run.sh config add ciprel && sh run.sh recreate api-gw supavisor` |
| Disque plein | images / logs Docker | `docker system prune -f`, rotation des sauvegardes |

---

## 13. Annexe : fichiers du pack

```
deploy/supabase/
├── setup-supabase.sh          <- installation complète (root)
├── schema.sql                 <- schéma complet (tables, RLS, fonctions, triggers, realtime, buckets)
├── seed-data.sql              <- données de référence (questions, ateliers) — 155 Ko
├── export-data.mjs            <- ré-exporter les données depuis une instance Supabase
├── docker-compose.ciprel.yml  <- surcouche : ports Docker en 127.0.0.1
├── nginx-supabase.conf        <- vhost Nginx pour supabase.ciprel.ci
└── backup-supabase.sh         <- sauvegarde quotidienne (installé dans /usr/local/bin)
```

Documentation officielle : https://supabase.com/docs/guides/self-hosting/docker

---

*Contact intégrateur : Jean Luc Houédanou — jhouedanou@gmail.com*
