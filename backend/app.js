const express = require('express'); // framework basé sur Node.JS
const mongoose = require('mongoose'); // package qui facilite les interactions avec MongoDB

const Thing = require('./models/Thing');

// création de l'application avec express()
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

// requête POST
app.post('/api/stuff', (req, res, next) => {
	delete req.body._id; // supprime car MongoDB en attribut déjà un.
	const thing = new Thing({
		// nouvelle instance du modele.
		...req.body, // spread operator qui copie tous les champs du body.
	});
	thing
		.save() // enregistre dans la base de données.
		.then(() => res.status(201).json({ message: 'Objet enregistré !' }))
		.catch((error) => res.status(400).json({ error }));
});

// Requête GET pour retourner tous les objets avec find()
app.get('/api/stuff', (req, res, next) => {
	Thing.find()
		.then((things) => res.status(200).json(things))
		.catch((error) => res.status(400).json({ error }));
});

/*
Requête GET pour retourner un seul objet avec findOne().
La route inclut le paramètre dynamique de l'id avec /:id
*/
app.get('/api/stuff/:id', (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then((thing) => res.status(200).json(thing))
		.catch((error) => res.status(404).json({ error }));
});

/*
Requête PUT pour modifier un objet avec updateOne().
La route reprend le parametre dynamique et on compare les id pour s'assurer que c'est bien l'objet voulu.
*/
app.put('/api/stuff/:id', (req, res, next) => {
	Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Objet modifié !' }))
		.catch((error) => res.status(400).json({ error }));
});

// Requête DELETE pour supprimer un objet avec deleteOne().
app.delete('/api/stuff/:id', (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
		.catch((error) => res.status(400).json({ error }));
});

module.exports = app;
