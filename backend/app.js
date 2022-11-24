const express = require('express');

const app = express();

// Middleware qui intercepte toutes les requêtes qui contiennent du JSON et met à disposition ce contenu dans req.body
app.use(express.json())

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
	console.log(req.body);
	res.status(201).json({
		message: 'Objet créé !',
    });
    
});


// requête GET
app.get('/api/stuff', (req, res, next) => {
	const stuff = [
		{
			_id: 'oeihfzeoi',
			title: 'Appareil photo Ricoh',
			description: 'Les infos de mon premier objet',
			imageUrl:
				'https://cdn.pixabay.com/photo/2015/06/18/15/20/old-813814_960_720.jpg',
			price: 49000,
			userId: 'qsomihvqios',
		},
		{
			_id: 'oeihfzeomoihi',
			title: 'Appareil photo',
			description: 'Les infos de mon deuxième objet',
			imageUrl:
				'https://cdn.pixabay.com/photo/2018/01/28/21/14/lens-3114729_960_720.jpg',
			price: 29000,
			userId: 'qsomihvqios',
		},
	];
	res.status(200).json(stuff);
});

module.exports = app;
