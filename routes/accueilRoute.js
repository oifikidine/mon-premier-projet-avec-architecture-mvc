
// j'importe le package expressjs
const express = require("express");

// j'initie le router d'express
const router = express.Router();

// j'importe le controller accueilController
const accueilController = require("../controllers/accueilController");

// je trace ma route en utilisant router

// la route pour l'accueil, exemple localhost:3009
router.get("/",accueilController.accueilView);

// j'exporte le router
module.exports= router;
