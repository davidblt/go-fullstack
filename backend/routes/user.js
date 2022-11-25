const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Création des 2 routes POST attendues par le frontend :
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;