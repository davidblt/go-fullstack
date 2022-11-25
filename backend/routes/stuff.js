const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');

/*
La route de l'URL '/api/stuff/' qui revient à chaque route est remplacée par '/' et est rappelé dans app.js pour définir la route.
*/
router.post('/', stuffCtrl.createThing);
router.get('/', stuffCtrl.getAllThings);
router.get('/:id', stuffCtrl.getOneThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;
