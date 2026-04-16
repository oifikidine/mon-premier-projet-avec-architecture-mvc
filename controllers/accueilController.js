/**
 * ce fichier est un controller.
 */
// dans ce fichier je vais créer la logique de la page 'accueil.ejs'

module.exports = {
    // je crée la fonction qui affiche la vue accueil
    accueilView: (req, res) => {
        // je rends la vue accueil.ejs
        res.render('accueil');
    }
}
