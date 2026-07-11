# FAQ utilisateur — MDD

## Compte et connexion

**Puis-je me connecter avec mon e-mail ou mon nom d’utilisateur ?**  
Oui, les deux sont acceptés avec le même mot de passe.

**Pourquoi mon inscription est-elle refusée ?**  
Vérifiez le format de l’e-mail, l’unicité de l’e-mail et du pseudo, ainsi que le mot de passe : au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.

**Pourquoi suis-je renvoyé vers la page de connexion ?**  
La session a probablement expiré ou le jeton n’est plus valide. Reconnectez-vous. Si le problème persiste, effacez les données locales du site puis recommencez.

## Thèmes et fil d’actualité

**Pourquoi mon fil est-il vide ?**  
Le fil ne montre que les articles des thèmes suivis. Ouvrez « Thèmes » et abonnez-vous à au moins un sujet.

**Comment me désabonner ?**  
Ouvrez « Profil », puis utilisez « Se désabonner » sur le thème concerné.

**Comment changer l’ordre du fil ?**  
Le bouton de tri alterne entre les articles les plus récents et les plus anciens.

## Articles et commentaires

**Comment publier un article ?**  
Depuis le fil, choisissez « Créer un article », sélectionnez un thème et renseignez un titre et un contenu.

**Pourquoi le bouton de publication reste-t-il indisponible ?**  
Un thème, un titre et un contenu sont obligatoires. Les champs vides ou composés uniquement d’espaces sont refusés.

**Puis-je répondre à un commentaire ?**  
Non. Le MVP prévoit uniquement des commentaires simples, non imbriqués.

## Erreurs courantes

**« Impossible de charger… » apparaît.**  
Vérifiez que le backend fonctionne sur le port 9000 et que PostgreSQL est démarré. Rechargez ensuite la page.

**Une erreur indique que l’e-mail ou le pseudo existe déjà.**  
Choisissez une autre valeur ou connectez-vous au compte existant.

**L’affichage mobile semble incomplet.**  
Utilisez le bouton de menu dans l’en-tête. Si nécessaire, rechargez la page après avoir changé l’orientation de l’écran.

Pour préserver votre compte, ne partagez jamais votre mot de passe ni un jeton de connexion.
