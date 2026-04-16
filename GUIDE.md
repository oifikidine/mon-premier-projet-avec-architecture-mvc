# Guide — Créer une application Node.js avec l'architecture MVC

Ce guide retrace étape par étape tout ce qui a été fait dans ce projet.

---

## Prérequis

- [Node.js](https://nodejs.org) installé sur ta machine
- Un terminal (cmd, PowerShell, bash…)
- Un compte GitHub

---

## Étape 1 — Initialiser le projet Node.js

Ouvre un terminal dans le dossier où tu veux créer ton projet, puis exécute :

```bash
npm init
```

Réponds aux questions (nom du projet, version, etc.) ou appuie sur Entrée pour garder les valeurs par défaut.

Cela crée le fichier `package.json` qui décrit ton projet et ses dépendances.

---

## Étape 2 — Installer les dépendances

Ce projet utilise deux packages :

- **express** : framework web pour Node.js
- **ejs** : moteur de templates HTML

```bash
npm install express ejs
```

Après l'installation :
- Un dossier `node_modules/` est créé avec tous les packages.
- Le fichier `package-lock.json` est généré pour verrouiller les versions exactes.
- Le `package.json` est mis à jour avec les dépendances.

---

## Étape 3 — Créer le fichier `.gitignore`

Le dossier `node_modules` ne doit pas être versionné (il est trop lourd et peut être recréé avec `npm install`).

Crée un fichier `.gitignore` à la racine du projet :

```
node_modules
```

---

## Étape 4 — Comprendre l'architecture MVC

MVC signifie **Modèle — Vue — Contrôleur**. C'est une façon d'organiser son code en séparant les responsabilités :

| Couche | Rôle | Dossier/Fichier |
|---|---|---|
| **Modèle** | Données et logique métier | *(non utilisé ici)* |
| **Vue** | Affichage HTML envoyé à l'utilisateur | `views/` |
| **Contrôleur** | Traite la requête et appelle la vue | `controllers/` |
| **Route** | Associe une URL à un contrôleur | `routes/` |
| **App** | Configure Express | `app.js` |
| **Serveur** | Démarre le serveur HTTP | `myserver.js` |

---

## Étape 5 — Créer le serveur HTTP (`myserver.js`)

Ce fichier est le point d'entrée : il crée et démarre le serveur.

```js
// Ce fichier démarre le serveur HTTP

// j'importe le module http de nodejs
const http = require("http");

// j'importe mon application express
const app = require("./app");

// je définis le port d'écoute du serveur
const PORT = process.env.PORT || 3009;

// je crée le serveur HTTP en lui passant mon app
const server = http.createServer(app);

// je démarre le serveur sur le port défini
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
```

> `process.env.PORT || 3009` : utilise la variable d'environnement PORT si elle existe (utile en production), sinon utilise 3009.

---

## Étape 6 — Configurer l'application Express (`app.js`)

Ce fichier configure Express : moteur de vues, routes, etc.

```js
// j'importe le package expressjs
const express = require("express");

// J'initie l'application expressjs
const app = express();

// j'importe la route accueilRoute.js
const accueilRoute = require("./routes/accueilRoute");

// je définis le dossier où se trouvent mes vues
app.set("views", "./views");

// je définis le moteur de template à utiliser
app.set("view engine", "ejs");

// j'utilise la route accueilRoute pour le chemin "/"
app.use("/", accueilRoute);

// j'exporte mon app
module.exports = app;
```

> On sépare `app.js` et `myserver.js` pour respecter le principe de séparation des responsabilités : la configuration Express d'un côté, le démarrage du serveur de l'autre.

---

## Étape 7 — Créer la vue (`views/accueil.ejs`)

Crée le dossier `views/`, puis le fichier `accueil.ejs` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Bienvenue à l'accueil</h1>
</body>
</html>
```

> Le fichier porte l'extension `.ejs` au lieu de `.html`. EJS permet d'insérer du code JavaScript dynamique dans les vues avec la syntaxe `<%= variable %>`.

---

## Étape 8 — Créer le contrôleur (`controllers/accueilController.js`)

Crée le dossier `controllers/`, puis le fichier `accueilController.js` :

```js
/**
 * ce fichier est un controller.
 */
// dans ce fichier je vais créer la logique de la page 'accueil.ejs'

module.exports = {
    // je crée la fonction qui affiche la vue accueil
    accueilView: (req, res) => {
        // je rends la vue accueil.ejs
        res.render('accueil');
    }
}
```

> Le contrôleur exporte un objet avec des fonctions. Chaque fonction reçoit `req` (la requête HTTP) et `res` (la réponse HTTP). `res.render('accueil')` cherche `views/accueil.ejs` et l'envoie au navigateur.

---

## Étape 9 — Créer la route (`routes/accueilRoute.js`)

Crée le dossier `routes/`, puis le fichier `accueilRoute.js` :

```js
// j'importe le package expressjs
const express = require("express");

// j'initie le router d'express
const router = express.Router();

// j'importe le controller accueilController
const accueilController = require("../controllers/accueilController");

// la route pour l'accueil, exemple localhost:3009
router.get("/", accueilController.accueilView);

// j'exporte le router
module.exports = router;
```

> Le router associe un chemin URL (`"/"`) et une méthode HTTP (`GET`) à une fonction du contrôleur. `../controllers/` remonte d'un niveau depuis `routes/`.

---

## Étape 10 — Structure finale du projet

```
nodemvc/
├── controllers/
│   └── accueilController.js
├── routes/
│   └── accueilRoute.js
├── views/
│   └── accueil.ejs
├── node_modules/         ← généré par npm, ne pas versionner
├── .gitignore
├── app.js
├── myserver.js
├── package.json
└── package-lock.json
```

---

## Étape 11 — Lancer l'application

```bash
node myserver.js
```

ou via le script npm défini dans `package.json` :

```bash
npm start
```

Ouvre ton navigateur et va sur [http://localhost:3009](http://localhost:3009). Tu dois voir :

> **Bienvenue à l'accueil**

---

## Étape 12 — Versionner avec Git et GitHub

### Initialiser Git

```bash
git init
git add .
git commit -m "first commit"
```

### Lier au dépôt GitHub

```bash
git remote add origin https://github.com/oifikidine/mon-premier-projet-avec-architecture-mvc.git
git push -u origin main
```

### Travailler avec des branches

Une branche `develop` a été créée pour le développement :

```bash
git checkout -b develop
git push -u origin develop
```

> Bonne pratique : on développe sur `develop` et on fusionne sur `main` uniquement quand le code est stable.

---

## Récapitulatif du flux d'une requête HTTP

```
Navigateur
    │
    │  GET /
    ▼
myserver.js  →  app.js  →  routes/accueilRoute.js
                                    │
                                    │  router.get("/", accueilController.accueilView)
                                    ▼
                        controllers/accueilController.js
                                    │
                                    │  res.render('accueil')
                                    ▼
                            views/accueil.ejs
                                    │
                                    ▼
                            Réponse HTML au navigateur
```

---

## Ajouter une nouvelle page (exemple)

Pour ajouter une page `/contact`, reproduire le même schéma :

1. Créer `views/contact.ejs`
2. Ajouter une fonction `contactView` dans `controllers/accueilController.js` (ou créer `controllers/contactController.js`)
3. Ajouter `router.get("/contact", accueilController.contactView)` dans `routes/accueilRoute.js`
