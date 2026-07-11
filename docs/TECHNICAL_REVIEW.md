# Rapport de revue technique — MDD

Date de revue : 11 juillet 2026.

## Conclusion

Le MVP est cohérent, exécutable et présentable : architecture client–serveur en couches, contrat REST limité au besoin, données relationnelles contraintes, sécurité JWT stateless et interface responsive. Les corrections bloquantes détectées pendant la revue ont été intégrées et les builds/tests sont verts. Les points restants sont des améliorations avant exposition publique, pas des blocages pour le déploiement interne demandé.

## Forces constatées

- responsabilités séparées entre contrôleurs, services, repositories, DTO et composants Angular ;
- migrations Flyway versionnées et modèle JPA validé contre PostgreSQL ;
- mots de passe hachés, JWT signé et expirant, CORS restreint, routes protégées par défaut ;
- validation des entrées, statuts HTTP explicites et gestion centralisée des erreurs ;
- transactions de service et contraintes d’unicité garantissant la cohérence ;
- responsive desktop/mobile, navigation clavier, focus visible, libellés et zones d’alerte accessibles ;
- tests reproductibles traversant contrôleur, métier, repository et base réelle.

## Constats et décisions

| Priorité | Constat | Décision / état |
|---|---|---|
| Haute | La couverture Angular initiale ne comptait que les fichiers importés par les tests | Corrigé : instrumentation du module complet, tests composants ajoutés et seuil 70 % imposé |
| Haute | Le parcours d’intégration pouvait laisser des utilisateurs/articles en base locale | Corrigé : test transactionnel avec rollback automatique |
| Moyenne | Une valeur de tri inconnue était interprétée silencieusement comme descendante | Corrigé : réponse `400 Tri invalide` et test associé |
| Moyenne | La version Flyway gérée signalait PostgreSQL 18 comme non supporté | Corrigé : Flyway 11.19.0, validation et migrations réussies sur PostgreSQL 18.4 |
| Moyenne | Certains chargements front n’exposaient pas leur erreur | Corrigé sur le fil et la création d’article ; messages accessibles conservés |
| Faible | `ITopicService` n’avait qu’une implémentation et n’apportait pas de frontière utile | Corrigé : injection directe du service, abstraction supprimée |
| Moyenne | Le JWT est stocké dans le stockage local du navigateur | Accepté pour le MVP interne ; migrer vers cookie `HttpOnly`, `Secure`, `SameSite` avant ouverture publique |
| Moyenne | Pas de pagination du fil ni des commentaires | À ajouter seulement lorsque le volume le justifiera |
| Moyenne | Pas encore de parcours navigateur Cypress automatisé | Backlog CI ; les composants et le parcours backend/base sont automatisés |
| Faible | Plusieurs templates Angular restent inline | Acceptable à cette taille ; extraire HTML/SCSS lorsque les écrans évolueront |

## Revue par domaine

**Sécurité.** Aucun secret réel n’est versionné, `.env` est ignoré, BCrypt protège les mots de passe et Spring Security reste stateless. Avant un usage public : cookie HttpOnly, rotation/révocation, limitation de débit, journalisation de sécurité et analyse automatisée des dépendances backend.

**Données.** Les relations utilisateur–abonnement–thème–article–commentaire correspondent aux besoins. Flyway est la source du schéma et Hibernate utilise `validate`, ce qui évite une dérive silencieuse. Une base éphémère Testcontainers rendrait la CI indépendante de Docker Compose local.

**Maintenabilité.** Les DTO empêchent d’exposer les entités JPA. Les services contiennent la logique et les contrôleurs restent fins. Les prochains gains seraient l’extraction des templates, une pagination standard et des tests unitaires ciblés sur chaque branche d’erreur.

**Performance.** Le MVP ne nécessite ni cache ni architecture évènementielle. Les tris sont effectués en base. Pour monter en charge : index guidés par mesures, pagination, analyse des requêtes et métriques avant toute optimisation.

## Recommandations ordonnées

1. Ajouter en CI le build frontend, les deux campagnes de tests et leurs seuils.
2. Ajouter Testcontainers puis un scénario Cypress métier complet.
3. Remplacer le stockage local du JWT par un cookie sécurisé avant ouverture externe.
4. Ajouter pagination et observabilité uniquement avec des besoins/volumes mesurés.
