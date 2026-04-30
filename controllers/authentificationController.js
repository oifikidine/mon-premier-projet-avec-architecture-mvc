/**
 * Le fichier authentificationController.js a pour mission de gérer...
 */

module.exports = {

    // la vue register
    registerView: (req, res) => {
        res.render("register");
    },

    // on crée une méthode asynchrone (async)
    registerUser: async (req, res) => {
        console.log("#### Controller RegisterUser **");
        console.log("### Controller - req : ", req.body);

        const emailUser = req.body.email;
        const passwordUser = req.body.motdepasse;
        console.log("emailUser :", emailUser);
        console.log("passwordUser :", passwordUser);

        // je m'assure que le mail et le mot de passe sont bien renseignés 
        // 1. si la variable emailUser est vide
        // ou
        // 2. si la variable passwordUser est vide
        if(!emailUser || !passwordUser) {
            return res.render('register', {
                error: "Veuillez compléter tous les champs."
            });
        }

        let requeteSql = "INSERT INTO Users(id, email, password) VALUES(?, ?, ?)";

        let ordreDonnees = [null, emailUser, passwordUser];

        // j'obtiens la connexion à la base de données depuis la requête
        req.getConnection((errConnexion, connection) => {

            // si une erreur de connexion survient
            if (errConnexion) {
                console.log("Erreur de connexion :", errConnexion);
                return res.render('register', { error: "Erreur de connexion à la base de données." });
            }

            // j'exécute la requête SQL avec les données de l'utilisateur
            connection.query(requeteSql, ordreDonnees, (errRequete, resultat) => {

                // si une erreur survient pendant la requête
                if (errRequete) {
                    console.log("Erreur de requête :", errRequete);
                    return res.render('register', {
                        error: "Erreur lors de l'enregistrement."
                    });
                }

                // si tout s'est bien passé, je redirige vers l'accueil
                res.redirect('/');
            });
        });
    }

};
