const express = require('express'); // framework basé sur Node.JS
const mongoose = require('mongoose'); // package qui facilite les interactions avec MongoDB
const userRoutes = require('./routes/user');
const stuffRoutes = require('./routes/stuff');

// Création de l'application avec express()
const app = express();

// Variables d'environnement : permet de ne pas révéler les infos confidentielles.
const dotenv = require('dotenv');
dotenv.config();

// Connection à la base de données MongoDB avec mongoose :
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ebbffex.mongodb.net/?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connection to MongoDB successful'))
	.catch(() => console.log('Connection to MongoDB failed'));

// Middleware qui intercepte toutes les requêtes qui contiennent du JSON et met à disposition ce contenu dans req.body
app.use(express.json());

/*
Middleware CORS (Cross Origin Resource Sharing).
Système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents.
Pas d'adresse car appliqué à toutes les routes.
*/
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

// Route pour l'authentification
app.use('/api/auth', userRoutes);
// Pour la route '/api/stuff', on applique la logique du router.
app.use('/api/stuff', stuffRoutes);

module.exports = app;
