// dépendances NPM
const express = require('express');

// déclaration du router
const router = express.Router();
const coreController = require('../controllers/core.server.controller');

/**
 * Initialisation du router express
 * @name router
 */
module.exports = router => {
  router.get('/', coreController.coreTemplate);
};
