const express = require('express');
const router = express.Router();
const Thing = require('../models/Thing');

/*
La route de l'URL '/api/stuff/' qui revient à chaque route est remplacée par '/' et est rappelé dans app.js pour définir la route.
*/

// requête POST
router.post('/', (req, res, next) => {
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
router.get('/', (req, res, next) => {
	Thing.find()
		.then((things) => res.status(200).json(things))
		.catch((error) => res.status(400).json({ error }));
});

/*
Requête GET pour retourner un seul objet avec findOne().
La route inclut le paramètre dynamique de l'id avec /:id
*/
router.get('/:id', (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then((thing) => res.status(200).json(thing))
		.catch((error) => res.status(404).json({ error }));
});

/*
Requête PUT pour modifier un objet avec updateOne().
La route reprend le parametre dynamique et on compare les id pour s'assurer que c'est bien l'objet voulu.
*/
router.put('/:id', (req, res, next) => {
	Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Objet modifié !' }))
		.catch((error) => res.status(400).json({ error }));
});

// Requête DELETE pour supprimer un objet avec deleteOne().
router.delete('/:id', (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
		.catch((error) => res.status(400).json({ error }));
});

module.exports = router;
