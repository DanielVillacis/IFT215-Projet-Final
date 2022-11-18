const express = require('express');
const { validate, Joi } = require('express-validation');
const gVentes = require('./../util/gestionnaires').gVentes;
const auth = require('./../middleware/auth');
const router = express.Router();

const adresseIdValidation = {
  params: Joi.object({
    idVente: Joi.number().integer().required()
  })
};

const statusVenteValidation = {
  params: Joi.object({
    idVente: Joi.number().integer().required()
  }),
  body: Joi.object({
    status: Joi.string().required()
  })
};

const ajoutVenteValidation = {
  body: Joi.object({
    idClient: Joi.number().integer().required()
  })
};

const effacerVenteValidation = {
  params: Joi.object({
    idVente: Joi.number().integer().required()
  }),
  body: Joi.object({
    idClient: Joi.number().integer().required()
  })
};

const rechercherVenteValidation = {
  query: Joi.object({
    client: Joi.number().integer().positive(),
    depuis: Joi.string(),
    status: Joi.string()
  })
};

/**
 * Retourne la liste de toutes les ventes.
 */
router.get('/', auth.admin, validate(rechercherVenteValidation), gVentes.recupererVente.bind(gVentes));

/**
 * Effectue une vente, c'est-à-dire transforme un panier en vente
 */
router.post('/', auth.localBody, validate(ajoutVenteValidation), gVentes.ajouterVente.bind(gVentes));

/**
 * Retourne les détails d'une vente :idVente
 */
router.get('/:idVente', auth.admin, validate(adresseIdValidation), gVentes.recupererVente.bind(gVentes));

/**
 * Modifie le status d'une vente
 */
router.put('/:idVente', auth.admin, validate(statusVenteValidation), gVentes.modifierStatus.bind(gVentes));

/**
 * Annule une vente, mais seulement si elle n'a pas été préparée
 */
router.delete('/:idVente', auth.localBody, validate(effacerVenteValidation), gVentes.annulerVente.bind(gVentes));

module.exports = router;
