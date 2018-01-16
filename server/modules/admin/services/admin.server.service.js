// dépendances NPM
const mongoose = require('mongoose');

// dépendances locales
const config = require('../../../lib/config/config');
const ApiError = require('../../../lib/helpers/apiError.helper');
let User = require('../../models/user.server.model');

// Déclarations variables
User = mongoose.model('User');

/**
 *
 *
 * @class AdminService
 */
class AdminService {

  /**
   * Service de récupération de la liste des utilisateurs
   * @static
   * @returns {object} users
   * @memberof AdminService
   */
  static async getListOfUsers() {
    return User.find().exec();

  }


}

// Export de la classe
module.exports = AdminService;
