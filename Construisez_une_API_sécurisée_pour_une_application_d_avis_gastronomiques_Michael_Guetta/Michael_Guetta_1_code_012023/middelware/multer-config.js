const multer = require('multer');// importation de multer

//Dico des mime-types selon les types d images du fichier
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//creation d un objet de configuration de multer
//diskstorage est la fonction qui enregistre sur le disque
//2 parametres a passer, destinations avec 3 arguments
const storage = multer.diskStorage({ 
    //On définit la constante storage comme étant un objet contenant deux fonctions: destination et filename
        destination: (req, file, callback) => {
        callback(null, 'images') //j indique à multer d'enregistrer les fichiers dans le dossier images
    },
        filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //nom d origine du fichier + remplacer les espaces par underscores avec methode split
        const extension = MIME_TYPES[file.mimetype]; //je récupère l'extension du fichier. on acces au mime-type du fichier
        callback(null, name + Date.now() + '.' + extension);
        //const filename = name + Date.now() + '.' + extension; //je génère le nom du fichier
        //callback(null, filename); // j envoie le nom du fichier
    }
});

//Exportation du multer completement configuré.
module.exports = multer({storage: storage}).single('image');