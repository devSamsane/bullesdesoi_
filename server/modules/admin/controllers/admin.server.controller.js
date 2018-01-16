// dépendances NPM
const mongoose = require('mongoose');

// dépendances locales
const CoreService = require('../../core/services/core.server.service');
const AdminService = require('../services/admin.server.service');
const ApiError = require('../../../lib/helpers/apiError.helper');

const User = mongoose.model('User');

/**
 * Initialisation et export de la méthode signup
 * Création d'un user via le backoffice d'administration
 * TODO: Ajouter le filtre qui vérifie que l'admin est authentifié et que role = admin
 * @name signup
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signup = async (req, res, next) => {
  try {
    const user = await CoreService.createUser(req.body);
    return res.json(user);
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

/**
 * Méthode de suppression d'un utilisateur
 * @name removeUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.removeUser = async (req, res, next) => {
  try {
    const user = await CoreService.deleteUser(req.model);
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
exports.userById = async (req, res, next, id) => {
  try {
    const user = await CoreService.findUserById(id);
    req.model = user;
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

exports.getUsers = (req, res, next) => {
  User.find().exec((error, users) => {
    if (error) {
      return next(new ApiError(error.message));
    }
    return res.json(users);
  });
};



