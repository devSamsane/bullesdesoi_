// dépendances NPM
const bcrypt = require('bcrypt');

// dépendances locales
const CoreService = require('../../core/services/core.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');



class AuthService {

  // /**
  //  * Service de déserialisation du user en vue de le charger côté client
  //  * @static deserialize
  //  * @param {object} user
  //  * @returns {string}
  //  * @memberof AuthService
  //  */
  // static deserialize(user) {
  //   if (!user || typeof user !== 'object') {
  //     return null;
  //   }
  //   return {
  //     id: user.id,
  //     displayName: user.displayName,
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     email: user.email,
  //     provider: user.provider,
  //     created: user.created
  //   };
  // }

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
