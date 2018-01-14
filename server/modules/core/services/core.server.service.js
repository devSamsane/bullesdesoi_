// dépendances nodeJS
const path = require('path');

// dépendances NPM
const bcrypt = require('bcrypt');
const owasp = require('owasp-password-strength-test');

// dépendances locales
const config = require('../../../lib/config/config');

// Déclarations variables
const SALT_ROUNDS = 10;
owasp.config(config.shared.owasp);

/**
 * Définition de la class CoreService
 * Contient tous les services transverses aux collections
 * @class CoreService
 */
class CoreService {

  /**
   * Service de hashage du password
   * @static hashPassword
   * @param {string} password
   * @returns {string} hash du password
   * @memberof CoreService
   */
  static async hashPassword(password) {
    return bcrypt.hash(String(password), SALT_ROUNDS);
  }

  /**
   * Service de vérification du password selon les critères owasp
   * @static checkOwaspPassword
   * @param {string} password
   * @returns {object} resultat owasp test
   * @memberof CoreService
   */
  static async checkOwaspPassword(password) {
    return owasp.test(password);
  }
}

// Export de la class CoreServices
module.exports = CoreService;
