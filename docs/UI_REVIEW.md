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
Elles reprennent l'asset officiel `front/src/assets/logo_p6.png`, egalement utilise par le code source de l'ecran d'authentification.

| Capture | Format conseille | Commentaire |
|---|---|---|
| `docs/screenshots/auth-desktop.png` | 1440 x 900 | Accueil MDD desktop |
| `docs/screenshots/auth-mobile.png` | 390 x 844 | Accueil MDD mobile |

## Validation des ecrans connectes

Les ecrans connectes sont valides par revue de leurs composants Angular, de leurs regles responsive et des tests associes. Les routes privees sont protegees par la garde Angular et par Spring Security ; elles s'appuient donc sur les memes contraintes de navigation que les captures d'authentification.

| Ecran | Controle applique | Resultat |
|---|---|---|
| Fil et creation d'article | Grille deux colonnes puis une colonne, boutons et formulaires accessibles | Conforme |
| Themes et profil | Cartes adaptees, abonnement inactif et menu compact sous 700 px | Conforme |
| Detail et commentaires | Metadonnees lisibles, champ de commentaire associe a son libelle et empilement mobile | Conforme |

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

Ce protocole permet de rejouer la revue visuelle dans le navigateur a partir de `http://localhost:4200`. Les captures versionnees, la revue de code et les tests automatises constituent ensemble la preuve de conformite UI.
