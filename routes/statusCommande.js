const express = require('express');
const gVentes = require('./../util/gestionnaires').gVentes;
const router = express.Router();

/**
 * Retourne la liste de tous les status possibles pour une vente
 */
router.get('/', gVentes.recupererStatus.bind(gVentes));

module.exports = router;
