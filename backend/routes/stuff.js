const express = require('express');
const auth = require('../middleware/auth');
const stuffCtrl = require('../controllers/stuff');
const multer = require('../middleware/multer-config');
const router = express.Router();

/*
La route de l'URL '/api/stuff/' qui revient à chaque route est remplacée par '/' et est rappelé dans app.js pour définir la route.
Ajout du middleware 'auth' AVANT les suivants.
*/
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/', auth, stuffCtrl.getAllThings);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;
