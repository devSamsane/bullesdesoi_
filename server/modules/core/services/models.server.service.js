// dépendances nodeJS
const path = require('path');

// dépendances NPM
const validator = require('validator');
const owasp = require('owasp-password-strength-test');

// dépendances locales
const config = require('../../../lib/config/config');

/**
 * Définition de la classe de validation des entrées des models
 * @class ModelsValidationService
 */
class ModelService {

  static validateFirstname(user) {
    return (validator.isAlphanumeric(user.firstname, ['fr-Fr']));
  }

  static validateLastname(user) {
    return (validator.isAlphanumeric(user.lastname, ['fr-Fr']));
  }

  static validateEmail(user) {
    return (validator.isEmail(user.email, { require_tld: false }));
  }
}

// Export de la classe
module.exports = ModelService;
