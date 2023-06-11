const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleSchema = mongoose.Schema({
    Libelle: { type: String, require:true, unique: true},    
    isShow: { type: Number, require: true }
});

roleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Role', roleSchema);