
// j'importe le package expressjs
const express = require("express");

// J'initie l'application expressjs
const app= express();

// j'importe la route accueilRoute.js
const accueilRoute = require("./routes/accueilRoute");

// j'importe la route authentificationRoute.js
const authentificationRoute = require("./routes/authentificationRoute");

// je définis le dossier où se trouvent mes vues
app.set("views", "./views");

// je définis le moteur de template à utiliser
app.set("view engine", "ejs");

// j'utilise la route accueilRoute pour le chemin "/"
app.use("/", accueilRoute);

// j'utilise la route authentificationRoute pour les chemins d'authentification
app.use("/", authentificationRoute);

// j'export mon app 
module.exports = app;