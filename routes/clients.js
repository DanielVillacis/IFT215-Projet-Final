const express = require('express');
const gClients = require('./../util/gestionnaires').gClients;
const { validate, Joi } = require('express-validation');
const auth = require('./../middleware/auth');

const router = express.Router();

const adresseIdValidation = {
  params: Joi.object({
    idClient: Joi.number().integer().required()
  })
};

const panierItemIdValidation = {
  params: Joi.object({
    idClient: Joi.number().integer().required(),
    idItem: Joi.number().integer().required()
  })
};

const nouveauClientValidation = {
  body: Joi.object({
    prenom: Joi.string().required(),
    nom: Joi.string().required(),
    age: Joi.number().integer().positive().required(),
    adresse: Joi.string().required(),
    pays: Joi.string().required(),
    courriel: Joi.string().email().required(),
    mdp: Joi.string().required()
  })
};

const modifierClientValidation = {
  params: Joi.object({
    idClient: Joi.number().integer().required()
  }),
  body: Joi.object({
    prenom: Joi.string(),
    nom: Joi.string(),
    age: Joi.number().integer().positive(),
    adresse: Joi.string(),
    pays: Joi.string()
  })
};

const rechercherClientValidation = {
  query: Joi.object({
    prenom: Joi.string(),
    nom: Joi.string(),
    age: Joi.number().integer().positive(),
    pays: Joi.string(),
    adresse: Joi.string()
  })
};

const nouveauItemPanierValidation = {
  params: Joi.object({
    idClient: Joi.number().integer().required()
  }),
  body: Joi.object({
    idProduit: Joi.number().integer().required(),
    quantite: Joi.number().integer().positive().required()
  })
};

const modifierPanierValidation = {
  params: Joi.object({
    idClient: Joi.number().integer().required(),
    idItem: Joi.number().integer().required()
  }),
  body: Joi.object({
    quantite: Joi.number().integer().required()
  })
};

/**
 * Ajoute un nouveau client. S'utilise avec une requête de type POST.
 * Il faut passer dans le corps de la requête une description complète sous forme de JSON.
 */
router.post('/', validate(nouveauClientValidation), gClients.ajouteClient.bind(gClients));

/**
 * Retourne l'ensemble des clients. On peut filtrer les résultats.
 * On peut chercher sur le prenom, nom, age, adresse et pays
 * La requête pour filtrer sera de la forme /clients?prenom=bla&nom=blo&age=2&pays=Canada&adresse=adre
 * Attention les espaces ne sont pas permis, il faut les remplacer par %20
 */
router.get('/', validate(rechercherClientValidation, {}, {}), auth.admin, gClients.recupereClient.bind(gClients));

/**
 * Retourne le client ayant l'id :idClient
 */
router.get('/:idClient', validate(adresseIdValidation, {}, {}), auth.localParam, gClients.recupereClient.bind(gClients));

/**
 * Modifie un client. Le id dans l'adresse est obligatoire. Les autres informations dans le body sont optionnelles.
 * Au moins une devrait toutefois être modifiée, sinon la requête est un peu inutile
 */
router.put('/:idClient', validate(modifierClientValidation, {}, {}), auth.localParam, gClients.modifierClient.bind(gClients));

/**
 * Efface un client. Attention, c'est permanent!
 */
router.delete('/:idClient', validate(adresseIdValidation, {}, {}), auth.localParam, gClients.effaceClient.bind(gClients));

/**
 * Récupère le panier d'un client.
 */
router.get('/:idClient/panier', validate(adresseIdValidation, {}, {}), auth.localParam, gClients.recuperePanier.bind(gClients));

/**
 * Récupère l'item :idItem du panier du client :idClient.
 */
router.get('/:idClient/panier/:idItem', validate(panierItemIdValidation, {}, {}), auth.localParam, gClients.recuperePanier.bind(gClients));

/**
 * Ajoute un item au panier d'un client.
 */
router.post('/:idClient/panier', validate(nouveauItemPanierValidation, {}, {}), auth.localParam, gClients.ajoutePanier.bind(gClients));

/**
 * Modifie un item dans un panier. On peut seulement modifier la quantité. Une quantité positive augmente,
 * une quantité négative diminue. (ancienneQté + modification)
 */
router.put('/:idClient/panier/:idItem', validate(modifierPanierValidation, {}, {}), auth.localParam, gClients.modifiePanier.bind(gClients));

/**
 * Retire un item d'un panier.
 */
router.delete('/:idClient/panier/:idItem', validate(panierItemIdValidation, {}, {}), auth.localParam, gClients.retirerPanier.bind(gClients));

module.exports = router;
