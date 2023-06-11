const Utilisateur = require('../models/utilisateur');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateur = require('../models/utilisateur');

exports.signUp = (req, res, next) => {
    Role.findById({ _id: req.body.Role})
        .then((role) => {
            if (role != null) {
                bcrypt.hash(req.body.PassWord, 10)
                    .then(hash => {
                        const utilisateur = new Utilisateur({...req.body, PassWord: hash})
                        utilisateur.save()
                            .then(() => { res.status(201).json({ message: 'Utilisateur créé!' })})
                            .catch((error) => { res.status(400).json({ error })});
                    })
                    .catch((error) => { 
                        res.status(400).json({ error });
                    });
            }
            else {
                res.status(400).json({ message: 'Rôle invalide !' });
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        });    
};

exports.signIn = (req, res, next) => {
    Utilisateur.findOne({ login: req.params.login })
        .then((utilisateur) => {
            if (!utilisateur) {
                return res.status(401).json({ message: 'Login ou mot de passe incorrect !' });
            }            
            bcrypt.compare(req.body.PassWord, utilisateur.PassWord)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({ message: 'Login ou mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: utilisateur._id,
                        token: jwt.sign(
                            { userId: utilisateur._id },
                            'RANDOM_TOP_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
            
        })
};

exports.updateUtilisateur = (req, res, next) => {
    Utilisateur.updateOne(
        { _Id: req.params.id },
        { ...req.body, _Id: req.params.id }
    ).then((result) => {
        if(result.modifiedCount > 0){
            res.status(200).json({ message: 'Modification réussie ! ' })
        }
        else if (result.modifiedCount === 0 ){
            res.status(200).json({ message: 'Utilisateur dejà à jour ou incorrect ! ' })
        }
    }).catch((error) => {
        res.status(400).json({ error })
    });
};

exports.getOneUtilisateur = (req, res, next) => {
    Utilisateur.findById({ _id: req.params.id}).where({ isDeleted: 0})
        .populate('Role', 'Libelle')
        .then((utilisateur) => {
            res.status(200).json({ utilisateur })
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.deleteOneUtilisateur = (req, res, next) => {
    Utilisateur.updateOne(
        { _id: req.params.id },
        { isDeleted: 1}
    ).then((result) => {
        if(result.modifiedCount > 0){
            res.status(200).json({ message: 'suppression réussie ! ' })
        }
        else if (result.modifiedCount === 0 ){
            res.status(200).json({ message: 'utilisateur incorrect ! ' })
        }
    }).catch((error) => {
        res.status(400).json({ error })
    });
};

exports.getAllUtilisateur = (req, res, next) => {
    if (req.params._filter == null || req.params._filter.trim() === ''){
        Utilisateur.find({ isDeleted: 0 })
        .populate('Role')
        .then((utilisateur) => {
            res.status(200).json({ utilisateur })
        }).catch((error) => {
            res.status(402).json({ error })
        });
    }
    else {
        Utilisateur.find({ Login: { $regex: '.*' + req.params._filter + '.*' }, isDeleted: 0 })
        .populate('Role')
        .then((utilisateurs) => {
            res.status(200).json({ utilisateurs })
        }).catch((error) => {
            res.status(403).json({ error })
        });
    }    
};

exports.getAllUtilisateurByRole = (req, res, next) => {
    Utilisateur.find({ Role: req.params._role, isDeleted: 0 })
        .populate('Role')
        .then((utilisateurs) => {
            res.status(200).json({ utilisateurs })
        })
        .catch((error) => {
            res.status.json({ error })
        });
};

exports.getCurrentUser = (req, res, next) => {
    try {
        const userId = req.auth.userId;

        if (userId !== null ){            
            res.status(200).json({ userId });
        }
    }
    catch {
        res.status(400).json({ message: 'Erreur de connexion'});
    }
};