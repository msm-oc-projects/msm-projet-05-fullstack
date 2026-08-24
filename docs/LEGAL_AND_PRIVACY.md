# Conformité et confidentialité

## Périmètre du MVP

MDD est un MVP interne. Il traite uniquement les données nécessaires aux
parcours d'inscription, d'authentification et de publication : adresse e-mail,
nom d'utilisateur, mot de passe haché, abonnements, articles et commentaires.

Les mots de passe ne sont jamais conservés en clair. Les secrets d'exécution
sont fournis par `.env`, ignoré par Git, et `.env.example` ne contient que des
valeurs fictives.

## Mesures techniques

- les routes privées sont protégées par Spring Security et un JWT signé et
  expirant ;
- les entrées sont validées côté serveur et côté client ;
- les DTO limitent les données exposées par l'API ;
- les erreurs renvoyées au navigateur restent génériques ;
- les traces serveur ne contiennent ni mot de passe ni jeton ;
- CORS est limité à l'origine configurée ;
- les dépendances front de production sont contrôlées avec `npm audit`.

## Conservation et suppression

Les données sont conservées dans la base locale du MVP pendant la durée de
validation. Une suppression de compte devra supprimer ou anonymiser les
articles, commentaires et abonnements associés avant toute ouverture publique.
Cette opération n'est pas exposée dans le périmètre fonctionnel actuel et doit
être ajoutée avant une mise en production publique.

## Documents juridiques

Les mentions légales, la politique de confidentialité complète, l'identité du
responsable de traitement, les durées de conservation définitives et le point
de contact pour l'exercice des droits doivent être complétés avec les
informations de l'organisation avant diffusion publique. Aucun faux contact ou
contenu juridique non validé n'est inventé dans ce dépôt.

## Décisions avant ouverture publique

1. Remplacer le stockage local du JWT par un cookie `HttpOnly`, `Secure` et
   `SameSite` adapté au déploiement.
2. Ajouter la suppression de compte et la politique de rétention associée.
3. Faire valider les mentions légales et la politique de confidentialité.
4. Ajouter la journalisation de sécurité et une limitation de débit adaptées.
