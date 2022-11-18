const express = require('express');
const { validate, Joi } = require('express-validation');
const gProduits = require('./../util/gestionnaires').gProduits;
const auth = require('./../middleware/auth');
const router = express.Router();

const adresseIdValidation = {
  params: Joi.object({
    idProduit: Joi.number().integer().required()
  })
};

const nouveauProduitValidation = {
  body: Joi.object({
    serial: Joi.string().required(),
    nom: Joi.string().required(),
    description: Joi.string().required(),
    prix: Joi.number().required(),
    qte_inventaire: Joi.number().integer().positive().required(),
    categorie: Joi.object({
      id: Joi.number().integer().required()
    }).required()
  })
};

const modifierProduitValidation = {
  params: Joi.object({
    idProduit: Joi.number().integer().required()
  }),
  body: Joi.object({
    serial: Joi.string(),
    nom: Joi.string(),
    description: Joi.string(),
    prix: Joi.number(),
    qte_inventaire: Joi.number().integer().positive(),
    categorie: Joi.object({
      id: Joi.number().integer().required()
    })
  })
};

const rechercherProduitValidation = {
  query: Joi.object({
    serial: Joi.string(),
    nom: Joi.string(),
    description: Joi.string(),
    prix: Joi.number()
  })
};

/**
 * Ajoute un nouveau produit. S'utilise avec une requête de type POST.
 * Il faut passer dans le corps de la requête une description complète sous forme de JSON.
 */
router.post('/', validate(nouveauProduitValidation), auth.admin, gProduits.ajouteProduit.bind(gProduits));

/**
 * Retourne l'ensemble des produits. On peut filtrer les résultats.
 * On peut chercher sur le serial, nom, description, prix, qte_inventaire et categorie.id
 * La requête pour filtrer sera de la forme /produits?nom=blo
 * Attention les espaces ne sont pas permis, il faut les remplacer par %20
 */
router.get('/', validate(rechercherProduitValidation, {}, {}), gProduits.recupereProduit.bind(gProduits));

/**
 * Retourne le produit avec l'id
 */
router.get('/:idProduit', validate(adresseIdValidation, {}, {}), gProduits.recupereProduit.bind(gProduits));

/**
 * Modifie un produit. Le id dans l'adresse est obligatoire. Les autres informations dans le body sont optionnelles.
 * Au moins une devrait toutefois être modifiée, sinon la requête est un peu inutile
 */
router.put('/:idProduit', validate(modifierProduitValidation, {}, {}), auth.admin, gProduits.modifierProduit.bind(gProduits));

/**
 * Efface un produit. Attention, c'est permanent!
 */
router.delete('/:idProduit', validate(adresseIdValidation, {}, {}), auth.admin, gProduits.effaceProduit.bind(gProduits));

module.exports = router;
