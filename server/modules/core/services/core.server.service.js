// dépendances nodeJS
const path = require('path');

// dépendances NPM
const bcrypt = require('bcrypt');
const owasp = require('owasp-password-strength-test');
const mongoose = require('mongoose');

// dépendances locales
const config = require('../../../lib/config/config');
let User = require('../../models/user.server.model');
let Seance = require('../../models/seance.server.model');
let Relaxation = require('../../models/relaxation.server.model');
let Sophronisation = require('../../models/sophronisation.server.model');

// Déclarations variables
const SALT_ROUNDS = 10;
owasp.config(config.shared.owasp);
User = mongoose.model('User');
Seance = mongoose.model('Seance');
Relaxation = mongoose.model('Relaxation');
Sophronisation = mongoose.model('Sophronisation');

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
    return new Promise((resolve, reject) => {
      const result = owasp.test(password);
      if (result.errors.length) {
        reject(new Error('Le mot de passe ne respecte pas les règles OWASP !'));
      }
      resolve(result);
    });
  }

  /**
   * Service de sauvegarde des users
   * @static saveUser
   * @param {object} user objet représentant un user
   * @memberof CoreService
   */
  static saveUser(user) {
    const newUser = new User(user);

    // Sauvegarde du user
    return newUser.save();
  }

  /**
   * Service de création du user
   * @static createUser
   * @param {object} user objet représentant un user
   * @memberof CoreService
   */
  static async createUser(user) {

    // Configuration du provider
    user.provider = 'local';

    // Suppression du rôle du user
    // Utilisation de la fonction default de mongoose, les rôles admin seront configurés
    // directement en base
    delete user.roles;

    // Vérification du mot de passe
    await this.checkOwaspPassword(user.password);

    // hash du mot de passe
    user.password = await this.hashPassword(user.password);

    // Appel du service de sauvegarde du user
    await this.saveUser(user);

    // Suppression des paramètres sensibles du user
    user.password = undefined;

    // Renvoi de l'objet user
    return Promise.resolve(user);
  }

  /**
   * Service de recherche d'un user par son id
   * @static findUserById
   * @param {string} userId
   * @returns {object} user
   * @memberof CoreService
   */
  static async findUserById(userId) {
    return new Promise((resolve, reject) => {
      User.findById(userId, '-password -providerData').exec((error, user) => {
        return error ? reject(error) : resolve(user);
      });
    });
  };

  /**
   * Service de recherche des seances pour un user
   * @static getSeances
   * @param {string} userId
   * @returns {object} seances
   * @memberof CoreService
   */
  static async getSeancesByUser(userId) {
    return new Promise((resolve, reject) => {
      Seance.find({ user: userId }).exec((error, seances) => {
        return error ? reject(error) : resolve(seances);
      });
    });
  }


  /**
   * Service de récupération de tous les éléments d'une seance par id de seance
   * @static getSeanceById
   * @param {string} seanceId
   * @returns {object} seance
   * @memberof CoreService
   */
  static async getSeanceById(seanceId) {
    return new Promise((resolve, reject) => {
      Seance.findOne({ _id: seanceId }).populate('sophronisations').populate('relaxations').exec((error, seance) => {
        return error ? reject(error) : resolve(seance);
      });
    });
  }

  /**
   * Service de récupération des relaxations par seanceId
   * @static getRelaxationBySeance
   * @param {string} seanceId
   * @returns {object} relaxations
   * @memberof CoreService
   */
  static async getRelaxationBySeance(seanceId) {
    return new Promise((resolve, reject) => {
      Relaxation.find({ seance: seanceId }).exec((error, relaxations) => {
        return error ? reject(error) : resolve(relaxations);
      });
    });
  }

  /**
   * Service de récupération des sophronisations par seanceId
   * @static getSophronisationBySeance
   * @param {string} seanceId
   * @returns {object} Sophronisations
   * @memberof CoreService
   */
  static async getSophronisationBySeance(seanceId) {
    return new Promise((resolve, reject) => {
      Sophronisation.find({ seance: seanceId }).exec((error, sophronisations) => {
        return error ? reject(error) : resolve(sophronisations);
      });
    });
  }
}

// Export de la class CoreServices
module.exports = CoreService;
