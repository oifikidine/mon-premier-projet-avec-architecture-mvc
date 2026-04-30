# Cours — Node.js MVC + Sequelize
**Date : 20 avril 2026**

---

## Partie 1 — L'architecture MVC

### C'est quoi le MVC ?

MVC = **Modèle — Vue — Contrôleur**. C'est une façon d'organiser son code en séparant les responsabilités. Chaque fichier a un rôle unique et limité.

```
Navigateur
    │  GET /register
    ▼
Route         → reçoit l'URL et redirige vers le bon contrôleur
    ▼
Contrôleur    → reçoit la demande, décide quoi faire
    ▼
Modèle        → parle à la base de données (Sequelize)
    ▼
Vue           → génère le HTML renvoyé au navigateur
```

### Les 3 couches + leur dossier

| Couche | Dossier | Rôle |
|---|---|---|
| **Modèle** | `models/` | Représente les tables MySQL en JavaScript |
| **Vue** | `views/` | Templates HTML (fichiers `.ejs`) |
| **Contrôleur** | `controllers/` | Logique de chaque page |
| Route | `routes/` | Associe une URL à un contrôleur |

---

## Partie 2 — Les routes GET et POST

### La différence entre GET et POST

| Méthode | Usage | Exemple |
|---|---|---|
| **GET** | Afficher une page | L'utilisateur tape une URL dans le navigateur |
| **POST** | Envoyer des données | L'utilisateur soumet un formulaire |

### Dans le code — `routes/authentificationRoute.js`

```js
// GET → affiche le formulaire vide
router.get("/register", authController.registerView);

// POST → traite les données envoyées par le formulaire
router.post("/register", authController.registerUser);
```

Les deux routes ont la **même URL** (`/register`) mais des **méthodes différentes**.
- Navigateur tape l'URL → `GET`
- Formulaire soumis → `POST`

---

## Partie 3 — Le contrôleur et `async`

### `controllers/authentificationController.js`

```js
module.exports = {

    // affiche simplement la vue register.ejs
    registerView: (req, res) => {
        res.render("register");
    },

    // traite les données du formulaire → async car il parlera à la BDD
    registerUser: async (req, res) => {
        console.log("#### Controller RegisterUser **");
    }

};
```

### Pourquoi `async` sur `registerUser` ?

`registerUser` devra bientôt **créer un utilisateur en base de données**.
Parler à MySQL prend du temps — c'est une opération asynchrone.

`async` prépare la fonction pour pouvoir utiliser `await` :
```js
registerUser: async (req, res) => {
    const user = await User.create({ ... }); // attendre la réponse de MySQL
    res.redirect("/");
}
```

Sans `async`, on ne peut pas utiliser `await`. On l'écrit **maintenant** par anticipation,
même si la logique BDD n'est pas encore là.

---

## Partie 4 — Sequelize et la base de données

### C'est quoi Sequelize ?

Sequelize est un **ORM** (Object-Relational Mapper) — il fait le pont entre
JavaScript et MySQL. Tu écris du JS, Sequelize génère le SQL.

```
User.create({ email: "...", password: "..." })
        ↓  (Sequelize traduit)
INSERT INTO Users (email, password) VALUES ("...", "...")
```

### Les fichiers Sequelize créés aujourd'hui

#### `config/database.js` — La connexion

```js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("maygourmet", "root", "mot_de_passe", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
```

Les paramètres de `new Sequelize()` :
1. `"maygourmet"` → nom de la base de données
2. `"root"` → utilisateur MySQL
3. `"mot_de_passe"` → mot de passe MySQL
4. `dialect: "mysql"` → on utilise MySQL (Sequelize supporte aussi PostgreSQL, SQLite…)

#### `models/User.js` — La table Users en JS

```js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
});

module.exports = User;
```

Ce modèle correspond à la table `Users` dans `maygourmet` :

| Modèle JS | Colonne MySQL |
|---|---|
| *(automatique)* | `id` INTEGER PRIMARY KEY auto_increment |
| `email` STRING(55) | `email` VARCHAR(55) NOT NULL UNIQUE |
| `password` STRING(55) | `password` VARCHAR(55) NOT NULL |
| *(automatique)* | `createdAt` DATETIME |
| *(automatique)* | `updatedAt` DATETIME |

#### `testDB.js` — Synchroniser le modèle avec MySQL

```js
const sequelize = require("./config/database");
const User = require("./models/User");

sequelize.sync({ force: false })
    .then(() => console.log("Tables synchronisées !"))
    .catch((erreur) => console.log("Erreur :", erreur));
```

`sequelize.sync()` compare les modèles JS avec les tables MySQL et crée
ce qui manque. `force: false` = ne jamais supprimer une table existante.

---

## Partie 5 — Tester avec Postman

### C'est quoi Postman ?

Postman est un outil qui permet d'**envoyer des requêtes HTTP manuellement**
sans passer par un navigateur ou un formulaire HTML.

Indispensable pour tester les routes POST car un navigateur ne peut pas
envoyer de POST juste en tapant une URL.

### Comment tester la route POST `/register`

1. Démarrer le serveur : `node myserver.js`
2. Dans Postman : méthode **POST**, URL `http://localhost:3009/register`
3. Cliquer **Send**
4. Vérifier dans le terminal : `#### Controller RegisterUser **`

### Ce que ça prouve

Le `console.log` dans `registerUser` s'exécute → la route POST est bien branchée
et le contrôleur est bien appelé. La prochaine étape sera de remplacer ce
`console.log` par la vraie logique d'inscription.

---

## Partie 6 — `express-myconnection` — Connexion MySQL dans `req`

### Le problème

Sequelize gère les modèles mais le prof utilise aussi des **requêtes SQL brutes**
via `req.getConnection()`. Pour que cette méthode existe sur `req`, il faut installer
et configurer le middleware `express-myconnection`.

### Installation

```bash
npm install express-myconnection
```

### Configuration dans `app.js`

```js
const myConnection = require('express-myconnection');

app.use(myConnection(require('mysql2'), {
    host: "localhost",
    user: "root",
    password: "rsma2026",
    database: "maygourmet",
    port: 3306
}, 'single'));
```

Ce middleware **attache une connexion MySQL à chaque requête**. Depuis n'importe quel
contrôleur on peut alors appeler `req.getConnection()` pour obtenir cette connexion.

Le mode `'single'` = une seule connexion partagée pour toute l'application.

### Utilisation dans le contrôleur

```js
req.getConnection((errConnexion, connection) => {
    connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {
        res.redirect('/');
    });
});
```

---

## Partie 7 — `registerUser` — Insertion en base de données

### Le flux complet de l'inscription

```js
registerUser: async (req, res) => {
    // 1. je récupère les données du formulaire
    const emailUser    = req.body.email;
    const passwordUser = req.body.motdepasse;

    // 2. je valide que les champs sont remplis
    if (!emailUser || !passwordUser) {
        return res.render('register', { error: "Veuillez compléter tous les champs." });
    }

    // 3. je prépare la requête SQL
    let requeteSql   = "INSERT INTO Users(id, email, password) VALUES(?, ?, ?)";
    let ordreDonnees = [null, emailUser, passwordUser];

    // 4. j'obtiens la connexion et j'exécute la requête
    req.getConnection((errConnexion, connection) => {
        if (errConnexion) return res.render('register', { error: "Erreur de connexion." });

        connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {
            if (errRequete) return res.render('register', { error: "Erreur d'enregistrement." });
            res.redirect('/');
        });
    });
}
```

### Les `?` dans la requête SQL

Les `?` sont des **paramètres préparés** — Sequelize les remplace par les valeurs
de `ordreDonnees` dans l'ordre. C'est la protection contre les **injections SQL** :
les données ne sont jamais concaténées directement dans la requête.

---

## Partie 9 — Les fichiers statiques (`public/`)

### Le problème

Express ne sert pas automatiquement les fichiers CSS, images, JS front-end…
Il faut lui dire explicitement où les trouver.

### La solution : `express.static`

On crée un dossier `public/` à la racine du projet pour y mettre tous les fichiers statiques :

```
public/
└── css/
    └── navbar.css
```

Dans `app.js`, on ajoute le middleware :

```js
app.use(express.static("public"));
```

Depuis ce moment, tout fichier dans `public/` est accessible via une URL.
`public/css/navbar.css` → accessible via `/css/navbar.css`.

> **Important :** Le nom du dossier `public` ne fait pas partie de l'URL.
> `/public/css/navbar.css` → ❌ ne fonctionne pas
> `/css/navbar.css` → ✅ fonctionne

---

## Partie 10 — Les partials EJS (`<%- include() %>`)

### Le problème

Si la navbar est copiée dans chaque fichier `.ejs`, modifier un lien = modifier 10 fichiers.

### La solution : les partials

Un **partial** est un morceau de vue réutilisable. On le crée une fois, on l'inclut partout.

On crée `views/navbar.ejs` :
```html
<div class="navbar">
    <a href="/">Accueil</a>
    <a href="/register">Register</a>
    <a href="/login" class="active">Log in</a>
</div>
```

On l'inclut dans `register.ejs` :
```html
<%- include('navbar') %>
```

### La syntaxe EJS : `<%= %>` vs `<%- %>`

| Syntaxe | Comportement | Utilisation |
|---|---|---|
| `<%= variable %>` | Affiche la valeur **échappée** (sécurisé) | Afficher du texte |
| `<%- include() %>` | Injecte du HTML **brut** | Inclure des partials |
| `<% code %>` | Exécute du JS sans rien afficher | Boucles, conditions |

On utilise `<%-` pour les includes car on veut injecter du HTML pur, pas du texte échappé.

---

## Partie 11 — Lire les données d'un formulaire (`req.body`)

### Le problème

Par défaut, Express ne sait pas lire le corps des requêtes POST.
Sans configuration, `req.body` est `undefined`.

### La solution : `express.urlencoded`

Dans `app.js` :
```js
app.use(express.urlencoded({ extended: true }));
```

Ce middleware dit à Express : "lis le corps des requêtes POST envoyées par des formulaires HTML
et mets les données dans `req.body`".

Après ça, quand un formulaire envoie `email=test@mail.com&password=1234` :
```js
req.body.email    // "test@mail.com"
req.body.password // "1234"
```

### Test Postman

Pour tester sans formulaire HTML, Postman doit envoyer en **x-www-form-urlencoded**
(pas en JSON brut) pour que `express.urlencoded` puisse lire les données.

---

## Récapitulatif — Ce qui a été fait aujourd'hui

```
1.  Architecture MVC posée
    └── routes/ controllers/ views/ models/ config/ public/

2.  Route GET /register → affiche le formulaire
    Route POST /register → traite l'inscription

3.  Contrôleur avec registerView (GET) et registerUser (POST + async)

4.  Sequelize installé et configuré
    └── connexion à MySQL (maygourmet)
    └── modèle User (id, email, password, timestamps: false)
    └── table Users créée dans MySQL via sequelize.sync()

5.  Test Postman → route POST confirmée fonctionnelle

6.  express-myconnection → req.getConnection() disponible dans les contrôleurs

7.  registerUser complété → validation + SQL INSERT + redirect('/')

8.  Fichiers statiques → public/css/navbar.css via express.static("public")

9.  Partial navbar → views/navbar.ejs inclus avec <%- include('navbar') %>

10. express.urlencoded → req.body lisible depuis les formulaires POST

11. Formulaire register.ejs → champs email et motdepasse avec action POST
```

## Prochaine étape — Compléter `registerUser`

```js
registerUser: async (req, res) => {
    // récupérer les données du formulaire
    const { email, password } = req.body;

    // créer l'utilisateur en base de données
    await User.create({ email, password });

    // rediriger après l'inscription
    res.redirect("/");
}
```

C'est la logique qui sera ajoutée lors du prochain cours.
