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
