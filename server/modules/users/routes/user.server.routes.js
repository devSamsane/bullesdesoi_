// dépendances NPM
const express = require('express');

// dépendances locales
const userController = require('../controllers/user.server.controller');

// Déclaration variables
const router = express.Router();

module.exports = router => {
  router.route('/api/user/:userId').get(userController.getMe);


  router.param('userId', userController.getUser);

};
