// j'importe sequelize
const { Sequelize } = require("sequelize");

// je crée la connexion à la base de données MySQL
const sequelize = new Sequelize("maygourmet", "root", "rsma2026", {
    host: "localhost",
    dialect: "mysql",
});

// j'exporte la connexion pour l'utiliser dans les modèles
module.exports = sequelize;
