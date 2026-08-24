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

Sous Linux ou macOS, le fichier `.nvmrc` permet de sélectionner la version
Node attendue avec NVM :

```bash
nvm install
nvm use
```

Sous Windows avec PowerShell et nvm-windows :

```powershell
nvm install 22.22.3
nvm use 22.22.3
```

## Installation

Sous Linux ou macOS avec Bash, clonez le dépôt et placez-vous sur la branche
stable :

```bash
git clone https://github.com/msm-oc-projects/msm-projet-05-fullstack.git
cd msm-projet-05-fullstack
git switch main
```

Sous Windows avec PowerShell :

```powershell
git clone https://github.com/msm-oc-projects/msm-projet-05-fullstack.git
Set-Location msm-projet-05-fullstack
git switch main
```

Créez la configuration locale à partir du modèle, puis remplacez les valeurs d’exemple.

Sous Linux ou macOS avec Bash :

```bash
cp .env.example .env
```

Sous Windows avec PowerShell :

```powershell
Copy-Item .env.example .env
```

Le fichier `.env` contient les secrets locaux et n’est pas versionné.

## Base de données et pgAdmin

Démarrez PostgreSQL et pgAdmin depuis la racine du projet.

Sous Linux ou macOS avec Bash :

```bash
docker compose up -d
docker compose ps
```

Sous Windows avec PowerShell :

```powershell
docker compose up -d
docker compose ps
```

- PostgreSQL : `localhost:5432`
- pgAdmin : <http://localhost:5050>

Les identifiants sont ceux définis dans `.env`. Le serveur PostgreSQL est préconfiguré dans pgAdmin ; son mot de passe doit être saisi lors de la première connexion.

Flyway applique automatiquement les migrations au démarrage du backend :

- `V1__create_mdd_schema.sql` crée le schéma relationnel ;
- `V2__seed_topics.sql` ajoute les sujets de démonstration.

Pour arrêter les services sans supprimer les données, sous Linux ou macOS avec
Bash :

```bash
docker compose down
```

Sous Windows avec PowerShell :

```powershell
docker compose down
```

Pour réinitialiser entièrement les volumes locaux, sous Linux ou macOS avec
Bash :

```bash
docker compose down --volumes
```

Sous Windows avec PowerShell :

```powershell
docker compose down --volumes
```

## Backend

Depuis la racine du projet, sous Linux ou macOS avec Bash :

```bash
cd back
set -a
source ../.env
set +a
./mvnw spring-boot:run
```

Sous Windows avec PowerShell :

```powershell
cd back
Get-Content ..\.env | Where-Object { $_ -match '^[^#][^=]*=' } | ForEach-Object {
  $name, $value = $_ -split '=', 2
  Set-Item -Path "Env:$($name.Trim())" -Value $value.Trim()
}
.\mvnw.cmd spring-boot:run
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

Pour exécuter les tests et produire la couverture JaCoCo dans un nouveau
terminal, sous Linux ou macOS avec Bash :

```bash
cd back
set -a
source ../.env
set +a
./mvnw test
```

Sous Windows avec PowerShell :

```powershell
Set-Location back
Get-Content ..\.env | Where-Object { $_ -match '^[^#][^=]*=' } | ForEach-Object {
  $name, $value = $_ -split '=', 2
  Set-Item -Path "Env:$($name.Trim())" -Value $value.Trim()
}
.\mvnw.cmd test
```

Le rapport est généré dans `back/target/site/jacoco/index.html`.

## Contrat de l’API

Sauf mention « public », les routes exigent l’en-tête `Authorization: Bearer <token>`.

| Méthode | Route | Accès | Corps / paramètres | Succès |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `email`, `username`, `password` | `201` + JWT |
| `POST` | `/api/auth/login` | Public | `identifier` (e-mail ou pseudo), `password` | `200` + JWT |
| `GET` | `/api/me` | JWT | Aucun | `200` + profil |
| `PUT` | `/api/me` | JWT | `email`, `username`, `password` optionnel | `200` + profil |
| `GET` | `/api/topics` | JWT | Aucun | `200` + thèmes et état d’abonnement |
| `POST` | `/api/topics/{id}/subscription` | JWT | Identifiant du thème dans l’URL | `204` |
| `DELETE` | `/api/topics/{id}/subscription` | JWT | Identifiant du thème dans l’URL | `204` |
| `GET` | `/api/articles` | JWT | `sort=asc` ou `sort=desc` | `200` + fil personnalisé |
| `POST` | `/api/articles` | JWT | `topicId`, `title`, `content` | `201` + article |
| `GET` | `/api/articles/{id}` | JWT + abonnement au thème | Identifiant de l’article dans l’URL | `200` + article et commentaires |
| `POST` | `/api/articles/{id}/comments` | JWT + abonnement au thème | `content` | `201` + commentaire |

Erreurs communes : `400` données invalides, `401` authentification absente ou expirée, `403` article hors des thèmes suivis, `404` ressource inconnue, `409` e-mail ou pseudo déjà utilisé. Le serveur renvoie un objet JSON contenant notamment `status` et `message`.

## Frontend

Dans un autre terminal ouvert à la racine du projet, sous Linux ou macOS avec
Bash :

```bash
cd front
npm ci
npm start
```

Sous Windows avec PowerShell :

```powershell
Set-Location front
npm ci
npm start
```

L’application est disponible sur <http://localhost:4200>.

Dans un nouveau terminal ouvert à la racine du projet, exécutez les tests,
produisez la couverture et validez le frontend sous Linux ou macOS avec Bash :

```bash
cd front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
npm run e2e
npm audit --omit=dev
```

Sous Windows avec PowerShell :

```powershell
Set-Location front
npm run build
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
npm run e2e
npm audit --omit=dev
```

Le rapport est généré dans `front/coverage/mdd-client/index.html`. Karma bloque la validation si la couverture globale descend sous 70 % des instructions ou des lignes.
Le test Cypress `front/cypress/e2e/mdd-mvp.cy.ts` demande que PostgreSQL, le back-end et le front-end soient démarrés, avec Node 22.22.3 et un environnement système compatible Cypress.

## Documentation finale

- [Rapport de tests](docs/TEST_REPORT.md)
- [Rapport de revue technique](docs/TECHNICAL_REVIEW.md)
- [Revue UI et conformité aux maquettes](docs/UI_REVIEW.md)
- [Validation end-to-end](docs/E2E_VALIDATION.md)
- [Qualité, performance et conformité](docs/QUALITY_PERFORMANCE_COMPLIANCE.md)
- [FAQ utilisateur](docs/FAQ.md)
- [Historique des versions](CHANGELOG.md)

## Configuration IDE

Ouvrez `mdd.code-workspace` avec VS Code. Les réglages et extensions recommandées couvrent Angular, Java/Spring Boot, SQL, Docker et les fichiers d’environnement.

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
