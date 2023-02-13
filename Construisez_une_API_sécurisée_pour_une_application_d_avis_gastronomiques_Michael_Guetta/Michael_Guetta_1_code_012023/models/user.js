const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma utilisateur.
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//l ajout du plugin permet de mieux sécuriser les erreurs d un double utilisateur, méthode true
userSchema.plugin(uniqueValidator); //je passe uniqueValidator comme argument

//Exportation du schéma utilisateur.
module.exports = mongoose.model('User', userSchema);