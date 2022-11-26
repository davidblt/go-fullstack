const Thing = require('../models/Thing');
const fs = require('fs'); // Permt d'interagir avec le système de fichiers du serveur.

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
		}`,
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
La route reprend le paramètre dynamique :id et on compare les id pour s'assurer que c'est bien l'objet voulu.

Il faut gérer 2 situations selon qu'il y a un fichier ou non à la requête.
Pour le savoir, il suffit de regarder s'il y a un champs 'file' dans la requête (req.file).
*/
exports.modifyThing = (req, res, next) => {
	/*
	Fonction ternaire : s'il y a req.file alors on parse pour passer d'une string à un objet JS exploitable.
	Sinon, on récupère simplement le corps de la requête.
	*/
	const thingObject = req.file
		? {
				...JSON.parse(req.body.thing),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		}
		: { ...req.body };

	// Ensuite on supprime l'id par sécurité.
	delete thingObject._userId;

	// Enfin, il faut chercher cet objet dans la base de données pour vérifier qu'il appartient bien à l'utilisateur.
	Thing.findOne({ _id: req.params.id })
		.then((thing) => {
			if (thing.userId != req.auth.userId) {
				res.status(400).json({ message: 'Not authrized' });
			} else {
				Thing.updateOne(
					{ id: req.params.id },
					{ ...thingObject, _id: req.params.id }
				)
					.then(() => res.status(200).json({ message: 'Object updated' }))
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

/*
Requête DELETE pour supprimer un objet avec deleteOne().
Suppression uniquement si l'objet appartien à l'utilisateur.
*/
exports.deleteThing = (req, res, next) => {
	// On commence par récupérer l'objet en base de données :
	Thing.findOne({ _id: req.params.id })
		.then((thing) => {
			// Ensuite vérifier le propriétaire
			if (thing.userId != req.auth.userId) {
				res.status(401).json({ message: 'Not authorized' });
			} else {
				/*
				Si c'est le bon utilisateur, il faut supprimer l'objet ET l'image.
				Pour retrouver l'image, on recrée son chemin.
				*/
				const filename = thing.imageUrl.split('/images/')[1];

				// unlink() du package fs permet de supprimer un fichier du système de fichiers.
				fs.unlink(`images/${filename}`, () => {
					Thing.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: 'Object deleted' }))
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
