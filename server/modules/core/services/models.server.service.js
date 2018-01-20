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
 * @deprecated Maintien du service pour le moment
 * // TODO: Supprimer le service
 */
class ModelService {

  // static validateFirstname(user) {
  //   return new Promise((reject, resolve) => {
  //     user.firstname = user.firstname + '';
  //     validator.isAlphanumeric(user.firstname, ['fr-Fr'], (error, result) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       resolve(result);
  //     });
  //   });
  // };

  // static async validateLastname(lastname) {
  //   console.log(lastname);
  //   return validator.isAlphanumeric(lastname, ['fr-Fr']);
  // }

  // static validateEmail(user) {
  //   return new Promise((reject, resolve) => {
  //     const result = validator.isEmail(user.email + '', { require_tld: false });
  //     if (!result) {
  //       reject(result)
  //     }
  //     resolve(result);
  //   });
  // };

}

// Export de la classe
module.exports = ModelService;
