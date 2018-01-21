// dépendances NPM
const mongoose = require('mongoose');
const chalk = require('chalk');

// dépendances locales
const config = require('./../../lib/config/config');

// Déclaration du schéma mongoose
const Schema = mongoose.Schema;

/**
 * Déclaration de la structure du model Relaxation
 */
const RelaxationSchema = new Schema({
  intitule: {
    type: String,
    required: true
  },
  intention: {
    type: String,
    required: true
  },
  consigne: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  seance: {
    type: Schema.Types.ObjectId,
    ref: 'Seance'
  }
});

// Export de la fonction seed du model
RelaxationSchema.statics.seed = seed;

/**
 * Seed du model
 * @name seed
 * @param {object} doc objet user correspondant à l'objet dans env/default.js
 * @param {object} options object options correspondant à l'objet dans env/default.js
 */
function seed(doc, options) {
  const Relaxation = mongoose.model('Relaxation');
  const Seance = mongoose.model('Seance');

  return new Promise((resolve, reject) => {

    skipDocument()
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch((error) => {
        return reject(error);
      });

    // Vérification de l'abandon ou non du seed
    function skipDocument() {
      return new Promise((resolve, reject) => {
        Relaxation
          .findOne({
            type: doc.type
          })
          .exec((error, existing) => {
            if (error) {
              return reject(error);
            }
            if (!existing) {
              return resolve(false);
            }
            if (existing && !options.overwrite) {
              return resolve(true);
            }
            existing.remove((error) => {
              if (error) {
                return reject(error);
              }
              return resolve(false)
            });
          });
      });
    }

    // Ajout de la relaxation
    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database seeding: Seance ' + doc.rang + ' abandonné')
          });
        }

        const relaxation = new Relaxation(doc);
        Seance.findOne({
          rang: 1
        })
          .exec((error, seance) => {
            if (error) {
              return reject(error);
            }
            relaxation.user = seance.user;
            relaxation.seance = seance._id;
            relaxation.save((error, result) => {
              if (error) {
                return reject(error);
              } else {
                seance.update(
                  { $push: { relaxations: relaxation._id } },
                  { updated: Date.now() }, error => {
                    if (error) {
                      return reject(error);
                    }
                  }
                );
                return resolve({
                  message: 'Database seeding: Relaxation ' + relaxation.intitule + ' ajoutée sur le user - ' + relaxation.user
                });
              }
            });
          });
      })
        .catch((error) => {
          return reject(error);
        })
    }
  });
}

/**
* Initialisation du model Relaxation
*/mongoose.model('Relaxation', RelaxationSchema);
