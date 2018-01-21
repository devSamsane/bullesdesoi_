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
    const user = await AdminService.removeUser(req.model);
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

/**
 * Méthode de récupérations de la liste des users
 * @name getUsers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await AdminService.getListOfUsers();
    return res.status(200).json(users);
  } catch (error) {
    return next(new ApiError(error.message));
  }
};

/**
 * Méthode de récupération de la liste des seances pour un user
 * @name getSeances
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getSeances = async (req, res, next) => {
  try {
    const seances = await CoreService.getSeancesByUser(req.model._id);
    return res.status(200).json(seances);
  } catch (error) {
    return next(new ApiError(error.message));
  }
}

/**
 * Méthode de récupération par id d'une seance complétée des relaxations et sophronisations
 * @name getSeance
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getSeance = async (req, res, next) => {
  try {
    const seanceId = req.params.seanceId;
    const seance = await CoreService.getSeanceById(seanceId);
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
 * @param {*} id id du user
 */
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await CoreService.findUserById(userId);
    req.model = user;
    next();
  } catch (error) {
    return next(new ApiError(error.message));
  }
};
