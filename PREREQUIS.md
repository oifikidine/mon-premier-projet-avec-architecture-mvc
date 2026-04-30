# Prérequis — Les notions de base à maîtriser

Ce fichier liste toutes les notions JavaScript et Node.js utilisées dans ce projet.
Pour chaque notion : ce que c'est, pourquoi on en a eu besoin ici, et un exemple concret.

---

## 1. Les variables — `const` et `let`

### Ce que c'est
Une variable stocke une valeur en mémoire pour pouvoir la réutiliser.
- `const` → la valeur ne changera jamais (constante)
- `let` → la valeur peut changer

### Pourquoi dans ce projet
On l'utilise **partout** : importer un module, stocker l'app Express, définir un port…

```js
const express = require("express");   // express ne changera jamais → const
const PORT = process.env.PORT || 3009; // le port ne changera jamais → const
```

### Règle pratique
Utilise toujours `const` par défaut. Passe à `let` uniquement si tu dois réassigner la valeur.

---

## 2. Les fonctions

### Ce que c'est
Un bloc de code réutilisable qui s'exécute quand on l'appelle.

```js
// déclaration classique
function direBonjour() {
    console.log("Bonjour");
}

// fonction fléchée (arrow function)
const direBonjour = () => {
    console.log("Bonjour");
}
```

### Pourquoi dans ce projet
Chaque action d'un contrôleur est une fonction. Express appelle ces fonctions
automatiquement quand une requête HTTP arrive.

```js
// controllers/accueilController.js
accueilView: (req, res) => {
    res.render('accueil');
}
```

### Les fonctions fléchées `() =>`
Syntaxe moderne et plus courte. Dans ce projet on les utilise exclusivement.
`(req, res) => { ... }` = une fonction qui reçoit req et res en paramètres.

---

## 3. Les objets

### Ce que c'est
Un objet regroupe des données et des fonctions sous un même nom.
Il se définit avec des accolades `{ }` et contient des paires `clé: valeur`.

```js
const personne = {
    nom: "Jean",
    age: 25,
    direBonjour: () => console.log("Bonjour")
};

personne.nom;         // "Jean"
personne.direBonjour(); // "Bonjour"
```

### Pourquoi dans ce projet
Les contrôleurs exportent un **objet** qui regroupe toutes leurs fonctions :

```js
module.exports = {
    accueilView: (req, res) => { res.render('accueil'); },
    accueilEdit: (req, res) => { ... },
}
```

La configuration Sequelize est aussi un objet :
```js
{ host: "localhost", dialect: "mysql" }
```

---

## 4. Les modules — `require` et `module.exports`

### Ce que c'est
Node.js divise le code en fichiers indépendants appelés **modules**.
- `module.exports = ...` → **expose** quelque chose depuis un fichier
- `require("./chemin")` → **importe** ce qui a été exposé

### Pourquoi dans ce projet
C'est le mécanisme qui fait tenir toute l'architecture MVC ensemble.
Sans `require` / `module.exports`, les fichiers seraient des boîtes isolées
incapables de communiquer entre elles.

```js
// je rends le router accessible depuis app.js
module.exports = router;

// dans app.js, j'importe ce router
const accueilRoute = require("./routes/accueilRoute");
```

### La destructuration à l'import `{ }`
```js
const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
```
Les accolades signifient : "extrait uniquement cette propriété de ce que le module exporte".
Sequelize exporte un gros objet — on ne prend que ce dont on a besoin.

---

## 5. Les classes et le mot-clé `new`

### Ce que c'est
Une classe est un **modèle** pour créer des objets.
`new` crée une **instance** de cette classe — un objet concret basé sur ce modèle.

```js
class Voiture {
    constructor(marque, couleur) {
        this.marque = marque;
        this.couleur = couleur;
    }
}

const maVoiture = new Voiture("Toyota", "rouge");
maVoiture.marque; // "Toyota"
```

### Pourquoi dans ce projet
On utilise `new` pour créer la connexion Sequelize :

```js
const sequelize = new Sequelize("maygourmet", "root", "rsma2026", {
    host: "localhost",
    dialect: "mysql",
});
```

`Sequelize` est une classe. `new Sequelize(...)` crée une instance concrète de connexion
avec nos paramètres spécifiques.

---

## 6. Les callbacks

### Ce que c'est
Un callback est une **fonction passée en paramètre** d'une autre fonction,
pour être exécutée plus tard.

```js
function faireQuelqueChose(callback) {
    // ... du travail ...
    callback(); // j'appelle la fonction qu'on m'a passée
}

faireQuelqueChose(() => console.log("C'est fait !"));
```

### Pourquoi dans ce projet
Express utilise des callbacks pour chaque route. Quand une requête arrive sur `/`,
Express appelle la fonction qu'on lui a donnée :

```js
router.get("/", accueilController.accueilView);
//                └─ ce sont des callbacks passés à router.get()
```

La fonction `accueilView` est un callback — Express l'appelle automatiquement
en lui passant `req` et `res`.

---

## 7. Les Promises — `.then()` et `.catch()`

### Ce que c'est
Une Promise représente une opération **asynchrone** — une tâche qui prend du temps
(appel réseau, lecture de fichier, requête BDD…).

Elle a deux issues possibles :
- **Succès** → `.then()` est exécuté
- **Échec** → `.catch()` est exécuté

```js
uneOperationLongue()
    .then((résultat) => console.log("Succès :", résultat))
    .catch((erreur)  => console.log("Erreur :", erreur));
```

### Pourquoi dans ce projet
Sequelize communique avec MySQL via le réseau — c'est asynchrone.
`sequelize.sync()` et `sequelize.authenticate()` retournent des Promises :

```js
sequelize.sync({ force: false })
    .then(() => console.log("Tables synchronisées !"))
    .catch((erreur) => console.log("Erreur :", erreur));
```

On ne peut pas savoir à l'avance combien de temps MySQL mettra à répondre.
La Promise permet de "brancher" du code à exécuter une fois la réponse reçue.

---

## 8. L'asynchrone — `async` / `await`

### Ce que c'est
`async` / `await` est une syntaxe plus lisible pour écrire des Promises.
Au lieu de chaîner `.then()`, on attend le résultat avec `await`.

```js
// Avec .then()
User.findAll().then((users) => console.log(users));

// Avec async/await — plus lisible
async function lireLesUsers() {
    const users = await User.findAll();
    console.log(users);
}
```

`await` dit : "attends que cette opération soit terminée avant de passer à la suite".
Une fonction qui utilise `await` doit être déclarée `async`.

### Pourquoi dans ce projet
On l'utilisera dans les contrôleurs pour les opérations CRUD avec Sequelize :

```js
registerUser: async (req, res) => {
    const user = await User.create({ email: req.body.email, password: req.body.password });
    res.redirect("/");
}
```

Sans `async/await`, le code continuerait à s'exécuter avant que MySQL ait répondu
— on lirait des données qui n'existent pas encore.

---

## 9. Les objets JSON

### Ce que c'est
JSON (JavaScript Object Notation) est un format d'échange de données.
En JavaScript, c'est simplement un objet avec des guillemets sur les clés.

```json
{
    "nom": "Jean",
    "email": "jean@mail.com",
    "age": 25
}
```

### Pourquoi dans ce projet
Le fichier `package.json` est du JSON pur — il décrit le projet et ses dépendances.
Quand un formulaire envoie des données au serveur, elles arrivent souvent en JSON.
`req.body` contiendra un objet JSON qu'on utilisera pour créer un utilisateur.

---

## 10. Les tableaux (arrays)

### Ce que c'est
Un tableau stocke une **liste ordonnée** de valeurs.

```js
const fruits = ["pomme", "banane", "orange"];
fruits[0]; // "pomme"
fruits.length; // 3
```

### Pourquoi dans ce projet
Quand on fera `User.findAll()`, Sequelize retournera un **tableau** d'objets User :

```js
const users = await User.findAll();
// users = [ { id: 1, email: "a@mail.com" }, { id: 2, email: "b@mail.com" } ]

users.forEach((user) => console.log(user.email));
```

---

## 11. Les opérateurs logiques — `||`

### Ce que c'est
`||` signifie "OU". Il retourne la première valeur "vraie" qu'il rencontre.

```js
const valeur = null || "valeur par défaut";
// valeur = "valeur par défaut" car null est "faux"
```

### Pourquoi dans ce projet
Pour définir le port du serveur :

```js
const PORT = process.env.PORT || 3009;
```

- Si `process.env.PORT` existe (en production) → on l'utilise
- Sinon (`||`) → on utilise `3009` par défaut

---

## 12. Les template literals — `` ` ` ``

### Ce que c'est
Les backticks `` ` `` permettent d'insérer des variables directement dans une chaîne
de caractères avec la syntaxe `${ }`.

```js
const nom = "Jean";
console.log(`Bonjour ${nom} !`); // "Bonjour Jean !"

// Équivalent sans template literal (moins lisible) :
console.log("Bonjour " + nom + " !");
```

### Pourquoi dans ce projet

```js
console.log(`Serveur démarré sur le port ${PORT}`);
```

---

## 13. `process.env` — Les variables d'environnement

### Ce que c'est
`process.env` est un objet Node.js qui contient les **variables d'environnement**
— des valeurs injectées par la machine qui fait tourner le programme.

```js
process.env.PORT      // le port défini par la plateforme d'hébergement
process.env.NODE_ENV  // "development" ou "production"
```

### Pourquoi dans ce projet
En développement local, `process.env.PORT` est vide → on utilise 3009.
En production (Heroku, Vercel…), la plateforme injecte son propre port.
Le même code tourne dans les deux environnements sans modification.

---

## 14. Le protocole HTTP — `req` et `res`

### Ce que c'est
HTTP est le protocole de communication entre un navigateur et un serveur.
Chaque échange = une **requête** (`req`) et une **réponse** (`res`).

| Objet | Contient |
|---|---|
| `req.params` | Les paramètres d'URL (`/users/:id`) |
| `req.body` | Les données d'un formulaire (POST) |
| `req.query` | Les paramètres GET (`?page=2`) |
| `res.render()` | Envoie une vue HTML |
| `res.redirect()` | Redirige vers une autre URL |
| `res.json()` | Envoie des données JSON |

### Pourquoi dans ce projet
Toutes les fonctions de contrôleur reçoivent `req` et `res`.
Ce sont les deux seules "prises" qu'on a sur une requête HTTP :

```js
accueilView: (req, res) => {
    res.render('accueil'); // je réponds avec la vue accueil.ejs
}
```

---

## 15. Les méthodes HTTP — GET et POST

### Ce que c'est
Une requête HTTP a toujours une **méthode** qui indique l'intention :

| Méthode | Usage | Dans Express |
|---|---|---|
| `GET` | Lire / afficher une page | `router.get()` |
| `POST` | Envoyer des données (formulaire) | `router.post()` |
| `PUT` | Modifier une ressource | `router.put()` |
| `DELETE` | Supprimer une ressource | `router.delete()` |

### Pourquoi dans ce projet

```js
router.get("/register", authController.registerView);
// GET = l'utilisateur veut AFFICHER la page register

router.post("/register", authController.registerUser);
// POST = l'utilisateur veut ENVOYER le formulaire d'inscription
```

---

## 16. Les paramètres préparés — `?` dans le SQL

### Ce que c'est
Quand on écrit une requête SQL avec des `?`, on ne colle pas les valeurs directement
dans la chaîne. On les passe séparément dans un tableau.

```js
let requeteSql   = "INSERT INTO Users(id, email, password) VALUES(?, ?, ?)";
let ordreDonnees = [null, emailUser, passwordUser];
connection.query(requeteSql, ordreDonnees, callback);
```

### Pourquoi dans ce projet
C'est la protection contre les **injections SQL**.
Sans ça, un utilisateur malveillant pourrait écrire dans le champ email :
`' OR 1=1; DROP TABLE Users; --`
et détruire la base de données.
Avec les `?`, les valeurs sont traitées comme du texte pur — jamais comme du SQL.

---

## 17. `express-myconnection` et `req.getConnection()`

### Ce que c'est
`express-myconnection` est un middleware qui attache une connexion MySQL
à chaque objet `req`. Depuis n'importe quel contrôleur, on peut appeler
`req.getConnection()` pour obtenir cette connexion et exécuter des requêtes SQL.

```js
req.getConnection((erreur, connection) => {
    connection.query("SELECT * FROM Users", (err, resultats) => {
        console.log(resultats);
    });
});
```

### Pourquoi dans ce projet
Le contrôleur `authentificationController.js` utilise `req.getConnection()`
pour insérer un utilisateur en base de données sans passer par Sequelize.

---

## Récapitulatif — Où chaque notion est utilisée

| Notion | Fichier(s) |
|---|---|
| `const` / `let` | Tous les fichiers |
| Fonctions fléchées | `controllers/*.js` |
| Objets `{ }` | `controllers/*.js`, `config/database.js` |
| `require` / `module.exports` | Tous les fichiers |
| Classes / `new` | `config/database.js` |
| Callbacks | `routes/*.js`, `myserver.js`, `req.getConnection()` |
| Promises `.then()` / `.catch()` | `testDB.js` |
| `async` / `await` | `controllers/authentificationController.js` |
| JSON | `package.json`, `req.body` |
| Tableaux | `ordreDonnees`, `User.findAll()` (à venir) |
| Opérateur `\|\|` | `myserver.js` |
| Template literals | `myserver.js` |
| `process.env` | `myserver.js` |
| `req` / `res` | `controllers/*.js` |
| GET / POST | `routes/*.js` |
| Paramètres préparés `?` | `controllers/authentificationController.js` |
| `req.getConnection()` | `controllers/authentificationController.js` |
