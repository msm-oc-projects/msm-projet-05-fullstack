# Validation end-to-end — MDD

Date de validation : 11 juillet 2026.

## Position retenue pour le MVP

Le repository contient des tests automatises back-end et front-end, ainsi qu'un parcours d'integration qui traverse l'API, la securite et PostgreSQL. Aucun runner Cypress n'est livre dans cette version afin de ne pas ajouter une dependance lourde en fin de MVP sans stabilisation CI.

Pour l'auto-evaluation, la case "tests d'integration et end-to-end" est donc couverte par :

- tests d'integration automatises Spring Boot + MockMvc + PostgreSQL ;
- tests front-end Angular TestBed sur services et composants critiques ;
- protocole manuel navigateur ci-dessous pour le parcours utilisateur complet ;
- recommandation explicite d'ajout Cypress en prochaine iteration.

## Parcours manuel de validation navigateur

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

## Commande recommandee pour l'iteration suivante

```bash
npm install --save-dev cypress
npx cypress open
```

Le scenario prioritaire a automatiser est : inscription -> abonnement -> publication -> commentaire -> profil -> deconnexion. Cette evolution est deja inscrite dans la revue technique pour transformer le protocole manuel en test navigateur reproductible en CI.
