const express = require('express');
const password = require('../middleware/password');
const rateLimit = require('../middleware/rate-limit');
const userCtrl = require('../controllers/user');
const router = express.Router();

/*
Création des 2 routes POST attendues par le frontend.
La route signup passe en premier par le middleware password.
*/
router.post('/signup', password, userCtrl.signup);
router.post('/login', rateLimit, userCtrl.login);

module.exports = router;
