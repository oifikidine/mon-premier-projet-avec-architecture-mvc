# Slides — Le code fichier par fichier

---

## app.js

```js
// j'importe le package expressjs
const express = require("express");

// j'importe le middleware express-myconnection pour gérer la connexion MySQL
const myConnection = require('express-myconnection');

// J'initie l'application expressjs
const app = express();

// j'importe la route accueilRoute.js
const accueilRoute = require("./routes/accueilRoute");

// j'importe la route authentificationRoute.js
const authentificationRoute = require("./routes/authentificationRoute");

// je configure la connexion à la base de données MySQL
app.use(myConnection(require('mysql2'), {
    host: "localhost",
    user: "root",
    password: "rsma2026",
    database: "maygourmet",
    port: 3306
}, 'single'));

// Utiliser les fichiers statiques qui sont dans le dossier public
app.use(express.static("public"));

// j'autorise express à lire les données envoyées par un formulaire (req.body)
app.use(express.urlencoded({ extended: true }));

// je définis le dossier où se trouvent mes vues
app.set("views", "./views");

// je définis le moteur de template à utiliser
app.set("view engine", "ejs");

// j'utilise la route accueilRoute pour le chemin "/"
app.use("/", accueilRoute);

// j'utilise la route authentificationRoute pour les chemins d'authentification
app.use("/", authentificationRoute);

// j'exporte mon app
module.exports = app;
```

---

## routes/accueilRoute.js

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

---

## routes/authentificationRoute.js

```js
// j'importe le package expressjs
const express = require("express");

// j'importe le controller authentificationController
const authController = require("../controllers/authentificationController");

// j'initie le router d'express
const router = express.Router();

// la route GET pour afficher le formulaire d'inscription, exemple localhost:3009/register
router.get("/register", authController.registerView);

// la route POST pour traiter les données du formulaire d'inscription
router.post("/register", authController.registerUser);

// j'exporte le router pour le rendre accessible depuis d'autres fichiers
module.exports = router;
```

---

## controllers/accueilController.js

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

---

## controllers/authentificationController.js

```js
/**
 * Le fichier authentificationController.js a pour mission de gérer...
 */

module.exports = {

    // la vue register
    registerView: (req, res) => {
        res.render("register");
    },

    // on crée une méthode asynchrone (async)
    registerUser: async (req, res) => {
        console.log("#### Controller RegisterUser **");
        console.log("### Controller - req : ", req.body);

        const emailUser = req.body.email;
        const passwordUser = req.body.motdepasse;
        console.log("emailUser :", emailUser);
        console.log("passwordUser :", passwordUser);

        // je m'assure que le mail et le mot de passe sont bien renseignés
        // 1. si la variable emailUser est vide
        // ou
        // 2. si la variable passwordUser est vide
        if (!emailUser || !passwordUser) {
            return res.render('register', {
                error: "Veuillez compléter tous les champs."
            });
        }

        let requeteSql = "INSERT INTO Users(id, email, password) VALUES(?, ?, ?)";
        let ordreDonnees = [null, emailUser, passwordUser];

        // j'obtiens la connexion à la base de données depuis la requête
        req.getConnection((errConnexion, connection) => {

            // si une erreur de connexion survient
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.render('register', { error: "Erreur de connexion à la base de données." });
            }

            // j'exécute la requête SQL avec les données de l'utilisateur
            connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {

                // si une erreur survient pendant la requête
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.render('register', {
                        error: "Erreur lors de l'enregistrement."
                    });
                }

                // si tout s'est bien passé, je redirige vers l'accueil
                res.redirect('/');
            });
        });
    }

};
```

---

## models/User.js

```js
// j'importe les types de données de sequelize
const { DataTypes } = require("sequelize");

// j'importe la connexion à la base de données
const sequelize = require("../config/database");

// je définis le modèle User qui correspond à la table "Users"
const User = sequelize.define("User", {
    // colonne "id" : clé primaire auto-incrémentée
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // colonne "email" : une chaîne de caractères, obligatoire et unique
    email: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true,
    },
    // colonne "password" : une chaîne de caractères, obligatoire
    password: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
}, {
    // je désactive les colonnes createdAt et updatedAt générées automatiquement
    timestamps: false,
});

// j'exporte le modèle pour l'utiliser dans les contrôleurs
module.exports = User;
```

---

## config/database.js

```js
// j'importe sequelize
const { Sequelize } = require("sequelize");

// je crée la connexion à la base de données MySQL
const sequelize = new Sequelize("maygourmet", "root", "mot_de_passe", {
    host: "localhost",
    dialect: "mysql",
});

// j'exporte la connexion pour l'utiliser dans les modèles
module.exports = sequelize;
```
