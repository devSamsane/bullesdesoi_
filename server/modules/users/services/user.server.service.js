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
class UserService {

  /**
   * Service de récupération de la liste des utilisateurs
   * @static getListOfUsers
   * @returns {object} users
   * @memberof UserService
   */
  static async getMe(id) {
    return new Promise((resolve, reject) => {
      User.findOne({ id }, '-password -providerData', (error, user) => {
        if (error) {
          reject(error);
        }
        resolve(user);
      }).exec();
    });
  };


}

// Export de la classe
module.exports = UserService;
