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
