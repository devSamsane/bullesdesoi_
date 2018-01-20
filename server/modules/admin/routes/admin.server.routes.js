// dépendances NPM
const express = require('express');

// dépendances locales
const adminController = require('../controllers/admin.server.controller');

// Déclaration variables
const router = express.Router();

module.exports = router => {
  // Importer les routes utilisateurs en premier pour éviter un accès non autorisé
  require('../../users/routes/user.server.routes');

  router.route('/api/admin/users/').post(adminController.signup);
  router.route('/api/admin/users/').get(adminController.getUsers);
  router.route('/api/admin/users/:userId').delete(adminController.removeUser);

  // Placer à la fin binding middleware
  // user middleware
  router.param('userId', adminController.getUserById);
};
