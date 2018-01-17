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
exports.getUser = async (req, res, next, id) => {
  try {
    const me = await CoreService.findUserById(id);
    req.profile = me;
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

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
 * Middeware user
 * Conserve un objet req.model avec les infos de l'utilisateur
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id id du user
 */
exports.getMe = async (req, res) => {
  let safeUserObject = null;
  if (req.profile) {
    // Sanitize l'objet user
    safeUserObject = {
      email: validator.escape(req.profile.email),
      firstname: validator.escape(req.profile.firstname),
      lastname: validator.escape(req.profile.lastname),
      displayName: validator.escape(req.profile.displayName),
      phoneNumber: validator.escape(req.profile.phoneNumber),
      provider: validator.escape(req.profile.provider),
      roles: req.profile.roles,
      created: req.profile.created.toString()
    }
  }
  res.json(safeUserObject || null);
};
