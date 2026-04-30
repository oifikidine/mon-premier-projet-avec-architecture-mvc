Le prof vous donne la structure complète de l'API. Il faut créer deux nouveaux fichiers et mettre à jour app.js.

Voici le plan :


routes/userRoute.js         ← toutes les routes /users
controllers/userController.js ← toute la logique users
app.js                      ← brancher userRoute
Les routes existantes (/ et /register) restent dans leurs fichiers actuels. Je crée tout ?

fait tout à ma place
Write c:\Users\Modex\Documents\modexdwwm\nodemvc\controllers\userController.js
148 lines
/**
 * Le fichier userController.js a pour mission de gérer les opérations sur les utilisateurs.
 */

module.exports = {

    // récupérer tous les utilisateurs
    getAllUsers: (req, res) => {
        req.getConnection((errConnexion, connection) => {
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.status(500).json({ error: "Erreur de connexion à la base de données." });
            }

            // je vérifie si un filtre email est passé en paramètre GET (?email=gmail)
            const emailFilter = req.query.email;

            let requeteSql;
            let ordreDonnees;

            if (emailFilter) {
                // je récupère les utilisateurs dont l'email contient le filtre
                requeteSql   = "SELECT * FROM Users WHERE email LIKE ?";
                ordreDonnees = [`%${emailFilter}%`];
            } else {
                // je récupère tous les utilisateurs
                requeteSql   = "SELECT * FROM Users";
                ordreDonnees = [];
            }

            connection.query(requeteSql, ordreDonnees, (errRequete, resultats) => {
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
                }

                // je renvoie les utilisateurs en JSON
                res.json(resultats);
            });
        });
    },

    // récupérer un utilisateur par son id
    getUserById: (req, res) => {
        // je récupère l'id depuis les paramètres de l'URL (/users/:id)
        const id = req.params.id;

        req.getConnection((errConnexion, connection) => {
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.status(500).json({ error: "Erreur de connexion à la base de données." });
            }

            let requeteSql   = "SELECT * FROM Users WHERE id = ?";
            let ordreDonnees = [id];

            connection.query(requeteSql, ordreDonnees, (errRequete, resultats) => {
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur." });
                }

                // je renvoie l'utilisateur trouvé ou un message si introuvable
                if (resultats.length === 0) {
                    return res.status(404).json({ error: "Utilisateur introuvable." });
                }

                res.json(resultats[0]);
            });
        });
    },

    // supprimer un utilisateur par son id
    deleteUserById: (req, res) => {
        const id = req.params.id;

        req.getConnection((errConnexion, connection) => {
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.status(500).json({ error: "Erreur de connexion à la base de données." });
            }

            let requeteSql   = "DELETE FROM Users WHERE id = ?";
            let ordreDonnees = [id];

            connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.status(500).json({ error: "Erreur lors de la suppression." });
                }

                // je confirme la suppression
                res.json({ message: `Utilisateur ${id} supprimé avec succès.` });
            });
        });
    },

    // supprimer tous les utilisateurs
    deleteAllUsers: (req, res) => {
        req.getConnection((errConnexion, connection) => {
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.status(500).json({ error: "Erreur de connexion à la base de données." });
            }

            let requeteSql = "DELETE FROM Users";

            connection.query(requeteSql, (errRequete, resultat) => {
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.status(500).json({ error: "Erreur lors de la suppression." });
                }

                // je confirme la suppression de tous les utilisateurs
                res.json({ message: "Tous les utilisateurs ont été supprimés." });
            });
        });
    },

    // mettre à jour un utilisateur par son id
    updateUserById: (req, res) => {
        const id           = req.params.id;
        const emailUser    = req.body.email;
        const passwordUser = req.body.password;

        req.getConnection((errConnexion, connection) => {
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.status(500).json({ error: "Erreur de connexion à la base de données." });
            }

            let requeteSql   = "UPDATE Users SET email = ?, password = ? WHERE id = ?";
            let ordreDonnees = [emailUser, passwordUser, id];

            connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.status(500).json({ error: "Erreur lors de la mise à jour." });
                }

                // je confirme la mise à jour
                res.json({ message: `Utilisateur ${id} mis à jour avec succès.` });
            });
        });
    },

};
Write c:\Users\Modex\Documents\modexdwwm\nodemvc\routes\userRoute.js
27 lines
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
Read c:\Users\Modex\Documents\modexdwwm\nodemvc\app.js
Edit c:\Users\Modex\Documents\modexdwwm\nodemvc\app.js
Added 3 lines
Edit c:\Users\Modex\Documents\modexdwwm\nodemvc\app.js
Added 3 lines
Tout est en place. Voici le récapitulatif des routes créées :

Méthode	URL	Fonction
GET	/users	getAllUsers — tous les utilisateurs
GET	/users?email=gmail	getAllUsers — filtrés par email
GET	/users/:id	getUserById — un utilisateur par id
DELETE	/users/:id	deleteUserById — supprimer par id
DELETE	/users	deleteAllUsers — supprimer tous
PUT	/users/:id	updateUserById — modifier par id
Redémarre le serveur et teste avec Postman. Commence par GET http://localhost:3009/users pour voir tous les utilisateurs.

c:\Users\Modex\Documents\modexdwwm\nodemvc\controllers\authentificationController.js
j'aimerais tester toute les url ?
Lance le serveur :


node myserver.js
Ensuite dans Postman, teste dans cet ordre :

1. Voir tous les utilisateurs


GET http://localhost:3009/users
2. Voir un utilisateur par id


GET http://localhost:3009/users/1
3. Filtrer par email


GET http://localhost:3009/users?email=gmail
4. Ajouter un utilisateur (tu en as besoin pour tester le reste)


POST http://localhost:3009/register
Body → x-www-form-urlencoded
email     → test@gmail.com
motdepasse → motdepasse123
5. Modifier un utilisateur


PUT http://localhost:3009/users/1
Body → x-www-form-urlencoded
email    → nouveau@gmail.com
password → nouveaumotdepasse
6. Supprimer un utilisateur par id


DELETE http://localhost:3009/users/1
7. Supprimer tous les utilisateurs


DELETE http://localhost:3009/users
Dis-moi ce que tu obtiens à chaque étape.

c:\Users\Modex\Documents\modexdwwm\nodemvc\controllers\userController.js
est ce que toutes les méthode fonctionnent
Je ne peux pas le savoir sans que tu les testes. Lance-les dans Postman et dis-moi ce que chacune retourne — je verrai immédiatement si quelque chose cloche.

Commence par le plus simple :


GET http://localhost:3009/users