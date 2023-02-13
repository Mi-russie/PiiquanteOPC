const Sauce = require ('../models/sauces');
const fs = require('fs'); //importation methode unlike pour fonction deleteSauce

//Creation nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; //suppression du champ id car maintenant généré par la base de données et du champ id car pas confiance a l utilisateur qui pourrait utiliser id de qq d autre 
    const sauce = new Sauce({ 
        ...sauceObject, 
        userId : req.auth.userId, //je récupère l id de l utilisateur
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //je gènere l url de l'image
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save() //enregistrement dans la base de données
    .then(() => res.status(201).json({message: 'Sauce enregistree!'}))
    .catch(error => res.status(400).json({error}));
    //console.log(`Nouvelle sauce ${sauceObject.name} enregistrée par ${req.auth.userId} !`);
};

//recuperation d une sauce.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) //je récupère la sauce correspondant à l id.
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

//suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) //je recupere la sauce correspondant à l'id
    .then(sauce => {
        //si userId qui supprime la sauce = userId qui a cree la sauce
        if(sauce.userId != req.auth.userId) {
            return res.status(403).json({error: 'Non autorise supprimer cette sauce !'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; //je recupere le nom du fichier
            fs.unlink(`images/${filename}`,() => { //je supprime le fichier.
                Sauce.deleteOne({_id: req.params.id}) //je supprime la sauce correspondant à l'id
                .then(() => res.status(200).json({message: 'Sauce supprimée !'})) //je renvoie message de confirmation
                .catch(error => res.status(401).json({error})); //On renvoie une erreur si la suppression échoue
                console.log(`Sauce ${sauce.name} supprimée par ${req.auth.userId} !`); //Console log avec la sauce supprimee et l utilisateur qui la supprime.
            });
        }
    })
    .catch(error => res.status(500).json({error})); //si sauce n existe pas => je renvoie erreur 500
};

//modification d une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //je vérifie si une image est présente dans la requete
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //je génère l url de l image
    } : {...req.body}; //On extrait l'objet sauce du corps de la requête.

    delete sauceObject._userId; // suppression id de l utilisateur généré automatiquement et envoyé par le frontend
    Sauce.findOne({_id: req.params.id}) //je recupere la sauce correspondant à l id
    .then(sauce => {
        //je vérifie si l utilisateur est le propriétaire de la sauce
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({message: 'Vous n\'êtes pas autorisé à modifier cette sauce !'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            // Si image modifiée => suppression ancienne image
            if (req.file) {
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                    .catch(error => res.status(401).json({error})); 
                });
            } else {
                //!suppression image => !suppression ancienne image: si l image n'est pas suprimée, je ne supprime pas l'ancienne image
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({error})); 
            }
        }
    })
    .catch(error => res.status(400).json({error})); //Si sauce n existe pas => je renvoie une erreur 400
};

//Récupération de toutes les sauces.
exports.getAllSauces = (req, res, next) => {
    Sauce.find() //On récupère toutes les sauces.
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

//Like ou dislike d'une sauce.
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    Sauce.findOne({_id: sauceId}) //On récupère la sauce correspondant à l'id.
    .then(sauce => {
        if (like === 1) { //Si l'utilisateur like la sauce.
            Sauce.updateOne({_id: sauceId}, {$inc: {likes: 1}, $push: {usersLiked: userId}, _id: sauceId})
            .then(() => res.status(200).json({message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({error}));
            console.log(`Sauce ${sauce.name} likée par ${req.auth.userId} !`);
        } else if (like === -1) { //Si l'utilisateur dislike la sauce.
            Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}, _id: sauceId})
            .then(() => res.status(200).json ({message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json ({error}));
            console.log(`Sauce ${sauce.name} dislikée par ${req.auth.userId} !`);
        } else if (like === 0) { //Si l'utilisateur annule son like.
            if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne({_id: sauceId}, {$inc: {likes: -1}, $pull: {usersLiked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Like retirée !'}))
                .catch(error => res.status(400).json({error}));
                console.log(`like retiré de la sauce ${sauce.name} par ${req.auth.userId} !`);
            } else if (sauce.usersDisliked.includes(userId)) { //Si l'utilisateur annule son dislike.
                Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Dislike retiré !'}))
                .catch(error => res.status(400).json({error}));
                console.log(`Dislike retiré de la sauce ${sauce.name} par ${req.auth.userId} !`);
            }
        }
    })
    .catch(error => res.status(404).json({error})); //Si la sauce n'existe pas, on renvoie une erreur 404.
};