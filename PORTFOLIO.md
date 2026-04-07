# Todo App — Application web de gestion de tâches

## Présentation

Application web de gestion de tâches construite sur une stack moderne et robuste. L'objectif de ce projet n'est pas de briller par son design ou son UX, mais de démontrer la maîtrise d'un ensemble de technologies que j'utilise au quotidien et dans lequel j'ai développé une réelle expertise.

La vue principale organise les tâches par semaine, avec navigation entre les semaines et gestion complète via des modales.

---

## Stack technique

### Front-end

| Technologie | Rôle |
|---|---|
| **React 19** + **TypeScript** | UI et typage statique |
| **Vite** + **SWC** | Bundler et compilateur ultra-rapide |
| **React Router v7** | Routing côté client |
| **TanStack Query v5** | Server state management (cache, invalidation, mutations) |
| **React Hook Form** | Gestion et validation des formulaires |
| **Axios** | Client HTTP avec interceptors |
| **SCSS Modules** | Styles scopés par composant |
| **Motion** | Animations |

### Outillage

| Outil | Rôle |
|---|---|
| **ESLint** + **Prettier** | Qualité et cohérence du code |
| **Docker** | Conteneurisation de l'application |
| **GitHub Actions** | CI/CD — déploiement automatisé sur VPS Ubuntu via SSH |

---

## Fonctionnalités

### Authentification complète
- Inscription et connexion par email/mot de passe
- Connexion via **Google OAuth**
- Vérification d'email obligatoire à l'inscription
- Renvoi du mail de vérification
- Mot de passe oublié et réinitialisation par lien sécurisé

### Gestion des tokens JWT
La couche HTTP est construite autour de deux instances Axios distinctes. L'instance principale embarque un interceptor qui gère silencieusement le renouvellement du token d'accès à l'expiration (refresh token via cookie HTTP-only). Un mécanisme de file d'attente évite les appels concurrents au refresh : toutes les requêtes en erreur 401 sont mises en attente le temps que le nouveau token soit obtenu, puis rejouées automatiquement.

### Tâches
- Vue hebdomadaire avec navigation semaine par semaine
- Création, modification et suppression de tâches
- Assignation de tags et de dates d'échéance

### Profil utilisateur
- Mise à jour des informations personnelles
- Changement de mot de passe
- Suppression du compte

---

## Architecture front-end

La logique est organisée en trois couches bien séparées :

1. **`src/api/`** — fonctions pures qui effectuent les appels HTTP
2. **`src/hooks/api/`** — hooks TanStack Query qui wrappent les fonctions API (queries et mutations), gèrent le cache et l'invalidation
3. **`src/components/` et `src/pages/`** — composants React qui consomment les hooks sans se soucier du transport

Cette séparation rend chaque couche testable indépendamment et facilite la maintenance.

---

## Déploiement

Le pipeline GitHub Actions se déclenche à chaque push sur la branche `development`. Il se connecte au serveur via SSH et relance le conteneur Docker du client avec la dernière image buildée.

```
push → GitHub Actions → SSH → docker-compose up --build
```
