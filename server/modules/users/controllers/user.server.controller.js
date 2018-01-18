// dépendances NPM
const mongoose = require('mongoose');
const validator = require('validator');

// dépendances locales
const CoreService = require('../../core/services/core.server.service');
// const AdminService = require('../services/admin.server.service');
const UserService = require('../services/user.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');

const User = mongoose.model('User');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 */
exports.getUserSeances = async (req, res, next, id) => {
  try {
    const seances = await UserService.findSeancesByUser(id);
    return seances;
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

/**
 * Méthode de récupération du user authentifié
 * Conserve un objet req.model avec les infos de l'utilisateur
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id id du user
 */
exports.getMe = async (req, res) => {
  let safeUserObject = null;
  if (req.user) {
    // Sanitize l'objet user
    safeUserObject = {
      email: validator.escape(req.user.email),
      firstname: validator.escape(req.user.firstname),
      lastname: validator.escape(req.user.lastname),
      displayName: validator.escape(req.user.displayName),
      phoneNumber: validator.escape(req.user.phoneNumber),
      provider: validator.escape(req.user.provider),
      roles: req.user.roles,
      created: req.user.created.toString()
    }
  }
  res.json(safeUserObject || null);
};

/**
 * Middeware user
 * Conserve un objet req.model avec les infos de l'utilisateur
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id id du user
 */
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await CoreService.findUserById(userId);
    console.log('user: ' + user);
    req.user = user;
  } catch (error) {
    return next(new ApiError(error.message));
  }
};
