#!/bin/bash

# Script de vérification rapide de la configuration Supabase
# Ce script vérifie que tout est correctement configuré

echo "🔍 Vérification de la configuration Workshops CIPREL"
echo "====================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
PROJECT_DIR="/Users/houedanou/Documents/GitHub/demarchecompetencesciprel"

# 1. Vérifier les fichiers de migration
echo "📁 Vérification des fichiers de migration..."

if [ -f "$PROJECT_DIR/supabase/migrations/007_create_workshops_table.sql" ]; then
    echo -e "${GREEN}✓${NC} Migration 007 trouvée"
else
    echo -e "${RED}✗${NC} Migration 007 manquante"
fi

if [ -f "$PROJECT_DIR/supabase/migrations/008_seed_workshops.sql" ]; then
    echo -e "${GREEN}✓${NC} Migration 008 trouvée"
else
    echo -e "${RED}✗${NC} Migration 008 manquante"
fi

if [ -f "$PROJECT_DIR/supabase/migrations/009_fix_workshops_rls.sql" ]; then
    echo -e "${GREEN}✓${NC} Migration 009 trouvée"
else
    echo -e "${RED}✗${NC} Migration 009 manquante"
fi

echo ""

# 2. Vérifier les variables d'environnement
echo "🔐 Vérification des variables d'environnement..."

if [ -f "$PROJECT_DIR/.env.local" ]; then
    echo -e "${GREEN}✓${NC} Fichier .env.local trouvé"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" "$PROJECT_DIR/.env.local"; then
        echo -e "${GREEN}✓${NC} SUPABASE_URL configuré"
    else
        echo -e "${RED}✗${NC} SUPABASE_URL manquant"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$PROJECT_DIR/.env.local"; then
        echo -e "${GREEN}✓${NC} SUPABASE_ANON_KEY configuré"
    else
        echo -e "${RED}✗${NC} SUPABASE_ANON_KEY manquant"
    fi
else
    echo -e "${RED}✗${NC} Fichier .env.local manquant"
fi

echo ""

# 3. Vérifier les composants
echo "⚛️  Vérification des composants..."

if [ -f "$PROJECT_DIR/src/app/(dashboard)/admin/workshops/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} Interface admin trouvée"
else
    echo -e "${RED}✗${NC} Interface admin manquante"
fi

if [ -f "$PROJECT_DIR/src/app/workshops/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} Page publique trouvée"
else
    echo -e "${RED}✗${NC} Page publique manquante"
fi

if [ -f "$PROJECT_DIR/src/hooks/useWorkshops.ts" ]; then
    echo -e "${GREEN}✓${NC} Hook useWorkshops trouvé"
else
    echo -e "${RED}✗${NC} Hook useWorkshops manquant"
fi

echo ""

# 4. Vérifier la documentation
echo "📚 Vérification de la documentation..."

if [ -f "$PROJECT_DIR/WORKSHOPS_SUPABASE_GUIDE.md" ]; then
    echo -e "${GREEN}✓${NC} Guide complet trouvé"
else
    echo -e "${RED}✗${NC} Guide complet manquant"
fi

if [ -f "$PROJECT_DIR/WORKSHOPS_QUICKSTART.md" ]; then
    echo -e "${GREEN}✓${NC} Quick start trouvé"
else
    echo -e "${RED}✗${NC} Quick start manquant"
fi

if [ -f "$PROJECT_DIR/WORKSHOPS_RESUME.md" ]; then
    echo -e "${GREEN}✓${NC} Résumé trouvé"
else
    echo -e "${RED}✗${NC} Résumé manquant"
fi

echo ""

# 5. Instructions suivantes
echo "📋 PROCHAINES ÉTAPES :"
echo ""
echo -e "${YELLOW}1.${NC} Allez sur https://supabase.com/dashboard"
echo -e "${YELLOW}2.${NC} Ouvrez votre projet : yuyjwspittftodncnfbd"
echo -e "${YELLOW}3.${NC} Dans SQL Editor, exécutez les migrations 007, 008 et 009"
echo -e "${YELLOW}4.${NC} Vérifiez votre profil : SELECT * FROM profiles WHERE id = auth.uid()"
echo -e "${YELLOW}5.${NC} Si nécessaire : UPDATE profiles SET role = 'ADMIN' WHERE id = auth.uid()"
echo -e "${YELLOW}6.${NC} Testez : npm run dev puis allez sur /admin/workshops"
echo ""

# 6. Liens utiles
echo "🔗 LIENS UTILES :"
echo ""
echo "  • Supabase Dashboard : https://supabase.com/dashboard"
echo "  • Votre projet : https://yuyjwspittftodncnfbd.supabase.co"
echo "  • Admin local : http://localhost:3000/admin/workshops"
echo "  • Public local : http://localhost:3000/workshops"
echo ""

# 7. Ouvrir les fichiers importants
echo "📖 Voulez-vous ouvrir les guides ? (o/n)"
read -n 1 -r
echo ""

if [[ $REPLY =~ ^[Oo]$ ]]; then
    if command -v code &> /dev/null; then
        code "$PROJECT_DIR/WORKSHOPS_QUICKSTART.md"
        code "$PROJECT_DIR/supabase/migrations/007_create_workshops_table.sql"
        code "$PROJECT_DIR/supabase/migrations/008_seed_workshops.sql"
        code "$PROJECT_DIR/supabase/migrations/009_fix_workshops_rls.sql"
        echo -e "${GREEN}✓${NC} Fichiers ouverts dans VS Code"
    else
        open "$PROJECT_DIR/WORKSHOPS_QUICKSTART.md"
        echo -e "${GREEN}✓${NC} Guide ouvert"
    fi
fi

echo ""
echo "✨ Vérification terminée !"
echo ""
