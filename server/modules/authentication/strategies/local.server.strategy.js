// dépendances NPM
// const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// dépendances locales
// let User = require('../modules/models/user.server.model');
const AuthService = require('../services/auth.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');

// Déclaration variables
// User = mongoose.model('User');

module.exports = config => {
  passport.use(new LocalStrategy({
    // Mapping des champs du user avec le model passport
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await AuthService.authenticate(email, password)
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'email et/ou mot de passe invalides'
        });
      }
    } catch (error) {
      return done(error);
    }
  }));
};
