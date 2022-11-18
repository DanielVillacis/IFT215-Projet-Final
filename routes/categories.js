const express = require('express');
const { validate, Joi } = require('express-validation');
const auth = require('./../middleware/auth');
const router = express.Router();
const gProduits = require('../util/gestionnaires').gProduits;

const adresseIdValidation = {
  params: Joi.object({
    idCat: Joi.number().integer().required()
  })
};

const nouvelleCategorieValidation = {
  body: Joi.object({
    nom: Joi.string().required(),
    description: Joi.string().required()
  })
};

const modifierCategorieValidation = {
  params: Joi.object({
    idCat: Joi.number().integer().required()
  }),
  body: Joi.object({
    nom: Joi.string(),
    description: Joi.string()
  })
};

const rechercherCategorieValidation = {
  query: Joi.object({
    nom: Joi.string(),
    description: Joi.string()
  })
};

const produitCatValidation = {
  params: Joi.object({
    idCat: Joi.number().integer().required(),
    idProduit: Joi.number().integer().required()
  })
};

/**
 * Ajoute une nouvelle catégorie. S'utilise avec une requête de type POST.
 * Il faut passer dans le corps de la requête une description complète sous forme de JSON.
 */
router.post('/', validate(nouvelleCategorieValidation), auth.admin, gProduits.ajouteCategorie.bind(gProduits));

/**
 * Retourne l'ensemble des catégories. On peut filtrer les résultats.
 * On peut chercher sur le nom,  et description
 * La requête pour filtrer sera de la forme /categories?&nom=blo&description=texte
 * Attention les espaces ne sont pas permis, il faut les remplacer par %20
 */
router.get('/', validate(rechercherCategorieValidation, {}, {}), gProduits.recupereCategorie.bind(gProduits));

/**
 * Retourne la categorie ayant l'id id
 */
router.get('/:idCat', validate(adresseIdValidation, {}, {}), gProduits.recupereCategorie.bind(gProduits));

/**
 * Modifie une categorie. Le id dans l'adresse est obligatoire. Les autres informations dans le body sont optionnelles.
 * Au moins une devrait toutefois être modifiée, sinon la requête est un peu inutile
 */
router.put('/:idCat', validate(modifierCategorieValidation, {}, {}), auth.admin, gProduits.modifierCategorie.bind(gProduits));

/**
 * Efface une categorie. Attention, c'est permanent!
 */
router.delete('/:idCat', validate(adresseIdValidation, {}, {}), auth.admin, gProduits.effaceCategorie.bind(gProduits));

/**
 * Récupère la liste des produits pour la catégorie :id
 */
router.get('/:idCat/produits', validate(adresseIdValidation, {}, {}), gProduits.recupereProduitsCategorie.bind(gProduits));

/**
 * Récupère les informations sur un produit d'une catégorie
 */
router.get('/:idCat/produits/:idProduit', validate(produitCatValidation, {}, {}), gProduits.recupereProduit.bind(gProduits));

module.exports = router;
