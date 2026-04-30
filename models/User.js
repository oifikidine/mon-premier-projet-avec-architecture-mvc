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
    // je désactive les colonnes createdAt et updatedAt générées automatiquement par Sequelize
    timestamps: false,
});

// j'exporte le modèle pour l'utiliser dans les contrôleurs
module.exports = User;
