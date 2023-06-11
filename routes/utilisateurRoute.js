const express = require('express');
const router = express.Router();

const utilisateurctrl = require('../controllers/utilisateurCtrl');
const auth = require('../middleware/auth');

router.post('/signup/', utilisateurctrl.signUp);
router.post('/signin/', utilisateurctrl.signIn);
router.put('/Update/:id', auth, utilisateurctrl.updateUtilisateur);
router.get('/ById/:id', auth, utilisateurctrl.getOneUtilisateur);
router.delete('/Delete/:id', auth, utilisateurctrl.deleteOneUtilisateur);
router.get('/All/:_filter', auth, utilisateurctrl.getAllUtilisateur);
router.get('/AllByRole/:_role', auth, utilisateurctrl.getAllUtilisateurByRole);
router.get('/', auth, utilisateurctrl.getCurrentUser);

module.exports = router;
