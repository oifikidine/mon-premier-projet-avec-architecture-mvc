# Explication 2 — Du global au détail

Ce fichier part de la **vue d'ensemble** et zoome progressivement vers les détails.
Lis-le du début à la fin : chaque niveau suppose que tu as compris le précédent.

---

## Niveau 1 — La vision globale : c'est quoi ce projet ?

### Ce que fait ce projet

C'est une **application web serveur** : quand un utilisateur tape une URL dans son navigateur,
le serveur répond avec une page HTML.

En l'état, le projet gère deux pages :
- `/` → la page d'accueil
- `/register` → la page d'inscription

Il est aussi connecté à une **base de données MySQL** (`maygourmet`) via Sequelize,
avec une table `Users` contenant les colonnes `id`, `email` et `password`.

### Pourquoi le construire comme ça ?

Ce projet n'est pas fait pour être "utile" tout de suite. Son vrai but est d'être une **base solide et réutilisable** : une structure que tu pourras dupliquer et enrichir pour tout futur projet web (blog, boutique, réseau social…).

L'enjeu : écrire du code **organisé dès le départ**, pour ne pas souffrir quand le projet grandit.

---

## Niveau 2 — Le choix technologique : pourquoi Node.js + Express ?

### Le problème à résoudre

Un navigateur envoie des requêtes HTTP. Il faut un programme côté serveur qui les écoute, les comprend et renvoie une réponse. C'est le rôle du **serveur web**.

### Pourquoi Node.js ?

Node.js est un environnement d'exécution JavaScript côté serveur.
Avantage clé : **le même langage** (JavaScript) côté client (navigateur) et côté serveur.
Pas besoin d'apprendre PHP ou Python pour faire un backend.

### Pourquoi Express par-dessus Node.js ?

Node.js seul peut faire tourner un serveur, mais c'est verbeux.
Express est un **framework minimaliste** qui apporte :
- Un système de **routage** simple (`router.get("/", maFonction)`)
- La gestion des **middlewares** (fonctions qui s'exécutent entre la requête et la réponse)
- L'intégration facile d'un **moteur de templates** comme EJS

> Analogie : Node.js = le moteur brut. Express = la voiture avec le volant, les pédales, le tableau de bord.

---

## Niveau 3 — L'architecture : pourquoi MVC ?

### Le problème sans architecture

Sans règles, tout le code finit dans un seul fichier. Ce fichier gère à la fois :
- La connexion réseau
- La logique métier
- La génération du HTML
- Les accès à la base de données

Résultat : **impossible à lire, à modifier, à déboguer** au bout de 200 lignes.

### La solution MVC

MVC impose de **découper le code en trois types de responsabilités** :

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│    ROUTE    │────▶│ CONTRÔLEUR   │────▶│    VUE     │
│             │     │              │     │            │
│ Reçoit l'URL│     │ Décide quoi  │     │ Génère le  │
│ et redirige │     │ faire et     │     │ HTML final │
│ vers le bon │     │ quel HTML    │     │ envoyé au  │
│ contrôleur  │     │ renvoyer     │     │ navigateur │
└─────────────┘     └──────────────┘     └────────────┘
                            │
                            ▼
                    ┌──────────────┐     ┌────────────┐
                    │    MODÈLE    │────▶│   MySQL    │
                    │              │     │            │
                    │ Sequelize —  │     │ maygourmet │
                    │ lit/écrit    │     │ table Users│
                    │ les données  │     │            │
                    └──────────────┘     └────────────┘
```

**Chaque fichier a un rôle unique.**
- Changer l'apparence → toucher la vue
- Changer la logique → toucher le contrôleur
- Changer les données → toucher le modèle

---

## Niveau 4 — La structure du projet : comment les dossiers s'organisent

```
nodemvc/
│
├── myserver.js              ← Point d'entrée : démarre le serveur HTTP
├── app.js                   ← Configure Express (routes, moteur de vues)
├── testDB.js                ← Fichier temporaire pour tester Sequelize
│
├── config/                  ← Configuration de la base de données
│   └── database.js          ← Connexion Sequelize → MySQL (maygourmet)
│
├── models/                  ← Représentation des tables en JavaScript
│   └── User.js              ← Modèle de la table Users
│
├── public/                  ← Fichiers statiques servis directement
│   └── css/
│       └── navbar.css       ← Style de la navbar
│
├── routes/                  ← Associe chaque URL à un contrôleur
│   ├── accueilRoute.js
│   └── authentificationRoute.js
│
├── controllers/             ← Contient la logique de chaque page
│   ├── accueilController.js
│   └── authentificationController.js
│
└── views/                   ← Les templates HTML (fichiers .ejs)
    ├── navbar.ejs            ← Partial réutilisable (inclus dans les autres vues)
    ├── accueil.ejs
    └── register.ejs
```

### Lecture de l'extérieur vers l'intérieur

| Dossier/Fichier | Rôle | Analogie |
|---|---|---|
| `myserver.js` | Ouvre la "porte" réseau | La réception d'un immeuble |
| `app.js` | Plan de l'immeuble, qui va où | Le panneau d'affichage de l'entrée |
| `config/` | Paramètres de connexion à la BDD | Les clés de l'immeuble |
| `models/` | Structure des tables en JS | Le plan des archives |
| `public/` | Fichiers CSS, images, JS front-end | La déco de l'immeuble |
| `routes/` | Couloirs qui dirigent vers les bons bureaux | Les couloirs |
| `controllers/` | Les bureaux, où le travail se fait | Les bureaux |
| `views/` | Les documents remis à la personne | Les documents produits |

---

## Niveau 5 — Le flux d'une requête : que se passe-t-il vraiment ?

Quand tu tapes `http://localhost:3009/register` dans ton navigateur :

```
① Navigateur
   │  envoie : GET /register
   ▼
② myserver.js
   │  reçoit la connexion réseau
   │  passe la requête à app
   ▼
③ app.js
   │  cherche quelle route correspond à "/register"
   │  trouve : app.use("/", authentificationRoute)
   ▼
④ routes/authentificationRoute.js
   │  cherche router.get("/register", ...)
   │  trouve : authController.registerView
   ▼
⑤ controllers/authentificationController.js
   │  exécute registerView(req, res)
   │  appelle : res.render("register")
   ▼
⑥ views/register.ejs
   │  est transformé en HTML pur
   ▼
⑦ Navigateur
      reçoit le HTML et affiche la page
```

**Chaque flèche = un fichier différent.** Chaque fichier ne fait qu'une seule chose.

---

## Niveau 6 — Fichier par fichier : rôle et liens

### `myserver.js` — Le démarreur

```js
const http = require("http");      // module natif Node.js
const app  = require("./app");     // importe la configuration Express
const PORT = process.env.PORT || 3009;

const server = http.createServer(app);  // crée le serveur en lui passant l'app
server.listen(PORT, () => { ... });     // ouvre le port réseau
```

**Relation avec les autres fichiers :** importe uniquement `app.js`.
**Ne connaît pas** les routes, les contrôleurs, les vues. C'est volontaire.

---

### `app.js` — Le chef d'orchestre

```js
const express = require("express");
const app = express();

const accueilRoute          = require("./routes/accueilRoute");
const authentificationRoute = require("./routes/authentificationRoute");

app.use(express.static("public"));           // sert les fichiers CSS/images depuis public/
app.use(express.urlencoded({ extended: true })); // lit les données des formulaires POST

app.set("views", "./views");          // dit à Express où trouver les templates
app.set("view engine", "ejs");        // dit à Express quel moteur utiliser

app.use("/", accueilRoute);           // branche accueilRoute sur "/"
app.use("/", authentificationRoute);  // branche authentificationRoute sur "/"

module.exports = app;
```

**Relation avec les autres fichiers :** importe toutes les routes et les branche sur des chemins.
C'est ici que tu enregistres chaque nouvelle route et chaque middleware quand le projet grandit.

---

### `routes/accueilRoute.js` — L'aiguilleur de l'accueil

```js
const express    = require("express");
const router     = express.Router();
const accueilCtrl = require("../controllers/accueilController");

router.get("/", accueilCtrl.accueilView);   // GET / → accueilView

module.exports = router;
```

**Relation avec les autres fichiers :**
- Reçoit les requêtes depuis `app.js`
- Délègue l'exécution à `accueilController.js`

---

### `routes/authentificationRoute.js` — L'aiguilleur de l'auth

```js
const express  = require("express");
const router   = express.Router();
const authCtrl = require("../controllers/authentificationController");

router.get("/register",  authCtrl.registerView);  // GET  /register → affiche le formulaire
router.post("/register", authCtrl.registerUser);  // POST /register → traite l'inscription

module.exports = router;
```

Deux routes sur la même URL `/register` mais méthodes différentes :
- `GET` → afficher le formulaire vide
- `POST` → traiter les données soumises

---

### `controllers/accueilController.js` — La logique de l'accueil

```js
module.exports = {
    accueilView: (req, res) => {
        res.render("accueil");      // envoie views/accueil.ejs au navigateur
    }
}
```

**Relation avec les autres fichiers :**
- Appelé par `accueilRoute.js`
- Appelle `views/accueil.ejs` via `res.render()`

---

### `controllers/authentificationController.js` — La logique de l'auth

```js
module.exports = {

    // affiche le formulaire d'inscription
    registerView: (req, res) => {
        res.render("register");
    },

    // traite les données du formulaire et insère en BDD
    registerUser: async (req, res) => {
        const emailUser    = req.body.email;
        const passwordUser = req.body.motdepasse;

        // validation : champs obligatoires
        if (!emailUser || !passwordUser) {
            return res.render('register', { error: "Veuillez compléter tous les champs." });
        }

        let requeteSql   = "INSERT INTO Users(id, email, password) VALUES(?, ?, ?)";
        let ordreDonnees = [null, emailUser, passwordUser];

        req.getConnection((errConnexion, connection) => {
            if (errConnexion) return res.render('register', { error: "Erreur de connexion." });

            connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {
                if (errRequete) return res.render('register', { error: "Erreur d'enregistrement." });
                res.redirect('/');
            });
        });
    }
};
```

`req.getConnection()` est fourni par le middleware `express-myconnection` configuré dans `app.js`.
Les `?` dans la requête SQL sont des paramètres préparés — protection contre les injections SQL.

---

### `config/database.js` — La connexion à MySQL

```js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("maygourmet", "root", "mot_de_passe", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
```

**Relation avec les autres fichiers :** importé par chaque modèle dans `models/`.
Ce fichier est le seul endroit où les identifiants MySQL sont écrits.

Les 3 paramètres de `new Sequelize()` :
1. `"maygourmet"` → le nom de la base de données
2. `"root"` → l'utilisateur MySQL
3. `"mot_de_passe"` → le mot de passe MySQL

---

### `models/User.js` — La table Users en JavaScript

```js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = User;
```

**Relation avec les autres fichiers :** sert de référence pour `sequelize.sync()`.
Le contrôleur utilise `req.getConnection()` pour les requêtes SQL brutes directement.

Ce modèle correspond exactement à la table `Users` dans MySQL :

| Modèle JS | Table MySQL |
|---|---|
| `id` INTEGER primaryKey autoIncrement | `id` INTEGER PRIMARY KEY auto_increment |
| `email` STRING(55) | `email` VARCHAR(55) NOT NULL UNIQUE |
| `password` STRING(55) | `password` VARCHAR(55) NOT NULL |
| `timestamps: false` | Pas de `createdAt` ni `updatedAt` |

---

### `views/navbar.ejs` — Le partial de navigation

```html
<div class="navbar">
    <a href="/">Accueil</a>
    <a href="/register">Register</a>
    <a href="/login" class="active">Log in</a>
</div>
```

Un **partial** est un fragment de vue réutilisable. On l'inclut dans les autres vues
avec la syntaxe EJS `<%- include('navbar') %>`.

Le `-` dans `<%-` est important : il injecte le HTML brut sans l'échapper.
Avec `<%= %>`, les balises HTML seraient affichées comme du texte.

---

### `views/accueil.ejs` et `views/register.ejs` — Les templates HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h1>Bienvenue à l'accueil</h1>   <!-- ou Register -->
</body>
</html>
```

Pour l'instant, ce sont du HTML statique. Dès qu'on voudra afficher des données dynamiques
(ex: nom de l'utilisateur), on utilisera la syntaxe EJS : `<%= nomUtilisateur %>`.

---

## Niveau 7 — Les détails techniques fin : syntaxes et mécanismes

### `require()` / `module.exports` — Le système de modules CommonJS

Node.js découpe le code en fichiers indépendants appelés **modules**.

- `module.exports = ...` → **expose** quelque chose depuis un fichier
- `require("./chemin")` → **importe** ce qui a été exposé

```js
// fichier A.js
module.exports = { direBonjour: () => console.log("Bonjour") }

// fichier B.js
const A = require("./A");
A.direBonjour(); // affiche "Bonjour"
```

Sans `module.exports`, un fichier est une boîte fermée. Rien ne peut en sortir.

---

### `(req, res) =>` — Les deux paramètres de chaque action

Express passe automatiquement ces deux objets à chaque fonction de contrôleur :

| Paramètre | Signifie | Contient |
|---|---|---|
| `req` | **request** | URL, paramètres, données du formulaire, cookies, en-têtes HTTP |
| `res` | **response** | Les méthodes pour répondre : `res.render()`, `res.send()`, `res.redirect()` |

Ce sont les deux seules "prises" que tu as sur une requête HTTP.

---

### `res.render("nomVue")` — Comment Express trouve le bon fichier

Quand tu écris `res.render("register")`, Express :

1. Lit la config : `app.set("views", "./views")` → cherche dans `views/`
2. Lit la config : `app.set("view engine", "ejs")` → ajoute l'extension `.ejs`
3. Cherche et charge : `views/register.ejs`
4. Transforme le template en HTML pur
5. Envoie le HTML au navigateur

Tu n'écris jamais le chemin complet ni l'extension. Express le déduit tout seul.

---

### `app.use("/", route)` vs `router.get("/register", fn)` — Deux niveaux de routage

Il y a **deux niveaux** dans le routage de ce projet :

**Niveau 1 — `app.js` avec `app.use()`**
Définit un **préfixe** : "toutes les requêtes qui commencent par `/` vont dans cette route".

**Niveau 2 — le fichier de route avec `router.get()`**
Affine le chemin et la méthode HTTP : "parmi celles-là, celles qui font exactement `GET /register`".

```
app.use("/", authentificationRoute)    ← préfixe "/"
    └── router.get("/register", fn)    ← chemin final "/register"
                                         résultat : GET /register
```

Si demain tu veux regrouper toutes les routes d'auth sous `/auth` :
```js
app.use("/auth", authentificationRoute)
// → accessible via GET /auth/register
```
Tu changes **une seule ligne** dans `app.js`. Aucun autre fichier ne bouge.

---

## Récapitulatif — Les niveaux d'abstraction

```
┌──────────────────────────────────────────────────────┐
│  VISION       App web MVC Node.js + Express + EJS    │  ← Niveau 1
│               connectée à MySQL via Sequelize        │
├──────────────────────────────────────────────────────┤
│  ARCHI        Route → Contrôleur → Vue               │  ← Niveau 2-3
│               Contrôleur → Modèle → MySQL            │
├──────────────────────────────────────────────────────┤
│  STRUCTURE    myserver → app → routes → controllers  │  ← Niveau 4-5
│               config → models → MySQL                │
├──────────────────────────────────────────────────────┤
│  FICHIERS     Chaque fichier : son rôle, ses imports  │  ← Niveau 6
│               ses exports, ses liens                 │
├──────────────────────────────────────────────────────┤
│  CODE         require/exports, req/res,              │  ← Niveau 7
│               res.render, app.use, router.get        │
│               sequelize.define, DataTypes, sync()    │
└──────────────────────────────────────────────────────┘
```

Quand tu es bloqué sur un problème, situe-le d'abord dans ce tableau.
- La page ne s'affiche pas → problème de vue ou de contrôleur (niveau 6)
- La route ne répond pas → problème de routage (niveau 5-6)
- Le serveur ne démarre pas → problème de configuration (niveau 3-4)
- Les données ne s'enregistrent pas → problème de modèle ou de connexion BDD (niveau 6)
