// dépendances NPM
const _ = require('lodash');
const mongoose = require('mongoose');
const chalk = require('chalk');

// dépendances locales
const config = require('../config/config');

// Configuration localisation faker
let seedOptions = {};
let seedObject = [];


function start(seedConfig) {
  return new Promise((resolve, reject) => {
    // Déclaration de l'objet seedConfig
    seedConfig = seedConfig || {};

    const options = seedConfig.options || (config.seedDB ?_.clone(config.seedDB.options, true) : {});
    const collections = seedConfig.options || (config.seedDB ? _.clone(config.seedDB.collections, true) : []);

    if (!collections.length) {
      return resolve();
    }

    const seeds = collections
      .filter((collection) => {
        return collection.model;
      });

    seeds.reduce((p, item) => {
      return p.then(() => {
        return seed(item, options);
      });
    }, Promise.resolve())
      .then(onSuccess)
      .catch(onError);

    // Définition des Promises
    function onSuccess() {
      if (options.logResults) {
        console.info();
        console.info(chalk.bold.green('Database seeding: Le seed est activé'));
        console.info();
      }

      return resolve();
    }

    function onError(error) {
      if (options.logResults) {
        console.error();
        console.error(chalk.bold.red('Database seeding: Echec du seeding'));
        console.error(chalk.bold.red('Database seeding: ' + error));
        console.error();
      }

      return reject(error);
    }
  });
}

function seed(collection, options) {
  // Merge options avec les options de la collection
  options = _.merge(options || {}, collection.options || {});

  return new Promise((resolve, reject) => {
    const Model = mongoose.model(collection.model);
    const docs = collection.docs;

    const skipWhen = collection.skip ? collection.skip.when : null;

    if (!Model.seed) {
      return reject(new Error('Database seeding: La configuration du Model est invalide - ' + collection.model + ' .seed() non implémentée'))
    }

    if (!docs || !docs.length) {
      return resolve();
    }

    skipCollection()
      .then(seedDocuments)
      .then(() => {
        return resolve();
      })
      .catch((error) => {
        return reject(error);
      });

    function skipCollection() {
      return new Promise((resolve, reject) => {
        if (!skipWhen) {
          return resolve(false);
        }
        Model
          .find(skipWhen)
          .exec((error, results) => {
            if (error) {
              return reject(error);
            }
            if (results && results.length) {
              return resolve(true);
            }

            return resolve(false);
          });
      });
    }

    function seedDocuments(skipCollection) {
      return new Promise((resolve, reject) => {
        if (skipCollection) {
          return onComplete([{ message: chalk.yellow('Database seeding: ' + collection.model + ' collection abandonnée') }]);
        }

        const workDocs = docs
          .filter((doc) => {
            return doc.data;
          })
          .map((doc) => {
            return Model.seed(doc.data, { overwrite: doc.overwrite });
          });

        Promise.all(workDocs)
          .then(onComplete)
          .catch(onError);

        function onComplete(responses) {
          if (options.logResults) {
            responses.forEach((response) => {
              if (response.message) {
                console.info(chalk.magenta(response.message));
              }
            });
          }

          return resolve();
        }

        function onError(error) {
          return reject(error);
        }
      });
    }
  });
}
exports.start = start;
