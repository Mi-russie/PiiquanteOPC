const passwordValidator = require('password-validator');

//Middleware pour vérifier si le mot de passe est valide.
const password = new passwordValidator();
password
.is().min(8) //Minimum 8 caracteres
.is().max(15) //Maximum 15 caracteres
.has().uppercase() //Doit contenir des lettres majuscules
.has().lowercase() //Doit contenir des lettres minuscules
.has().digits() //Doit contenir des chiffres
.has().not().spaces() //Ne doit contenir des espaces
.is().not().oneOf(['Passw0rd', 'Password123']); //Ne doit pas contenir les valeurs suivantes

// Exportation du middleware
module.exports = (req, res, next) => {
    if (!password.validate(req.body.password)) {
        return res.status(400).json({message: 'Mot de passe invalide. Doit contenir entre 8 et 15 caractères, dont des lettres majuscules, minuscules et des chiffres'}); //On renvoie une erreur au frontend si le mot de passe n'est pas valide.
    } else {
        next(); //On passe à la suite si le mot de passe est valide.
    }
}