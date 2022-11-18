const express = require('express');

const commerces = require('../data/repo/commerces.json');

const router = express.Router();

/**
 * Récupère l'ensemble des commerces
 */
router.get('/', function(req, res) {
  res.send(commerces);
});

/**
 * Récupère le commerce local ayant l'id :id. S'utilise comme /commerces/local/3
 */
router.get('/local/:id', function(req, res) {
  res.send(commerces.commerces_locaux[req.params.id]);
});

/**
 * Récupère le commerce international ayant l'id :id. S'utilise comme /commerces/international/3
 */
router.get('/international/:id', function(req, res) {
  res.send(commerces.commerces_internationaux[req.params.id]);
});

module.exports = router;
