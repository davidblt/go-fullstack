const mongoose = require('mongoose');

// Rajout du plugin pour s'assurer que l'email est unique
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// On applique le plugin au schema avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
