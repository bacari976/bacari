# Guide de Déploiement

> ⚠️ À supprimer de GitHub après utilisation

## 1. Configuration GitHub

1. Créez un compte sur [GitHub](https://github.com)
2. Dans la barre latérale, cliquez sur "Repositories"
3. Créez un nouveau repository avec le nom de votre choix
4. Installez [Visual Studio Code](https://code.visualstudio.com)
5. Ouvrez un terminal puis écrire git clone "URL_GITHUB_DU_PROJET (la ou tu lis ce readme)"
6. Normalement le projet est clone et ta accés au dossier

Rappel : pour acceder au dossier depuis le terminal : cd + nom du dossier

## 2. Installation des Dépendances

1. Installez [Node.js](https://nodejs.org) si ce n'est pas déjà fait
2. Ouvrez le terminal dans VS Code
3. Exécutez les commandes suivantes :
   ```bash
   npm init
   npm install
   ```
4. Copiez-collez les commandes Git fournies par GitHub (dans le repertoire crée avant)
5. Vérifiez que vos fichiers sont bien présents dans le repository

## 3. Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre repository GitHub
3. Le déploiement se fera automatiquement !

Votre site est en ligne !