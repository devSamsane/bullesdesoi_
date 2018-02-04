// dépendances NPM
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// dépendances locales
const CoreService = require('../../core/services/core.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');
const config = require('../../../lib/config/config');


class AuthService {

  /**
   * Service de vérification du mot de passe
   * @static comparePassword
   * @param {string} password
   * @param {string} storedPassword
   * @returns {boolean} true | false
   * @memberof AuthService
   */
  static async comparePassword(password, storedPassword) {
    return bcrypt.compare(String(password), String(storedPassword));
  }

  /**
   * Service de création du token jwt
   * @static generateJWT
   * @param {object} user
   * @param {object} options options de configuration du jwt
   * @memberof AuthService
   */
  static async generateJWT(user, options) {
    try {

      // Création du timestamp
      const timestamp = new Date().getTime();

      // Configuration du payload
      const payload = {
        sub: user.id.toString(),
        email: user.email.toString(),
        iat: timestamp
      };

      // Configuration des options du jwt
      const jwtOptions = _.merge(config.jwt.options, options);

      // Génération du token
      const token = jwt.sign(payload, config.jwt.secret, jwtOptions);

      return token;

    } catch (error) {
      return new ApiError('Erreur: token non généré', {
        status: '500',
        code: 'SERVER_ERROR'
      });
    }
  }

  /**
   * Service d'authentification du user
   * @static authenticate
   * @param {string} email
   * @param {string} password
   * @returns {object} user
   * @memberof AuthService
   */
  static async authenticate(email, password) {
    // Vérification de l'existence du user
    const user = await CoreService.findUserByEmail(email);
    if (!user) {
      throw new ApiError('Erreur: email et/ou mot de passe invalide', {
        status: '401',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    // Vérification du mot de passe
    const checkPassword = await this.comparePassword(password, user.password);
    if (!checkPassword) {
      throw new ApiError('Erreur: email et/ou mot de passe invalide', {
        status: '401',
        code: 'AUTHENTICATION_ERROR'
      });
    }

    // Renvoi du user
    // Suppression du hash du password de l'objet user
    user.password = undefined;
    return user;
  }

}

module.exports = AuthService;
