#!/bin/bash

# Script pour appliquer les migrations workshops sur Supabase
# Ce script vous guide pour configurer les workshops dans Supabase

echo "🚀 Configuration des Workshops CIPREL dans Supabase"
echo "=================================================="
echo ""

echo "📋 Ce script va vous aider à :"
echo "  1. Vérifier la connexion à Supabase"
echo "  2. Créer la table workshops (si nécessaire)"
echo "  3. Configurer les politiques RLS"
echo "  4. Insérer les 12 workshops métiers"
echo ""

echo "🔐 Prérequis :"
echo "  - Avoir un compte Supabase"
echo "  - Avoir accès au projet : yuyjwspittftodncnfbd"
echo "  - Être connecté en tant qu'admin"
echo ""

read -p "Voulez-vous continuer ? (o/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Oo]$ ]]
then
    echo "❌ Annulé"
    exit 1
fi

echo ""
echo "📝 INSTRUCTIONS MANUELLES :"
echo ""
echo "1️⃣  Allez sur https://supabase.com/dashboard"
echo "2️⃣  Ouvrez votre projet : yuyjwspittftodncnfbd"
echo "3️⃣  Dans le menu latéral, cliquez sur 'SQL Editor'"
echo ""

echo "4️⃣  Exécutez les migrations dans l'ordre suivant :"
echo ""
echo "    Migration 007 - Créer la table workshops :"
echo "    📄 Fichier : supabase/migrations/007_create_workshops_table.sql"
echo ""
read -p "    Appuyez sur Entrée quand c'est fait..."

echo ""
echo "    Migration 008 - Insérer les workshops métiers :"
echo "    📄 Fichier : supabase/migrations/008_seed_workshops.sql"
echo ""
read -p "    Appuyez sur Entrée quand c'est fait..."

echo ""
echo "    Migration 009 - Configurer les politiques RLS :"
echo "    📄 Fichier : supabase/migrations/009_fix_workshops_rls.sql"
echo ""
read -p "    Appuyez sur Entrée quand c'est fait..."

echo ""
echo "5️⃣  Vérifiez votre profil utilisateur :"
echo "    Exécutez dans SQL Editor :"
echo ""
echo "    SELECT id, email, role FROM public.profiles WHERE id = auth.uid();"
echo ""
echo "    ⚠️  Si votre rôle n'est pas 'ADMIN', exécutez :"
echo ""
echo "    UPDATE public.profiles SET role = 'ADMIN' WHERE id = auth.uid();"
echo ""
read -p "    Appuyez sur Entrée quand c'est fait..."

echo ""
echo "6️⃣  Exécutez le script de diagnostic pour vérifier :"
echo "    📄 Fichier : supabase/test_workshops_diagnostic.sql"
echo ""
echo "    Ce script va :"
echo "    - Vérifier que la table existe"
echo "    - Compter les workshops"
echo "    - Tester les permissions"
echo "    - Afficher votre profil"
echo ""
read -p "    Appuyez sur Entrée quand c'est fait..."

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "🌐 Vous pouvez maintenant :"
echo "  - Accéder à l'admin : http://localhost:3000/admin/workshops"
echo "  - Voir les workshops publics : http://localhost:3000/workshops"
echo ""
echo "📖 Pour plus d'informations, consultez :"
echo "  - WORKSHOPS_SUPABASE_GUIDE.md"
echo ""
echo "🐛 En cas de problème :"
echo "  1. Vérifiez que vous êtes bien connecté à Supabase"
echo "  2. Vérifiez que votre rôle est ADMIN"
echo "  3. Consultez la console du navigateur (F12)"
echo "  4. Exécutez le script de diagnostic"
echo ""

# Ouvrir le guide dans le navigateur par défaut
if command -v open &> /dev/null; then
    read -p "Voulez-vous ouvrir le guide complet ? (o/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        echo "📖 Ouverture du guide..."
        open "WORKSHOPS_SUPABASE_GUIDE.md"
    fi
fi

echo ""
echo "✨ Bonne configuration !"
