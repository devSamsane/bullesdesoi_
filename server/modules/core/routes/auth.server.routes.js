// dépendances NPM
const express = require('express');

// dépendances locales
const userController = require('../../users/controllers/user.server.controller');
const coreController = require('../controllers/core.server.controller');

// déclaration du router
const router = express.Router();

module.exports = router => {
  router.route('/api/auth/signin').post(coreController.signin);
}
