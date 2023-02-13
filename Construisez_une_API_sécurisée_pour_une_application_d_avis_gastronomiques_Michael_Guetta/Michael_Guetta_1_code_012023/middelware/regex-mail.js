module.exports = (req, res, next) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
    if (regex.test(req.body.email)) {
        next();
    } else {
        res.status(400).json({error: 'Adresse mail invalide !'});
    }
};