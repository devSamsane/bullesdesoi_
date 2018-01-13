// dépendances NPM
const chalk = require('chalk');

// dépendances locales
const config = require('./config/config');
const express = require('./services/express');
const mongoose = require('./services/mongoose');
const seed = require('./services/seed');

/**
 * Initialisation de mongoose
 * Chargement des models et connexion à la db
 * @name startMongoose
 */
function startMongoose() {
  return new Promise((resolve, reject) => {
    mongoose.loadModels()
      .then(mongoose.connect)
      .then(dbConnection => {
        resolve(dbConnection);
      })
      .catch(error => {
        reject(error);
      });
  });
}

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
 * Initialisation du seeding de la base de donnée
 * @name startSeeding
 */
function startSeeding() {
  return new Promise((resolve, reject) => {
    if (config.seedDB.seed === 'active') {
      console.info(chalk.bold.blue('Info: Le seeding est actif'));
      seed.start();
      resolve();
    } else {
      console.info(chalk.bold.blue('Info: Le seeding est inactif'));
    }
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
    let db;
    let seed;

    try {
      db = await startMongoose();
      app = await startExpress();
      seed = await startSeeding();
    } catch (error) {
      return reject(new Error('+ Erreur: impossible d\'intialiser l\'instance expressJS ou le serveur MongoDB'));
    }

    return resolve({
      db: db,
      app: app,
      seed: seed
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
    let db;

    try {
      ({ db, app } = await bootstrap());
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
      console.info(chalk.green(`Database:          ${config.db.uri}`));
      console.info(chalk.bgMagenta(`App version:  ${config.bullesdesoi.version}`));
      console.info(chalk.white('---'));
    });

    return resolve({
      db: db,
      app: app
    });
  });
};
