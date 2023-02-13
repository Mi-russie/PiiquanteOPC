const express = require('express');

const userCtrl = require('../controllers/user');

const router = express.Router();


//Routes pour les utilisateurs (inscription et connexion).
router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login); 

//Exportation du router.
module.exports = router;