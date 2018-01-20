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
   * @static getListOfUsers
   * @returns {object} users
   * @memberof AdminService
   */
  static async getListOfUsers() {
    return new Promise((resolve, reject) => {
      User.find({}, '-password -providerData', (error, users) => {
        return error ? reject(error) : resolve(users);
      }).exec();
    });
  };


}

// Export de la classe
module.exports = AdminService;
