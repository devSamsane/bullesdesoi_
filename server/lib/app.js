// dépendances NPM
const chalk = require('chalk');

// dépendances locales
const config = require('./config/config');
const express = require('./services/express');

/**
 * Initialisation de l'application expressJS
 * @name startExpress
 */
function startExpress() {
  return new Promise(async (resolve, reject) => {
    let app;

    try {
      app = express.init();
    } catch (error) {
      return reject(error);
    }

    return resolve(app);
  });
}

/**
 * Bootstrap de l'application expressJS
 * @name bootstrap
 * @returns {object} app instance de l'application expressJS
 */
function bootstrap () {
  return new Promise(async (resolve, reject) => {
    let app;

    try {
      app = await startExpress();
    } catch (error) {
      return reject(new Error('+ Erreur: impossible d\'intialiser l\'instance expressJS'));
    }

    return resolve({
      app: app
    });
  });
};

// Exposition de la fonction bootstrap
exports.bootstrap = bootstrap;

/**
 * Démarrage de l'application
 * @name start
 */
exports.start = function start () {
  return new Promise(async (resolve, reject) => {
    let app;

    try {
      ({ app } = await bootstrap());
    } catch (error) {
      return reject(error);
    }

    // Création de l'instance du serveur web sur le port et host configurés
    app.listen(config.port, config.host, () => {
      const server = `http://${config.host}:${config.port}`;

      console.info(chalk.white('---'));
      console.info(chalk.green(config.app.title));
      console.info();
      console.info(chalk.green(`Environnement:    ${process.env.NODE_ENV}`));
      console.info(chalk.green(`Serveur:          ${server}`));
      console.info(chalk.bgMagenta(`App version:  ${config.bullesdesoi.version}`));
      console.info(chalk.white('---'));
    });

    return resolve({
      app: app
    });
  });
};