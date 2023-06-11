const express = require('express');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    next();
});

/* Mongoose region */

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://x7log:rush7@cluster0.9pdxj.mongodb.net/stuff_db?retryWrites=true&w=majority',
{  useNewUrlParser: true,
   useUnifiedTopology: true })
.then(() => console.log('Connexeion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

/* End Mongoose region */

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

const roleRoutes = require('./routes/roleRoute');
app.use('/api/role', roleRoutes);

const utilisateurRoutes = require('./routes/utilisateurRoute');
app.use('/api/utilisateur', utilisateurRoutes);

const productRoutes = require('./routes/produitRoute');
app.use('/api/produit', productRoutes);

module.exports = app;