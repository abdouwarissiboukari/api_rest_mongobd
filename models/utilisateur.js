const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Role = require('../models/role');

const utilisateurSchema = mongoose.Schema({
    Login: { type: String, require: true, unique: true },
    PassWord: { type: String, require: true },
    Date: { type: Date, require: true, default: Date.now},    
    Statut: { type: Number, require: true, default: 1},
    Etat: { type: Number, require: true, default: 1},
    Staff: { type: String, require: true},
    isDeleted: { type: Number, require: true, default: 0},
    CodeAgence: { type: String, require: true},
    Level: { type: Number, require:true, default: 1},
    Role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role'}    
}) 

utilisateurSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateur', utilisateurSchema);