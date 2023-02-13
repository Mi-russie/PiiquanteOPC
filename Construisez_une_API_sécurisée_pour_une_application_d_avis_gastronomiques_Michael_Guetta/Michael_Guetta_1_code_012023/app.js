const express = require('express');//ok
const bodyparser = require('body-parser');
const mongoose = require('mongoose');//ok
const userRoutes = require('./routes/user');//ok
const sauceRoutes = require('./routes/sauces');//ok
const path = require('path');//ok
//const sauces = require('./models/sauces')
mongoose.connect('mongodb+srv://Login:<MOT DE PASSE>@cluster0.vht07xj.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Parser les objet json ou bodyparser/interception de toutes les requetes
app.use(express.json()); //parasage des objets JSON
const app = express();//ok

//je parametre les cors OK
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Autorisation pour connection a l'API depuis toute origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// permet acces API avec entetes indiques
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  //CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles. Dans notre cas, nous avons deux origines : localhost:3000 et localhost:4200 , et nous souhaiterions qu'elles puissent communiquer entre elles. Pour cela, nous devons ajouter des headers à notre objet  response .
//Parser les objet json.OK
app.use(express.json());//OK



app.use(bodyParser.json, {});

app.use('api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app; //j exporte mon application app.js