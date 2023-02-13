const express = require('express');//ok
const auth = require('../middelware/auth');//ok
const router = express.Router();//ok
const multer = require('../middelware/multer-config');//ok
const sauceCtrl = require('../controllers/sauce');//ok
const limiter = require('../middleware/rate-limiter');//ok


//Routes pour les sauces (création, modification, suppression, récupération d'une sauce, récupération de toutes les sauces et like ou dislike d'une sauce)
//auth est passé en premier pour chaque action, avant les gestionnaires de routes pour qu il puisse utiliser le travail de auth
router.post('/', auth, limiter, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, limiter, sauceCtrl.likeSauce);
router.put('/:id', auth, limiter, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter, sauceCtrl.deleteSauce);

//Exportation du router.
module.exports = router;