const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const produitCtrl = require('../controllers/produitCtrl');

router.post('/Add', auth, multer, produitCtrl.createProduit);
router.put('/Update/:code', auth, multer, produitCtrl.updateProduit);
router.delete('/Delete/:code', auth, produitCtrl.deleteProduit);
router.get('/Single/:code', auth, produitCtrl.getOneProduit);
router.get('/All/:filter', auth, produitCtrl.getAllProduit);

module.exports = router;