// dépendances NPM
const express = require('express');

// dépendances locales
const adminController = require('../controllers/admin.server.controller');

// Déclaration variables
const router = express.Router();

module.exports = router => {
  // TODO: Importer les routes utilisateurs en premier pour éviter un accès non autorisé
  router.route('/api/admin/users/').post(adminController.signup)
};
