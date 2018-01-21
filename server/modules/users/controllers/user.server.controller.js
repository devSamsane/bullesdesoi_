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
 * Méthode de récupération du user authentifié
 * Conserve un objet req.model avec les infos de l'utilisateur
 * @param {*} req
 * @param {*} res
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

/**
 * Méthode de récupération des seances pour le user authentifié
 * @name getUserSeances
 * @param req
 * @param res
 * @param next
 */
exports.getUserSeances = async (req, res, next) => {
  try {
    const seances = await CoreService.getSeancesByUser(req.profile._id)
    return res.status(200).json(seances);
  } catch (error) {
    return next(new ApiError(error.message));
  }
}

exports.getUserSeance = async (req, res, next) => {
  try {
    const seanceId = req.params.seanceId;
    const seance = await CoreService.getSeanceById(seanceId)
    return res.status(200).json(seance);
  } catch (error) {
    return next(new ApiError(error.message));
  }
}

/**
 * Middeware user
 * Conserve un objet req.model avec les infos de l'utilisateur
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} userId id du user
 */
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await CoreService.findUserById(userId);
    req.profile = user;
    next();
  } catch (error) {
    return next(new ApiError(error.message));
  }
};
