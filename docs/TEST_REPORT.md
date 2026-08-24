# Rapport de tests — MDD

Date de validation : 24 août 2026.

## Périmètre et environnement

La campagne couvre l’API, la sécurité JWT, les règles métier principales, la persistance PostgreSQL, les services HTTP Angular, les composants, le build de production et un scénario Cypress validé. Les tests unitaires et d’intégration ont été exécutés avec Java 21.0.12, Spring Boot 3.5.8, PostgreSQL 18.4, Flyway 11.19.0, Angular 22.0.6, Node 22.23.0 et Chrome Headless 151.

## Résultats automatisés

| Niveau | Outils | Résultat | Couverture |
|---|---|---:|---:|
| Backend unitaire/intégration | JUnit 5, Spring Boot Test, MockMvc, Spring Security Test, PostgreSQL, JaCoCo 0.8.13 | 3/3 tests réussis | lignes 86,12 %, instructions 84,03 %, branches 45,24 % |
| Frontend services/composants | Jasmine 4, Angular TestBed, Karma 6, Chrome Headless, Istanbul | 13/13 tests réussis | lignes 79,85 %, instructions 78,33 %, fonctions 62,68 %, branches 10,81 % |
| Build frontend | Angular CLI, configuration production | réussi | bundle initial 390,68 kB brut |
| Audit dépendances de production | `npm audit --omit=dev` | 0 vulnérabilité connue | sans objet |
| Parcours end-to-end Cypress | Cypress, navigateur Chrome, API Spring Boot, PostgreSQL | scénario validé | `front/cypress/e2e/mdd-mvp.cy.ts` |

La cible de 70 % est satisfaite sur les métriques globales principales, lignes et instructions. Les branches et fonctions sont publiées séparément pour ne pas masquer les zones encore peu exercées. Karma applique automatiquement un seuil global de 70 % sur les lignes et les instructions.

## Scénarios couverts

- démarrage du contexte Spring et validation des migrations Flyway ;
- refus des routes protégées sans JWT ou avec un jeton invalide, ainsi que du détail et des commentaires d'un article par un utilisateur non abonné ;
- inscription, connexion par pseudo et e-mail, contraintes de mot de passe ;
- lecture des thèmes, abonnement et désabonnement ;
- création et tri ascendant/descendant du fil, rejet d’un tri inconnu ;
- création, détail et commentaire d’un article ;
- lecture et modification du profil ;
- appels HTTP Angular, composants d’authentification, fil, création, détail et profil ;
- réponses d’erreur visibles par l’utilisateur.

Le parcours backend est transactionnel : ses écritures sont annulées après le test et ne polluent pas la base locale.

## Reproduction

Backend, après démarrage de PostgreSQL et chargement de `.env` :

```bash
cd back
set -a
source ../.env
set +a
./mvnw test
```

Frontend :

```bash
cd front
npm ci
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
npm run build
npm run e2e
npm audit --omit=dev
```

Rapports HTML reproductibles : `back/target/site/jacoco/index.html` et `front/coverage/mdd-client/index.html`. Ces artefacts générés ne sont pas versionnés.

Note environnement : le scénario Cypress est versionné et son lanceur compatible est fourni par `front/scripts/run-e2e.mjs`. Il valide le parcours utilisateur avec Node 22.22.3, PostgreSQL, l'API et le frontend démarrés.

## Choix des outils et limites

JUnit est conservé pour l’écosystème Spring. Le socle Angular fourni utilise Jasmine/Karma ; le remplacer par Jest en fin de MVP ajouterait une migration sans gain fonctionnel immédiat. Cypress est ajouté pour couvrir le parcours réel inscription → abonnement → publication → commentaire → profil → déconnexion. La prochaine amélioration consiste à brancher ce scénario dans la CI avec démarrage automatisé de PostgreSQL, du back-end et du front-end, afin de figer son exécution dans un environnement maîtrisé.
