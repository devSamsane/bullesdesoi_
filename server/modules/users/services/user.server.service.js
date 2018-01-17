// dépendances NPM
const mongoose = require('mongoose');

// dépendances locales
const config = require('../../../lib/config/config');
const ApiError = require('../../../lib/helpers/apiError.helper');
let User = require('../../models/user.server.model');
let Seance = require('../../models/seance.server.model');

// Déclarations variables
User = mongoose.model('User');
Seance = mongoose.model('Seance');

/**
 *
 *
 * @class AdminService
 */
class UserService {

  /**
   * Service de récupération de la liste des utilisateurs
   * @static getListOfUsers
   * @param {object} id id du user
   * @return {object} user
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


  /**
   * Service de récupération des séances pour un user
   * @static findSeancesByUser
   * @param {object} id id du user
   * @memberof UserService
   */
  static async findSeancesByUser(id) {
    return new Promise((resolve, reject) => {
      Seance.find({ user: id }, (error, seances) => {
        if (error) {
          reject(error);
        }
        resolve(seances);
      }).exec();
    });
  };



}

// Export de la classe
module.exports = UserService;
