// Package bcrypt pour le cryptage des mots de passe
const bcrypt = require('bcrypt');

// Package jsonwentoken génére des JSON web tokens qui sont des tokens chiffrés et peuvent être utilisés pour l'autorisation.
const jwt = require('jsonwebtoken');

// On a besoin du modèle User
const User = require('../models/User');

// Middleware pour l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user
				.save()
				.then(() => res.status(201).json({ message: new user.saved() }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// Middleware pour la connection d'un utilisateur existant
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ message: 'Invalid login/password' });
			} else {
				bcrypt
					.compare(req.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							return res
								.status(401)
								.json({ message: 'Invalid login/password' });
						} else {
							res.status(200).json({
								userId: user._id,
								// sign() du package jsonwebtoken utilise une clé secrète pour chiffrer un token :
								token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
									expiresIn: '24h',
								}),
							});
						}
					})
					.catch((error) => res.status(500).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
