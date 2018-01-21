// dépendances NPM
const express = require('express');

// dépendances locales
const userController = require('../controllers/user.server.controller');

// Déclaration variables
const router = express.Router();

module.exports = router => {
  router.route('/api/user/:userId').get(userController.getMe);
  router.route('/api/user/:userId/seances').get(userController.getUserSeances);
  router.route('/api/user/:userId/seance/:seanceId').get(userController.getUserSeance);

  // Binding avec le middleware
  router.param('userId', userController.getUserById);

};
