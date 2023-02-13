const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Création d'un nouvel utilisateur. fonction asynchrone
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // On hash le mot de passe.
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        }); //On crée un nouvel utilisateur.
        user.save() //On sauvegarde l'utilisateur dans la base de données.
        .then(() => res.status(201).json({ message: 'Utilisateur crée'})) //On renvoie une réponse au frontend.
        .catch(error => {
            res.status(400).json({error}); //On renvoie une erreur au frontend si l'utilisateur existe déjà.
        }); 
    })
    .catch(error => res.status(500).json({error})); //On renvoie une erreur au frontend si le mot de passe n'est pas valide.
};

//Connexion et vérification de l'utilisateur et du mot de passe dans la base de données et renvoie un token.
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) //On cherche l'utilisateur dans la base de données.
    .then(user => {
        if (user === null) {
            res.status(401).json({message: 'Message flou paire id incorrect'}); //On renvoie une erreur au frontend si l'utilisateur n'existe pas.
        } else {
            bcrypt.compare(req.body.password, user.password) //On compare le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données.
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Message flou paire id incorrect'}); //On renvoie une erreur au frontend si le mot de passe est incorrect.
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            //création d un objet pour vérification du user avec userId pour vérif la requete
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET', 
                            {expiresIn: '24h'}  // argument de configuration pour expiration du token
                        ) //On renvoie un token au frontend si l'utilisateur et le mot de passe sont corrects.
                    });
                }
            })
            .catch(error => {
                res.status(500).json({error}); 
            })
        }
    })
};