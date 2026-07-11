# MDD — Monde de Dév

MDD est le MVP d’un réseau social destiné aux développeurs. Il permet de consulter des sujets, de s’y abonner, de publier des articles et de les commenter.

## Stack technique

- Frontend : Angular 22, TypeScript 6, Angular Material/CDK
- Backend : Java 21, Spring Boot 3.5, Spring Data JPA
- Données : PostgreSQL 18, Flyway
- Environnement local : Docker Compose et pgAdmin

## Prérequis

- Git
- Java 21
- Docker avec le plugin Compose
- Node.js 22.22.3 et npm 10 ou supérieur

Le fichier `.nvmrc` permet de sélectionner la version Node attendue avec NVM :

```bash
nvm install
nvm use
```

## Installation

Clonez le dépôt et placez-vous sur la branche de développement :

```bash
git clone https://github.com/msm-oc-projects/msm-projet-05-fullstack.git
cd msm-projet-05-fullstack
git switch develop
```

Créez la configuration locale à partir du modèle, puis remplacez les valeurs d’exemple :

```bash
cp .env.example .env
```

Le fichier `.env` contient les secrets locaux et n’est pas versionné.

## Base de données et pgAdmin

Démarrez PostgreSQL et pgAdmin :

```bash
docker compose up -d
docker compose ps
```

- PostgreSQL : `localhost:5432`
- pgAdmin : <http://localhost:5050>

Les identifiants sont ceux définis dans `.env`. Le serveur PostgreSQL est préconfiguré dans pgAdmin ; son mot de passe doit être saisi lors de la première connexion.

Flyway applique automatiquement les migrations au démarrage du backend :

- `V1__create_mdd_schema.sql` crée le schéma relationnel ;
- `V2__seed_topics.sql` ajoute les sujets de démonstration.

Pour arrêter les services sans supprimer les données :

```bash
docker compose down
```

Pour réinitialiser entièrement les volumes locaux :

```bash
docker compose down --volumes
```

## Backend

Depuis le dossier `back` :

```bash
set -a
source ../.env
set +a
./mvnw spring-boot:run
```

L’API est disponible sur <http://localhost:9000>.

Premier parcours end-to-end disponible :

```http
GET /api/topics
```

Cet endpoint lit les thèmes créés par Flyway dans PostgreSQL et renvoie une liste JSON triée par nom. Le frontend l’utilise pour afficher la page des thèmes.

Les parcours MVP disponibles sont :

- inscription et connexion par e-mail ou nom d'utilisateur ;
- consultation et modification du profil ;
- abonnement depuis les thèmes et désabonnement depuis le profil ;
- fil limité aux thèmes suivis, trié dans les deux sens ;
- création et consultation d'un article ;
- publication de commentaires non récursifs ;
- déconnexion côté navigateur.

Les routes métier sous `/api/**` exigent un jeton JWT, sauf `/api/auth/register` et `/api/auth/login`. Définissez `JWT_SECRET` dans `.env` avec une valeur Base64 représentant au moins 32 octets. Le jeton est conservé par le frontend pour maintenir la connexion entre les sessions du navigateur.

L’interface reprend les principes des maquettes MDD : violet principal, cartes gris clair, formulaires centrés, grille deux colonnes sur desktop et une colonne sur mobile. La navigation devient un menu accessible sous 700 px. Les contrôles disposent d’un focus visible, de libellés associés et d’attributs ARIA lorsque leur fonction n’est pas exprimée par du texte.

La sécurité vérifie la signature, l’expiration et l’émetteur des JWT. CORS est limité à l’origine configurée, les en-têtes HTTP de Spring Security sont activés et le frontend supprime la session locale puis redirige vers la connexion après une réponse `401`.

Exécuter les tests :

```bash
set -a
source ../.env
set +a
./mvnw test
```

## Frontend

Depuis le dossier `front` :

```bash
npm ci
npm start
```

L’application est disponible sur <http://localhost:4200>.

Commandes de validation :

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm audit --omit=dev
```

## Configuration IDE

Ouvrez `mdd-fullstack.code-workspace` avec VS Code. Les réglages et extensions recommandées couvrent Angular, Java/Spring Boot, SQL, Docker et les fichiers d’environnement.

Ne versionnez jamais `.env`, un mot de passe, un jeton JWT ou une clé privée. Toute nouvelle variable requise doit être documentée avec une valeur factice dans `.env.example`.

## Workflow Git

- `main` : versions stables présentables ;
- `develop` : intégration continue des fonctionnalités ;
- `feature/<nom>` : développement isolé d’une fonctionnalité.

Les messages de commit suivent Conventional Commits, par exemple :

```text
feat(auth): add JWT login endpoint
fix(front): handle empty news feed
test(post): cover article creation rules
docs(readme): document local development setup
```
