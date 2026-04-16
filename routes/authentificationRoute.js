// j'importe le package expressjs
const express = require("express");

// j'importe le controller authentificationController
const authController = require("../controllers/authentificationController");

// j'initie le router d'express
const router = express.Router();

// la route pour la page d'inscription, exemple localhost:3009/register
router.get("/register", authController.registerView);

// j'exporte le router pour le rendre accessible depuis d'autres fichiers de l'application
module.exports = router;
