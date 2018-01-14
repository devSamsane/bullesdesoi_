// dépendances nodeJS
const path = require('path');

// dépendances NPM
const bcrypt = require('bcrypt');

// dépendances locales
const config = require('../../../lib/config/config');

// Déclarations variables
const SALT_ROUNDS = 10;

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
   * @memberof CoreServices
   */
  static async hashPassword(password) {
    return bcrypt.hash(String(password), SALT_ROUNDS);
  }


}

// Export de la class CoreServices
module.exports = CoreService;
