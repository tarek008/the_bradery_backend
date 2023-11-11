# the_bradery_backend

The_bradery_backend est dédié à la gestion d'un système de panier et au processus d'achat en ligne.
Il permet aux utilisateurs d'ajouter des articles au panier, assure la mise à jour du stock en temps réel, traite les paiements et enregistre les commandes dans la base de données. 

# Preview

Pour voir la version Live de l'application, visitez le site [The_bradery](https://the-bradery-frontend.vercel.app/) site.

## UML class diagram

Le diagramme de classes UML offre une vue d'ensemble de l'architecture du système et des relations entre les différents composants.

![usage example](https://github.com/tarek008/the_bradery_backend/blob/main/diagramme_classe_the_bradery.png)

## Development

1. Configurez la base de données en créant un fichier .env dans le répertoire ./src/config et en ajoutant la configuration suivante :
 ```bash
DB_NAME=sql11660785
DB_USER=sql11660785
DB_HOST=sql11.freemysqlhosting.net
DB_PASS=TXnT5PjSKY
PRIVATEKEY=WWWWWWWW
STRIPE_SECRET_KEY=sk_test_51O9ZqyE5zAXDvYrTd6ylXBSqrYV3NxnZLyR81L2ddAmXx7HQceCjcz3H4LOEMkVJYjBB5OqIKcFVWnGthSn25W9600iwNmrzUS
```
2. Installez les dépendances requises :
```bash
npm install
```
3. Lancez le projet:
```bash
npm run start
```

Testing :

Pour exécuter la suite de tests du projet, lancez la commande suivante :
```bash
npm run test
```
Ceci exécute les tests unitaires situés dans le dossier __tests__.



# Structure du projet

Une structure de projet très simple :
- `src`: Ce dossier est le conteneur principal de tout le code de votre application.
  - `services` : Responsable de la logique métier principale, c'est ici que sont définies les principales opérations et fonctionnalités. Le traitement des données et les algorithmes complexes se trouvent ici.
  - `controller` : Obtient les données du services.
  - `models` : Contient les modèles de données.
  - `routes` : Dossier pour stocker toutes les routes de votre application.
  - `middleware` :  Agit comme intermédiaire pour traiter les requêtes et offrir des services comme la sécurité et l'authentification


# Features
Panier: Les utilisateurs peuvent ajouter des produits à leur panier, en respectant la limite de stock disponible  
Paiement: Possibilité de faire un paiement et passer une commande.  
Commandes : Les utilisateurs peuvent voir leurs Commandes le prix total et chaque article de la commande  
Authentification : Les utilisateurs peuvent se connecter à l'application.

# Contribution
Les contributions à ce projet sont les bienvenues. Si vous trouvez des problèmes ou avez des suggestions d'amélioration, n'hésitez pas à créer une demande de tirage ou à soumettre un problème sur le dépôt du projet.
