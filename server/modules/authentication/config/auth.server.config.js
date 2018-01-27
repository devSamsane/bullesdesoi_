// dépendances nodeJS
const path = require('path')

// dépendances NPM
const passport = require('passport');

// dépendances locales
const config = require('../../../lib/config/config');
const AuthService = require('../services/auth.server.service');

module.exports = app => {
  config.utils.getGlobbedPaths('../strategies/*.js').forEach(strategy => {
    require(path.resolve(strategy))(config);
  });

  app.use(passport.initialize());
}
