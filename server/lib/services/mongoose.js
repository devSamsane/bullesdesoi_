// dépendances nodeJS
const path = require('path');

// dépendances NPM
const chalk = require('chalk');
const mongoose = require('mongoose');

// dépendances locales
const config = require('../config/config');

/**
 * Connexion au serveur MongoDB
 * Nécessaire de le démarrer au préalable
 * @name connect
 * @returns {Promise} mongoose | error
 */
module.exports.connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = config.db.promise;
    const mongoOptions = { ...config.db.options };
    mongoose.connect(config.db.uri, mongoOptions)
      .then(() => {
        // Activation du mode debug si nécessaire
        mongoose.set('debug', config.db.debug);
        resolve(mongoose);
      })
      .catch(error => {
        console.error(chalk.red('+ Erreur: Impossible de se connecter à MongoDB'));
        console.error(error);

        reject(error);
      });
  });
};

/**
 * Déconnexion du serveur MongoDB
 * Nécessaire de le démarrer au préalable
 * @name disconnect
 * @returns {Promise} resolve() | error
 */
module.exports.disconnect = () => {
  return new Promise((resolve, reject) => {
    mongoose.disconnect(error => {
      console.info(chalk.yellow('Déconnexion du serveur MongoDB'));
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
};
