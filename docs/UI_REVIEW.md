# Revue UI et conformité aux maquettes — MDD

Date de revue : 11 juillet 2026.

## Objectif

Cette annexe sert de preuve pour l'indicateur d'auto-evaluation relatif aux composants, a l'architecture UI, au responsive et aux maquettes Figma. Le projet ne vise pas un rendu pixel perfect ; l'objectif retenu est une coherence globale avec les ecrans fournis par Juana.

## Ecrans couverts

| Parcours | Route | Points verifies |
|---|---|---|
| Accueil et authentification | `/auth` | Logo MDD, ecran centre, inscription, connexion, retour, messages d'erreur |
| Fil d'actualite | `/articles` | Navigation principale, cartes article, tri chronologique, etat vide |
| Creation d'article | `/articles/new` | Formulaire, selection du theme, validation et retour utilisateur |
| Detail d'article | `/articles/:id` | Article, auteur, theme, commentaires et ajout d'un commentaire |
| Themes | `/topics` | Grille de themes, bouton d'abonnement, etat deja abonne |
| Profil | `/profile` | Edition du profil, deconnexion, liste des abonnements et desabonnement |

## Grille de comparaison Figma

| Critere | Application dans MDD | Statut |
|---|---|---|
| Hierarchie visuelle | Titres, cartes, formulaires et boutons principaux reprennent la structure des maquettes | Conforme |
| Couleurs | Violet principal, cartes gris clair et fond blanc conserves | Conforme |
| Espacements | Grilles et formulaires centres avec espacements reguliers | Conforme |
| Responsive | Deux colonnes sur desktop, une colonne sur mobile, menu compact sous 700 px | Conforme |
| Accessibilite de base | Libelles de formulaire, `aria-label`, `role="alert"` et focus visible | Conforme |
| Perimetre MVP | Pas de fonctionnalite hors specification ajoutee a l'interface | Conforme |

## Captures d'ecran versionnees

Deux captures publiques sont versionnees dans `docs/screenshots` afin de prouver le rendu desktop/mobile de l'ecran d'accueil et d'authentification.

| Capture | Format conseille | Commentaire |
|---|---|---|
| `docs/screenshots/auth-desktop.png` | 1440 x 900 | Accueil MDD desktop |
| `docs/screenshots/auth-mobile.png` | 390 x 844 | Accueil MDD mobile |

## Captures complementaires a produire avant une demonstration visuelle complete

Les captures connectees demandent PostgreSQL, le back-end, un compte de demonstration et des donnees creees dans l'application.

| Capture | Format conseille | Commentaire |
|---|---|---|
| `feed-desktop.png` | 1440 x 900 | Fil apres abonnement a au moins deux themes |
| `topics-mobile.png` | 390 x 844 | Liste des themes et bouton deja abonne |
| `article-detail-desktop.png` | 1440 x 900 | Detail avec commentaires |
| `profile-mobile.png` | 390 x 844 | Profil et abonnements |

## Commandes de reproduction

```bash
nvm install
nvm use
docker compose up -d

cd back
set -a
source ../.env
set +a
./mvnw spring-boot:run

cd ../front
npm ci
npm start
```

Les captures peuvent ensuite etre prises dans le navigateur a partir de `http://localhost:4200`. Ce protocole complete les tests automatises : il prouve le rendu visuel, tandis que Jasmine/Karma et JUnit verifient le comportement.
