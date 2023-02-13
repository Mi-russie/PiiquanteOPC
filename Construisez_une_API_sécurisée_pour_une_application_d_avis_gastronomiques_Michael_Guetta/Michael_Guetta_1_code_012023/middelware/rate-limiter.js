const limiter = require('express-rate-limit');

// Bloque les requêtes après 10 essais pendant 1 minute.
const maxreq = limiter({
    windowMs: 1 * 60 * 1000, 
    max: 10,
    message: "Trop de requêtes envoyées depuis cette adresse IP, veuillez réessayer dans une minute."
});

module.exports = maxreq;