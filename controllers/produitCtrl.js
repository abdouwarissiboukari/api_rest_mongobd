
const Produit = require('../models/produit');
const fs = require('fs');


exports.createProduit = (req, res, next) => {
    const produitObject = req.file ? { ...JSON.parse(req.body.produit),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...JSON.parse(req.body.produit), 
        imageUrl: `${req.protocol}://${req.get('host')}/images/default.png`};

    //delete produitObject.Utilisateur;
    const produit= new Produit({
        ...produitObject,
        Utilisateur: req.auth.userId
    });

    produit.save()
        .then((produit) => {
            res.status(200).json({ produit})
        }).catch((error) => {
            res.status(404).json({ error})
        });
};

exports.updateProduit = (req, res, next) => {
    const produitObject = req.file ? { ...JSON.parse(req.body.produit),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...JSON.parse(req.body.produit)};

    Produit.findOne({ Code: req.params.code })
        .where({ isDeleted: 0 })
        .then((produit) => {
            if (produit.Utilisateur != req.auth.userId) {
                res.status(401).json({ message: 'You are not authorized to access this product'})
            }
            else {                               
                const actualImageFile = produit.imageUrl.split('/images/')[1];

                Produit.updateOne({ Code: req.params.code }, { ...produitObject })
                    .then(() => {
                        if (req.file) {    
                            if ( actualImageFile != 'default.png'){
                                fs.unlink(`images/${actualImageFile}`, () => {})
                            }
                        } 

                        res.status(200).json({ message: 'Product updated successfully' })
                    }).catch((error) => {
                        res.status(500).json({ error })
                    });               
            }            
        }).catch((error) => {   
            res.status(401).json({ error })
        });
};

exports.getOneProduit = (req, res, next) => {
    Produit.findOne({ Code: req.params.code })
        .where({ isDeleted: 0})
        .then((produit) => {
            res.status(200).json({ produit})
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.deleteProduit = (req, res, next) => {
    Produit.findOne({ Code: req.params.code })
        .then((produit) => {
            if(!produit) {
                res.status(404).json({ message: 'Product code invalide!'});
            }else if(produit.Utilisateur != req.auth.userId) {
                res.status(404).json({ message: 'You are not authorized to delete this product!'})
            }else {
                const fileToDelete = produit.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileToDelete}`, () => {
                    Produit.deleteOne({ Code: req.params.code })
                        .then(() => {
                            res.status(200).json({ message: 'Produit deleted!'})
                        }).catch((error) => {
                            res.status(400).json({ error })
                        });
                })                
            }            
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.getAllProduit = (req, res, next) => {
    try {
        if (req.params.filter == null || req.params.filter === ' '){
            Produit.find({ IsDeleted: 0})
                .then((produits) => {
                    res.status(200).json(produits)
                }).catch((error) => {
                    res.status(400).json({ error })
                });
        }else {
            Produit.find({ Designation: { $regex: '.*' + req.params._filter + '.*' }, isDeleted: 0 })
                .then((produits) => {
                    res.status(200).json(produits)
                }).catch((error) => {
                    res.status(400).json({ error })
                });
        };
    }
    catch (error) {
        res.status(400).json({ message: error.message})
    };
    
};