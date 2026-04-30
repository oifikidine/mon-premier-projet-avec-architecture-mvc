// j'importe la connexion à la base de données
const sequelize = require("./config/database");

// j'importe le modèle User pour que Sequelize connaisse la table à synchroniser
const User = require("./models/User");

// je synchronise les modèles avec la base de données
// force: false → crée la table si elle n'existe pas, ne la supprime pas si elle existe déjà
sequelize.sync({ force: false })
    .then(() => {
        console.log("Tables synchronisées !");
    })
    .catch((erreur) => {
        console.log("Erreur :", erreur);
    });
