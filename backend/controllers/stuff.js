const Thing = require('../models/Thing');

// Requête POST pour créer un objet.
exports.createThing = (req, res, next) => {
	delete req.body._id; // supprime car MongoDB en attribut déjà un.
	const thing = new Thing({
		// nouvelle instance du modele.
		...req.body, // spread operator qui copie tous les champs du body.
	});
	thing
		.save() // enregistre dans la base de données.
		.then(() => res.status(201).json({ message: 'Thing saved successfully' }))
		.catch((error) => res.status(400).json({ error }));
};

// Requête GET pour retourner tous les objets avec find().
exports.getAllThings = (req, res, next) => {
	Thing.find()
		.then((things) => res.status(200).json(things))
		.catch((error) => res.status(400).json({ error }));
};

/*
Requête GET pour retourner un seul objet avec findOne().
La route inclut le paramètre dynamique de l'id avec /:id
*/
exports.getOneThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then((thing) => res.status(200).json(thing))
		.catch((error) => res.status(404).json({ error }));
};

/*
Requête PUT pour modifier un objet avec updateOne().
La route reprend le parametre dynamique et on compare les id pour s'assurer que c'est bien l'objet voulu.
*/
exports.modifyThing = (req, res, next) => {
	Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Thing modified successfully' }))
		.catch((error) => res.status(400).json({ error }));
};

// Requête DELETE pour supprimer un objet avec deleteOne().
exports.deleteThing = (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Thing deleted' }))
		.catch((error) => res.status(400).json({ error }));
};
