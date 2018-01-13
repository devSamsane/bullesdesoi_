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
    required: true
  },
  intention: {
    type: String,
    required: true
  },
  type: {
    type: [{
      type: String,
      enum: ['présentation', 'futurisation', 'prétérisation', 'totalisation']
    }],
    required: true
  },
  name: {
    type: String,
    required: true
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

SophronisationSchema.statics.seed = seed;

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
