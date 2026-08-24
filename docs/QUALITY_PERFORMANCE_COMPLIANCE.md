# Qualite, performance et conformite — MDD

Date de revue : 24 août 2026.

## Outils de qualite et d'analyse

| Outil | Usage | Preuve |
|---|---|---|
| JUnit 5 / Spring Boot Test | Tests back-end et integration API/base | `docs/TEST_REPORT.md` |
| JaCoCo 0.8.13 | Couverture back-end | 86,12 % lignes |
| Jasmine / Karma / Istanbul | Tests front-end et couverture Angular | 79,85 % lignes |
| Angular build production | Verification compilation et bundle | bundle initial 390,68 kB brut |
| `npm audit --omit=dev` | Analyse des dependances front de production | 0 vulnerabilite connue |
| Flyway | Controle de schema et migrations reproductibles | `V1__create_mdd_schema.sql`, `V2__seed_topics.sql` |

## Performance

Le MVP est dimensionne pour un deploiement interne. Les optimisations retenues sont volontairement simples et mesurables :

- API stateless avec JWT, ce qui facilite la replication horizontale du back-end ;
- schema relationnel contraint et indexe sur les cles etrangeres critiques ;
- tri du fil effectue en base de donnees ;
- DTO dedies pour limiter les donnees exposees au front-end ;
- build Angular de production valide ;
- chargement responsive sans image lourde autre que le logo.

Les optimisations a ajouter avant montee en charge sont documentees : pagination du fil et des commentaires, mesures de temps de reponse, analyse des requetes SQL, cache cible uniquement apres mesure, et scenario Cypress en CI.

## Conformite et confidentialite

MDD manipule peu de donnees personnelles dans le MVP : e-mail, nom d'utilisateur et mot de passe hache. Les mesures deja appliquees sont :

- aucun secret reel versionne ;
- `.env` ignore et `.env.example` fourni avec valeurs factices ;
- mots de passe haches avec BCrypt ;
- logs d'erreur generiques cote client et message serveur sans mot de passe ni jeton ;
- erreurs inattendues journalisees cote serveur sans renvoyer la stacktrace a l'utilisateur ;
- routes privees protegees par Spring Security ;
- politique CORS limitee a l'origine configuree.

Avant ouverture publique, il faudra ajouter les documents juridiques complets : mentions legales, politique de confidentialite, duree de conservation, procedure de suppression de compte et information sur les droits des utilisateurs. Pour le MVP interne, ces points sont identifies et ne bloquent pas la demonstration technique.
