
// j'importe le package expressjs
const express = require("express");

// j'importe le middleware express-myconnection pour gérer la connexion MySQL
const myConnection = require('express-myconnection');

// J'initie l'application expressjs
const app= express();

// j'importe la route accueilRoute.js
const accueilRoute = require("./routes/accueilRoute");

// j'importe la route authentificationRoute.js
const authentificationRoute = require("./routes/authentificationRoute");

// j'importe la route userRoute.js
const userRoute = require("./routes/userRoute");

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

// j'utilise la route userRoute pour les chemins de gestion des utilisateurs
app.use("/", userRoute);

// j'export mon app 
module.exports = app;