@echo off
REM Script de lancement rapide - Démarche Compétence CIPREL
REM Raccourci pour démarrer l'environnement de développement

echo 🚀 Lancement de l'environnement de développement...
echo.

REM Vérifier si le script principal existe
if exist "scripts\Start-Dev.ps1" (
    REM Exécuter le script PowerShell principal
    powershell -ExecutionPolicy Bypass -File "scripts\Start-Dev.ps1" %*
) else (
    echo ❌ Script principal non trouvé : scripts\Start-Dev.ps1
    echo Veuillez vous assurer d'être dans le répertoire racine du projet.
    pause
    exit /b 1
)
