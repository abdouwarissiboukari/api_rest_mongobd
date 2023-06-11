const Role = require('../models/role');
const Utilisateur = require('../models/utilisateur');

exports.createRole = (req, res, next) => {
    const role = new Role({
        ...req.body
    });
    role.save()
    .then((role) => { 
        res.status(201).json({ role }); 
    })
    .catch(error => {
        res.status(400).json({ error });
    });
};

exports.getOneRole = (req, res, next) => {
    Role.findById({
        _id: req.params.id
    }).then((role) => {
        res.status(200).json({ role });
    }).catch((error) => {
        res.status(404).json({ error });
    });
};

exports.getOneRoleByLibelle = (req, res, next) => {
    Role.findOne({ libelle: req.params.libelle })
        .then((role) => {
            res.status(200).json({ role });
        }).catch((error) => {
            res.status(404).json({ error });
    });
};

exports.updateRole = (req, res, next) => {
    Role.updateOne(
        { _id: req.params.id},
        { ...req.body, _id: req.params.id}
    )
    .then(() => {      
        Role.findById( { _id: req.params.id })
            .then(role => 
                { res.status(200).json({ role }); 
            })
            .catch(error => 
            { res.status(404).json({ error }); 
        });        
    })
    .catch((error) => {
        res.status(401).json({ error });
    });
};

exports.updateRoleByLibelle = (req, res, next) => {
    Role.find().select()
        .where({ "Libelle": req.params.libelle})
        .then(role => {
            Role.updateOne(
                { _id: role._id, _id: role[0]._id },
                { ...req.body}
            )
            .then(() => {   
                Role.findById( { _id: role[0]._id })
                    .then(role => 
                        { res.status(200).json({ role }); 
                    })
                    .catch(error => 
                    { res.status(401).json({ error }); 
                });
            })
            .catch(error => {
                res.status(402).json({ error });
            });
        })  
        .catch(error => {
            res.status(403).json({ error });
        });  
};

exports.deleteRole = (req, res, next) => {
    Utilisateur.findOne({ Role: req.params.id })
        .then((utilisateur) => {
            if (utilisateur) {
                res.status(200).json({ message: 'Suppression impossible - Error 1 !'})
            }
            Role.findById({ _id: req.params.id })
            .then(role => {
                if (role != null) {
                    Role.deleteOne({ _id: req.params.id})
                        .then(() => { res.status(200).json({ message: 'suppression réussie!' }); })
                        .catch((error) => { res.status(401).json({ error }); });
                }
                else{
                    res.status(401).json({ message: 'Non retrouvé!'})
                }
            })
            .catch(error => {
                res.status(401).json(error);
            });    
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.getAllRoles = (req, res, next) => {
    Role.find()
        .then((roles) => {
            res.status(200).json({ roles });
        })
        .catch((error) => {
            res.status(400).json({ error});
        });
};

exports.getAllRolesByLibelle = (req, res, next) => {
    Role.find({ "Libelle": { $regex: '.*' + req.params.libelle + '.*' } })
        .then((roles) => {
            res.status(200).json({ roles });
        })
        .catch((error) => {
            res.status(400).json({ error});
        });
};