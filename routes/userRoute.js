// j'importe le package expressjs
const express = require("express");

// j'initie le router d'express
const router = express.Router();

// j'importe le controller userController
const userController = require("../controllers/userController");

// récupérer tous les utilisateurs (avec filtre email optionnel : /users?email=gmail)
router.get("/users", userController.getAllUsers);

// récupérer un utilisateur spécifique par son id
router.get("/users/:id", userController.getUserById);

// supprimer un utilisateur spécifique par son id
router.delete("/users/:id", userController.deleteUserById);

// supprimer tous les utilisateurs
router.delete("/users", userController.deleteAllUsers);

// mettre à jour un utilisateur par son id
router.put("/users/:id", userController.updateUserById);

// j'exporte le router
module.exports = router;
