const Thing = require('../models/Thing');

// Requête POST pour créer un objet.
exports.createThing = (req, res, next) => {
	// Il faut parser la requête qui est en form-data (string) pour la convertir en objet Javascript :
	const thingObject = JSON.parse(req.body.thing);

	/*
	Puis on supprime les id de cet objet JS. 
	Le 1er car il est automatiquement généré par la base de données. Le 2eme car il vient du client et on ne doit jamais faire confiance au client. On ne fait confiance qu'au userId qui vient du token d'authentification.
	*/
	delete thingObject._id; // MongoDB en attribut déjà un.
	delete thingObject._userId; // Vient du client = pas confiance.

	// On crée une nouvelle instance du modèle Thing :
	const thing = new Thing({
		...thingObject, // spread operator qui copie tous les champs du body.

		// On extrait le userId de l'objet requête grâce au middleware auth
		userId: req.auth.userId,

		// Il faut générer l'URL de l'image par nous-même car multer ne passe que le nom de fichier.
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`
	});
	thing
		.save() // enregistre dans la base de données.
		.then(() => res.status(201).json({ message: 'Object saved successfully' }))
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
		.then(() =>
			res.status(200).json({ message: 'Thing modified successfully' })
		)
		.catch((error) => res.status(400).json({ error }));
};

// Requête DELETE pour supprimer un objet avec deleteOne().
exports.deleteThing = (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Thing deleted' }))
		.catch((error) => res.status(400).json({ error }));
};
