// dépendances NPM
const express = require('express');
const passport = require('passport');

// dépendances locales
const authController = require('../controllers/auth.server.controller');

// déclaration du router
const router = express.Router();

module.exports = router => {
  router.route('/api/auth/signin').post(passport.authenticate('local'), authController.signin);
}
