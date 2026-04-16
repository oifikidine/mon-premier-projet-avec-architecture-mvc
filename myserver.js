// Ce fichier démarre le serveur HTTP

// j'importe le module http de nodejs
const http = require("http");

// j'importe mon application express
const app = require("./app");

// je définis le port d'écoute du serveur
const PORT = process.env.PORT || 3009;

// je crée le serveur HTTP en lui passant mon app
const server = http.createServer(app);

// je démarre le serveur sur le port défini
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
