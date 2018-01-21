// dépendances NPM
const mongoose = require('mongoose');
const chalk = require('chalk');

// dépendances locales
const config = require('./../../lib/config/config');

// Déclaration du schéma mongoose
const Schema = mongoose.Schema;

/**
 * Déclaration de la structure du model Sophronisation
 */
const SophronisationSchema = new Schema({
  description: {
    type: String,
    required: [true, config.msg.global.required]
  },
  intention: {
    type: String,
    required: [true, config.msg.global.required]
  },
  type: {
    type: [{
      type: String,
      enum: ['présentation', 'futurisation', 'prétérisation', 'totalisation']
    }],
    required: [true, config.msg.string.enum]
  },
  name: {
    type: String,
    required: [true, config.msg.global.required]
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
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
SophronisationSchema.statics.seed = seed;

/**
 * Seed du model
 * @name seed
 * @param {object} doc objet user correspondant à l'objet dans env/default.js
 * @param {object} options object options correspondant à l'objet dans env/default.js
 */
function seed(doc, options) {
  const Sophronisation = mongoose.model('Sophronisation');
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
        Sophronisation
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

    // Ajout de la sophronisation
    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database seeding: Seance ' + doc.rang + ' abandonné')
          });
        }

        const sophronisation = new Sophronisation(doc);
        Seance.findOne({
          rang: 1
        })
          .exec((error, seance) => {
            if (error) {
              return reject(error);
            }
            sophronisation.user = seance.user;
            sophronisation.seance = seance._id;
            sophronisation.save((error, result) => {
              if (error) {
                return reject(error);
              } else {
                seance.update(
                  { $push: { sophronisations: sophronisation._id } },
                  { updated: Date.now() }, error => {
                    if (error) {
                      return reject(error);
                    }
                  }
                );
                return resolve({
                  message: 'Database seeding: Sophronisation ' + sophronisation.type + ' ajoutée sur le user - ' + sophronisation.user
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
* Initialisation du model Sophronisation
*/
mongoose.model('Sophronisation', SophronisationSchema);
