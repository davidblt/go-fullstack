const mongoose = require('mongoose');

/*
Création du modèle de "thing" avec la fonction "Schema()" permet de créer un schéma de données pour la base de données MongoDB.
On lui passe un objet avec les différents champs.
*/
const thingSchema = mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	imageUrl: { type: String, required: true },
	userId: { type: String, required: true },
	price: { type: Number, required: true },
});

/*
On  exporte ce schema pour l rendre utilisable dans l'application.
La méthode model() transforme ce modèle en un modèle utilisable('nom du schema', 'schema')
*/
module.exports = mongoose.model('Thing', thingSchema);
