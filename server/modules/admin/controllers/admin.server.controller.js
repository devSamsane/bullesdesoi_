// dépendances NPM

// dépendances locales
const CoreService = require('../../core/services/core.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');


/**
 * Initialisation et export de la méthode signup
 * Création d'un user via le backoffice d'administration
 * TODO: Ajouter le filtre qui vérifie que l'admin est authentifié et que role = admin
 * @name signup
 * @param {object} user
 */
exports.signup = async (req, res, next) => {
  try {
    const user = await CoreService.createUser(req.body);
    return res.json(user);
  } catch (error) {
    return next(new ApiError(error.message));
  }
};
