# Explication — Pourquoi on fait chaque chose ?

Ce fichier répond à la question **"Pourquoi ?"** pour chaque décision prise dans ce projet.
Le GUIDE.md dit *quoi faire*, ce fichier dit *pourquoi le faire*.

---

## Pourquoi utiliser Node.js ?

Node.js permet d'écrire du code **côté serveur en JavaScript** — le même langage que le navigateur.
Avant Node.js, il fallait apprendre un autre langage (PHP, Python, Ruby…) pour faire un serveur web.

**But :** Un seul langage pour le front et le back. Pas de surcharge cognitive.

---

## Pourquoi `npm init` ?

`npm init` crée le fichier `package.json`. Ce fichier est le **passeport** de ton projet :

- Il dit à Node.js comment s'appelle le projet, quelle version il a, quel fichier démarrer.
- Il liste toutes les dépendances (les packages) dont le projet a besoin.
- Il permet à n'importe qui de récupérer ton projet et de le relancer avec juste `npm install`.

**But :** Sans `package.json`, ton projet n'a pas d'identité et personne ne peut le reproduire.

---

## Pourquoi installer `express` ?

Node.js tout seul sait créer un serveur HTTP, mais c'est verbeux et fastidieux.
Express est un **framework** qui simplifie tout :

- Définir des routes (`router.get("/", ...)`) en une ligne.
- Gérer les requêtes et réponses proprement.
- Intégrer facilement des moteurs de templates comme EJS.

**But :** Éviter de réinventer la roue. Express fait en 1 ligne ce qui prendrait 20 lignes en Node.js pur.

---

## Pourquoi installer `ejs` ?

Un fichier `.html` est **statique** : il affiche toujours la même chose.
EJS (Embedded JavaScript) est un **moteur de templates** qui permet d'injecter des données dynamiques dans le HTML :

```html
<!-- Affiche le prénom de l'utilisateur connecté -->
<h1>Bonjour <%= prenom %></h1>
```

**But :** Pouvoir générer des pages HTML différentes selon les données (utilisateur connecté, liste de produits, etc.).

---

## Pourquoi créer `.gitignore` ?

Le dossier `node_modules/` peut peser **plusieurs centaines de Mo** et contenir des **milliers de fichiers**.
Il n'a aucune valeur à être versionné car :

1. Il peut toujours être recréé avec `npm install` (grâce au `package.json`).
2. Il alourdit énormément le dépôt Git.
3. Il ralentit les `git push` et `git pull`.

**But :** Garder le dépôt Git léger et ne versionner que le code source qui apporte vraiment de la valeur.

---

## Pourquoi l'architecture MVC ?

Sans architecture, tout le code finit dans un seul fichier. Ça devient rapidement illisible :
un même fichier gèrerait la base de données, les calculs, le HTML, les routes…

MVC (**Modèle — Vue — Contrôleur**) impose de **séparer les responsabilités** :

| Couche | Ce qu'elle fait | Analogie |
|---|---|---|
| **Vue** | Affiche les données à l'utilisateur | La vitrine d'un magasin |
| **Contrôleur** | Reçoit les demandes et orchestre | Le vendeur |
| **Modèle** | Stocke et gère les données | L'entrepôt |

**But :** Chaque fichier a un rôle précis. Si tu veux changer l'affichage, tu touches uniquement les vues. Si tu veux changer la logique, tu touches uniquement les contrôleurs. Moins de risque de casser autre chose.

---

## Pourquoi séparer `myserver.js` et `app.js` ?

On aurait pu tout mettre dans un seul fichier. Mais on sépare pour deux raisons :

### `app.js` — Configuration Express
Ce fichier **configure** l'application : moteur de vues, routes, middlewares…
Il n'a pas besoin de savoir sur quel port écouter. Il décrit juste *comment* l'app fonctionne.

### `myserver.js` — Démarrage du serveur
Ce fichier **démarre** le serveur HTTP. Il crée le serveur, lui passe l'app et l'écoute sur un port.

**But :** Cette séparation facilite les **tests automatisés**. Pour tester l'app, on importe juste `app.js` sans démarrer de serveur. Si tout était dans un seul fichier, chaque test démarrerait un vrai serveur réseau — lourd et lent.

---

## Pourquoi `process.env.PORT || 3009` ?

`process.env.PORT` est une **variable d'environnement** — une valeur externe injectée par la machine qui héberge le serveur.

- En **développement local** : cette variable n'est pas définie → le serveur utilise `3009`.
- En **production** (Heroku, Vercel, etc.) : la plateforme injecte son propre port → le serveur l'utilise.

**But :** Le même code tourne partout sans modification. Tu ne changes pas le port en dur selon l'environnement.

---

## Pourquoi le dossier `views/` avec des fichiers `.ejs` ?

Express a besoin de savoir **où chercher** les templates. En écrivant :
```js
app.set("views", "./views");
app.set("view engine", "ejs");
```
On lui dit : "Tes templates HTML sont dans le dossier `views/`, ils ont l'extension `.ejs`."

Quand le contrôleur appelle `res.render('accueil')`, Express cherche automatiquement `views/accueil.ejs`.

**But :** Centraliser tous les fichiers d'affichage au même endroit. On sait toujours où regarder pour modifier l'apparence d'une page.

---

## Pourquoi le contrôleur exporte un objet avec des fonctions ?

```js
module.exports = {
    accueilView: (req, res) => {
        res.render('accueil');
    }
}
```

`module.exports` rend ce code **importable** dans d'autres fichiers. Sans ça, le code est isolé dans son fichier et inutilisable ailleurs.

On exporte un **objet** (et pas juste une fonction) pour regrouper toutes les fonctions d'un contrôleur ensemble :
- `accueilController.accueilView`
- `accueilController.accueilEdit`
- `accueilController.accueilDelete`
- …

**But :** Une syntaxe claire qui dit d'un coup d'œil à quel contrôleur appartient quelle action.

---

## Pourquoi `req` et `res` dans chaque fonction de contrôleur ?

Ce sont les deux objets fondamentaux d'une requête HTTP :

| Paramètre | Signifie | Contient |
|---|---|---|
| `req` | **request** (requête) | Ce que l'utilisateur envoie : URL, données de formulaire, cookies, headers… |
| `res` | **response** (réponse) | Ce qu'on renvoie : HTML, JSON, redirections, codes d'erreur… |

**But :** Chaque requête HTTP est un échange. `req` = ce qu'on reçoit, `res` = ce qu'on renvoie. Ces deux objets sont passés automatiquement par Express.

---

## Pourquoi le dossier `routes/` ?

On pourrait définir toutes les routes directement dans `app.js`. Mais dès qu'un projet grandit, `app.js` deviendrait un fichier monstre de centaines de lignes.

En séparant les routes dans leur propre dossier :
- `routes/accueilRoute.js` gère les URLs liées à l'accueil
- `routes/authentificationRoute.js` gère les URLs liées à l'authentification (register, login…)
- etc.

**But :** Chaque fichier de routes est court, lisible et focalisé sur une partie de l'application.

---

## Pourquoi `express.Router()` dans les routes ?

```js
const router = express.Router();
```

`express.Router()` crée un **mini-routeur** autonome. C'est comme une "sous-application" Express.
On définit des routes dessus, puis on l'attache à l'application principale dans `app.js` :

```js
app.use("/", accueilRoute);
```

**But :** Modularité. Chaque fichier de routes est indépendant et peut être branché / débranché facilement dans `app.js`.

---

## Pourquoi `../controllers/` dans les imports des routes ?

```js
const accueilController = require("../controllers/accueilController");
```

`..` signifie "remonte d'un dossier". Depuis `routes/accueilRoute.js`, pour atteindre `controllers/accueilController.js`, il faut remonter à la racine du projet (`..`), puis descendre dans `controllers/`.

**But :** Node.js utilise des chemins relatifs. `../` est la façon standard de naviguer dans l'arborescence de fichiers.

---

## Pourquoi Git et GitHub ?

**Git** est un **gestionnaire de versions local** : il enregistre l'historique de ton code.
**GitHub** est un **hébergeur distant** : il stocke ton dépôt en ligne.

Sans Git :
- Une fausse manipulation peut détruire tout ton travail.
- Tu ne peux pas revenir à une version précédente.
- Impossible de collaborer à plusieurs sans écraser le travail des autres.

**But :** Sécuriser son code, collaborer, et avoir un historique de tout ce qui a été fait et pourquoi.

---

## Pourquoi une branche `develop` séparée de `main` ?

`main` = le code **stable**, celui qui tourne en production.
`develop` = le code **en cours de développement**, potentiellement instable.

Règle d'or : on ne fusionne dans `main` que ce qui est **testé et validé**.

**But :** Éviter de mettre du code cassé en production. Si quelqu'un consulte ton projet sur GitHub, la branche `main` est toujours dans un état qui fonctionne.

---

## Le flux complet d'une requête — expliqué

Quand tu tapes `http://localhost:3009` dans ton navigateur :

```
1. Le navigateur envoie une requête HTTP GET /
   └─ myserver.js reçoit la connexion réseau

2. myserver.js passe la requête à app.js
   └─ app.js cherche quelle route correspond à "/"

3. app.js trouve : app.use("/", accueilRoute)
   └─ Il passe la requête à routes/accueilRoute.js

4. accueilRoute.js trouve : router.get("/", accueilController.accueilView)
   └─ Il appelle la fonction accueilView du contrôleur

5. accueilController.js exécute : res.render('accueil')
   └─ Express cherche views/accueil.ejs

6. views/accueil.ejs est transformé en HTML
   └─ Ce HTML est renvoyé au navigateur

7. Le navigateur affiche la page
```

**Pourquoi ce chemin si long ?**
Parce que chaque étape a une responsabilité unique. Si demain tu ajoutes une authentification, tu l'ajoutes entre l'étape 3 et 4 (un middleware) sans toucher au reste. C'est ça, la puissance de la séparation des responsabilités.

---

## Résumé — La logique derrière tout ça

| Décision | Raison fondamentale |
|---|---|
| Node.js + Express | Rapidité de développement, un seul langage |
| `package.json` | Reproductibilité du projet |
| `.gitignore` | Ne pas versionner ce qui peut être régénéré |
| MVC | Chaque fichier a un rôle unique et limité |
| `app.js` / `myserver.js` séparés | Testabilité et clarté |
| `process.env.PORT` | Code identique en dev et en prod |
| EJS | Pages HTML dynamiques |
| `express.Router()` | Modularité des routes |
| Git + branches | Sécurité et stabilité du code |
