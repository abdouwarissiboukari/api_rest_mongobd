const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const utilisateur = require('./utilisateur');

const produitScheama = mongoose.Schema({
    Code: { type: String, require: true, unique: true },
    Designation: { type: String, require: true },
    Famille: { type: String, require: true},
    Forme:  { type: String, require: true},
    Emballage:  { type: Number, require: true, default: 0 },
    Quantite:  { type: Number, require: true, default: 0 },
    Prix: { type: Number, require: true, default: 0 },
    Cout: { type: Number, require: true, default: 0 },
    Seuil: { type: Number, require: true, default: 0 },
    QuantiteSortie: { type: Number, require: true, default: 0 },
    UpdateDate: { type: Date, require: true, default: Date.now },
    IsActif: { type: Boolean, require: true, default: true },
    isDeleted: { type: Number, require: true, default: 0},
    imageUrl: { type: String, require: true, default : 'images/default.png' },
    CodeAgence: { type: String, require: true, default: 'DM'},
    Utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur'}
});

produitScheama.plugin(uniqueValidator);

module.exports = mongoose.model('produit', produitScheama);