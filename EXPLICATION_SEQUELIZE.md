# Explication Sequelize — Du global au détail

---

## Niveau 1 — La vision globale : pourquoi Sequelize ?

### Le problème sans Sequelize

Une application web a besoin de **stocker des données** : des utilisateurs, des articles, des commandes…
Ces données vivent dans une **base de données** (MySQL, PostgreSQL, etc.).

Pour y accéder depuis Node.js, on pourrait écrire du SQL brut :
```js
db.query("SELECT * FROM users WHERE id = 1");
db.query("INSERT INTO users (nom, email) VALUES ('Jean', 'jean@mail.com')");
```

Ça fonctionne, mais :
- C'est verbeux et répétitif
- Si tu changes de base de données, tu réécris tout
- Tu gères toi-même la protection contre les injections SQL

### La solution : un ORM

**ORM = Object-Relational Mapper** (Mappeur Objet-Relationnel).

Un ORM fait le pont entre ton code JavaScript et ta base de données.
Tu parles **JavaScript**, l'ORM traduit en **SQL** tout seul.

```
Ton code JS  →  Sequelize  →  SQL  →  MySQL
                (traduction)
```

**Sequelize** est l'ORM le plus utilisé dans l'écosystème Node.js.

---

## Niveau 2 — La place de Sequelize dans le MVC

Avant Sequelize, ton projet MVC était incomplet :

```
Route → Contrôleur → Vue
```

La couche **Modèle** manquait. Sequelize la remplit :

```
Route → Contrôleur → Modèle (Sequelize) → Base de données MySQL
                  ↘ Vue (EJS)
```

| Couche | Fichier | Rôle |
|---|---|---|
| Route | `routes/*.js` | Reçoit l'URL et redirige |
| Contrôleur | `controllers/*.js` | Décide quoi faire |
| **Modèle** | `models/*.js` | **Parle à la base de données** |
| Vue | `views/*.ejs` | Affiche le HTML |

Le modèle est la seule couche qui **touche les données**. Le contrôleur ne fait que demander au modèle, jamais directement à la BDD.

---

## Niveau 3 — Les trois éléments clés de Sequelize

Pour utiliser Sequelize, il faut trois choses :

```
1. La connexion         config/database.js    "comment se connecter à MySQL"
2. Le(s) modèle(s)     models/User.js        "à quoi ressemble une table"
3. La synchronisation  sequelize.sync()      "crée la table si elle n'existe pas"
```

Ces trois éléments forment la base. On les détaille dans les niveaux suivants.

---

## Niveau 4 — L'installation

### Les deux packages nécessaires

```bash
npm install sequelize mysql2
```

| Package | Rôle |
|---|---|
| `sequelize` | L'ORM lui-même — fournit les méthodes JS |
| `mysql2` | Le driver — permet à Sequelize de parler à MySQL |

Sequelize ne sait pas parler à MySQL tout seul. `mysql2` est son traducteur bas niveau.
Si tu changeais pour PostgreSQL, tu installerais `pg` à la place de `mysql2`. Sequelize, lui, ne changerait pas.

---

## Niveau 5 — La connexion : `config/database.js`

### Le fichier

```js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodemvc", "root", "ton_mot_de_passe", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
```

### Décortiqué ligne par ligne

**`const { Sequelize } = require("sequelize")`**
On importe la classe `Sequelize` depuis le package. Les accolades `{ }` signifient
qu'on extrait une propriété précise de ce que le package exporte (destructuring).

**`new Sequelize("nodemvc", "root", "mot_de_passe", { ... })`**
On crée une instance de connexion. Les paramètres dans l'ordre :
1. `"nodemvc"` → le nom de la base de données MySQL
2. `"root"` → le nom d'utilisateur MySQL
3. `"mot_de_passe"` → le mot de passe MySQL
4. `{ host, dialect }` → la configuration :
   - `host: "localhost"` → MySQL tourne sur la même machine
   - `dialect: "mysql"` → on utilise MySQL (pas PostgreSQL, SQLite, etc.)

**`module.exports = sequelize`**
On exporte l'instance pour pouvoir l'importer dans les modèles et ailleurs.

### Pourquoi un dossier `config/` ?

Ce dossier regroupe tout ce qui est **configuration** — des informations sur l'environnement,
pas sur la logique métier. Si tu as plusieurs environnements (dev, prod), tu peux
avoir `config/database.dev.js` et `config/database.prod.js`.

---

## Niveau 6 — Le modèle : `models/User.js`

### Le fichier

```js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
}, {
    timestamps: false, // désactive createdAt et updatedAt
});

module.exports = User;
```

### C'est quoi un modèle ?

Un modèle est la **représentation JavaScript d'une table MySQL**.
Chaque modèle = une table. Chaque propriété du modèle = une colonne.

```
Modèle User (JavaScript)              →    Table `Users` (MySQL)
──────────────────────────────────────────────────────────────────
id: INTEGER primaryKey autoIncrement  →    `id` INTEGER PRIMARY KEY auto_increment
email: STRING(55)                     →    `email` VARCHAR(55) NOT NULL UNIQUE
password: STRING(55)                  →    `password` VARCHAR(55) NOT NULL
timestamps: false                     →    (pas de createdAt ni updatedAt)
```

### Décortiqué

**`const { DataTypes } = require("sequelize")`**
`DataTypes` contient tous les types de colonnes disponibles. On en a besoin pour
définir le type de chaque colonne.

**`sequelize.define("User", { ... })`**
On demande à Sequelize de créer un modèle nommé `"User"`.
Sequelize cherchera (ou créera) automatiquement une table nommée `"Users"` (avec un S, au pluriel).

**Les options de chaque colonne :**

| Option | Valeur | Ce que ça fait |
|---|---|---|
| `type` | `DataTypes.STRING` | Texte court — devient VARCHAR(255) en SQL |
| `type` | `DataTypes.INTEGER` | Nombre entier |
| `type` | `DataTypes.BOOLEAN` | Vrai / Faux |
| `type` | `DataTypes.DATE` | Date et heure |
| `allowNull` | `false` | Le champ est obligatoire — refusé si vide |
| `allowNull` | `true` | Le champ est optionnel |
| `unique` | `true` | Deux lignes ne peuvent pas avoir la même valeur |
| `defaultValue` | `"admin"` | Valeur par défaut si rien n'est fourni |

**`timestamps: false`**
Par défaut Sequelize ajoute `createdAt` et `updatedAt`. En passant `timestamps: false`
dans le 3e argument de `define()`, on désactive ces colonnes.
C'est nécessaire quand on utilise aussi des requêtes SQL brutes qui ne les renseignent pas.

---

## Niveau 7 — La synchronisation : `sequelize.sync()`

### Ce que ça fait

`sequelize.sync()` compare tes modèles JavaScript avec les tables réellement présentes
dans MySQL, puis agit en conséquence.

```js
sequelize.sync({ force: false })
    .then(() => console.log("Tables synchronisées !"))
    .catch((erreur) => console.log("Erreur :", erreur));
```

### Les modes de synchronisation

| Option | Comportement | Quand l'utiliser |
|---|---|---|
| `{ force: false }` | Crée la table si elle n'existe pas. Ne touche à rien sinon. | **Toujours en production** |
| `{ force: true }` | Supprime la table et la recrée à chaque fois. | En développement uniquement — **détruit toutes les données** |
| `{ alter: true }` | Met à jour la table si le modèle a changé (ajoute des colonnes). | En développement avec des données existantes |

### Ce que Sequelize a exécuté dans notre cas

```sql
-- 1. Il a vérifié si la table existait
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'nodemvc';

-- 2. Elle n'existait pas, il l'a créée
CREATE TABLE IF NOT EXISTS `Users` (
    `id`        INTEGER NOT NULL auto_increment,
    `nom`       VARCHAR(255) NOT NULL,
    `email`     VARCHAR(255) NOT NULL UNIQUE,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- 3. Il a vérifié les index
SHOW INDEX FROM `Users`;
```

Tu n'as écrit aucune de ces lignes. Sequelize les a générées depuis `User.js`.

### Pourquoi `.then()` et `.catch()` ?

`sequelize.sync()` est une opération **asynchrone** : elle prend du temps (elle parle au réseau / disque).
En JavaScript, les opérations asynchrones retournent une **Promise**.

- `.then(() => ...)` → s'exécute quand la Promise réussit
- `.catch((err) => ...)` → s'exécute quand la Promise échoue

---

## Niveau 8 — La structure finale du projet

```
nodemvc/
│
├── config/
│   └── database.js          ← connexion Sequelize → MySQL
│
├── models/
│   └── User.js              ← modèle = représentation de la table Users
│
├── controllers/             ← logique des pages (utilisera les modèles bientôt)
├── routes/                  ← URLs
├── views/                   ← templates HTML
│
├── testDB.js                ← fichier temporaire pour tester (à supprimer en prod)
└── app.js
```

---

## Récapitulatif — Les étapes pour intégrer Sequelize dans un projet

```
1. npm install sequelize mysql2
        ↓
2. Créer config/database.js
   → new Sequelize(nomBDD, user, password, { dialect: "mysql" })
        ↓
3. Créer models/MonModele.js
   → sequelize.define("NomModele", { colonne: { type, options } })
        ↓
4. Synchroniser avec sequelize.sync()
   → La table est créée dans MySQL
        ↓
5. Utiliser le modèle dans les contrôleurs
   → User.findAll(), User.create(), User.findByPk()...
```

---

## Ce qui vient ensuite : les méthodes CRUD

Une fois la table créée, Sequelize donne accès à toutes les opérations sur les données :

| Opération | SQL équivalent | Sequelize |
|---|---|---|
| Lire tous | `SELECT * FROM Users` | `User.findAll()` |
| Lire un | `SELECT * FROM Users WHERE id = 1` | `User.findByPk(1)` |
| Créer | `INSERT INTO Users ...` | `User.create({ nom, email })` |
| Modifier | `UPDATE Users SET ...` | `User.update({ nom }, { where: { id } })` |
| Supprimer | `DELETE FROM Users WHERE id = 1` | `User.destroy({ where: { id: 1 } })` |

C'est l'étape suivante : brancher ces méthodes dans les contrôleurs.
