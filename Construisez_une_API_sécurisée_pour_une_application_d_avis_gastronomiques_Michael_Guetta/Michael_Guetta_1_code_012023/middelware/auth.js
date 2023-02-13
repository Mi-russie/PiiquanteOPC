// le middelware permet l authentification des infos envoyés par le client
//vérification des infos tel que le userId
require('dotenv').config();
const jwt = require('jsonwebtoken');
//récupération du token: 2 mots cles+ gestion dws erreurs
// récup du header et division de la chaine de caractère en un tableau: split. Puis decodage du token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récup token dans header
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); //décodage token.
        const userId = decodedToken.userId; //recup userId
        req.auth ={
            userId: userId //ajout de cette valeur a l objet request transmis aux routes appelées par la suite
        }; 
        next();
    } catch(error) {
        res.status(401).json({error: error | 'Requête non authentifiée'});
    }
};