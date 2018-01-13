// dépendances NPM
const mongoose = require('mongoose');
const chalk = require('chalk');

// dépendances locales
const config = require('./../../lib/config/config');

// Déclaration du schéma mongoose
const Schema = mongoose.Schema;

/**
 * Déclaration de la structure du model Seance
 */
const SeanceSchema = new Schema({
  intention: {
    type: String,
    required: [true, config.msg.global.required]
  },
  created: {
    type: Date,
    default: Date.now
  },
  rang: {
    type: Number,
    default: '1',
    required: [true, config.msg.global.required]
  },
  updated: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  relaxations: [{
    type: Schema.Types.ObjectId,
    ref: 'Relaxation'
  }],
  sophronisations: [{
    type: Schema.Types.ObjectId,
    ref: 'Sophronisation'
  }]
});

// Export de la fonction seed du model
SeanceSchema.statics.seed = seed;

/**
 * Seed du model
 * @name seed
 * @param {object} doc objet user correspondant à l'objet dans env/default.js
 * @param {object} options object options correspondant à l'objet dans env/default.js
 */
function seed(doc, options) {
  const Seance = mongoose.model('Seance');
  const User = mongoose.model('User');

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
        Seance
          .findOne({
            rang: doc.rang
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

    // Ajout de la séance
    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database seeding: Seance ' + doc.rang + ' abandonné')
          });
        }

        const seance = new Seance(doc);
        User.findOne({
          email: 'user-data@local.com'
        })
          .exec((error, user) => {
            if (error) {
              return reject(error);
            }
            seance.user = user._id;
            seance.save((error, result) => {
              if (error) {
                return reject(error);
              } else {
                user.update(
                  { $push: { seances: seance._id } },
                  { updated: Date.now() }, error => {
                    if (error) {
                      return reject(error);
                    }
                  }
                );
                return resolve({
                  message: 'Database seeding: Seance ' + seance.rang + ' ajoutée sur le user - ' + user.email
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
* Initialisation du model Seance
*/
mongoose.model('Seance', SeanceSchema);
