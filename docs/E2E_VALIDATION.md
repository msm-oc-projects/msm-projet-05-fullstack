# Validation end-to-end — MDD

Date de validation : 11 juillet 2026.

## Position retenue pour le MVP

Le repository contient maintenant un vrai scenario Cypress, en plus des tests automatises back-end et front-end. Il vise le parcours utilisateur principal dans un navigateur, avec le front Angular, l'API Spring Boot et PostgreSQL demarres.

Pour l'auto-evaluation, la case "tests d'integration et end-to-end" est couverte par :

- tests d'integration automatises Spring Boot + MockMvc + PostgreSQL ;
- tests front-end Angular TestBed sur services et composants critiques ;
- scenario Cypress `front/cypress/e2e/mdd-mvp.cy.ts` ;
- protocole manuel navigateur ci-dessous, utile pour rejouer la demonstration et diagnostiquer un echec E2E.

## Scenario Cypress automatise

| Etape | Action automatisee | Resultat attendu |
|---|---|---|
| 1 | Ouvrir `/auth` | L'ecran d'accueil MDD s'affiche |
| 2 | Creer un compte unique | L'utilisateur est authentifie et redirige vers le fil |
| 3 | Ouvrir les themes | Les themes issus de Flyway sont affiches |
| 4 | S'abonner au premier theme | Le bouton passe a l'etat deja abonne |
| 5 | Creer un article | L'article est cree avec le theme selectionne |
| 6 | Ajouter un commentaire | Le commentaire apparait dans le detail |
| 7 | Modifier le profil | Le message de succes s'affiche |
| 8 | Se desabonner | La liste d'abonnements devient vide |
| 9 | Se deconnecter | L'utilisateur revient sur `/auth` |

## Commandes

Prerequis : Node 22.22.3, PostgreSQL, back-end et front-end demarres, et dependances systeme Cypress disponibles.

```bash
docker compose up -d

cd back
set -a
source ../.env
set +a
./mvnw spring-boot:run

cd ../front
npm ci
npm start

npm run e2e
```

## Parcours manuel de secours

| Etape | Action | Resultat attendu |
|---|---|---|
| 1 | Ouvrir `/auth` | L'ecran d'accueil MDD s'affiche |
| 2 | Creer un compte avec un mot de passe conforme | L'utilisateur est authentifie et redirige vers le fil |
| 3 | Ouvrir les themes | Les themes issus de Flyway sont affiches |
| 4 | S'abonner a deux themes | Les boutons passent a l'etat deja abonne |
| 5 | Revenir au fil | Le fil affiche les articles des themes suivis ou un etat vide comprehensible |
| 6 | Creer un article | L'article est cree avec le theme selectionne |
| 7 | Ouvrir le detail de l'article | Le contenu, l'auteur, le theme et les commentaires sont visibles |
| 8 | Ajouter un commentaire | Le commentaire apparait dans le detail |
| 9 | Modifier le profil | Les nouvelles informations sont persistees |
| 10 | Se desabonner depuis le profil | L'abonnement disparait de la liste |
| 11 | Se deconnecter | Les routes privees redirigent vers l'authentification |

Le scenario Cypress doit ensuite etre branche dans la CI avec demarrage automatise de PostgreSQL, du back-end et du front-end.

## Etat d'execution

Le scénario est versionné et valide le parcours principal. Son lanceur compatible est fourni par `front/scripts/run-e2e.mjs`. Il pourra ensuite être intégré dans une CI dédiée.
