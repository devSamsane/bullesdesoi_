// dépendances NPM
const mongoose = require('mongoose');
const chalk = require('chalk');
const validator = require('validator');

// dépendances locales
const config = require('./../../lib/config/config');
const ModelService = require('../core/services/models.server.service');

// Déclaration du schéma mongoose
const Schema = mongoose.Schema;

/**
 * Déclaration de la structure du model User
 */
const UserSchema = new Schema({
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true
    },
    lowercase: true,
    trim: true,
    default: '',
    required: [true, config.msg.global.required],
    validate: {
      validator: value => { return validator.isEmail(value, { require_tld: false }) },
      message: 'Une adresse email correcte est requise'
    }
  },
  firstname: {
    type: String,
    trim: true,
    required: [true, config.msg.global.required],
    validate: {
      validator: value => { return validator.isAlphanumeric(value, ['fr-FR']) },
      message: 'Seuls les caractères [A-Z][0-9] sont autorisés'
    }
  },
  lastname: {
    type: String,
    trim: true,
    required: [true, config.msg.global.required],
    validate: {
      validator: value => { return validator.isAlphanumeric(value, ['fr-FR']) },
      message: 'Seuls les caractères [A-Z][0-9] sont autorisés'
    }
  },
  displayName: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: [true, config.msg.global.required]
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  provider: {
    type: String,
    required: [true, config.msg.global.required]
  },
  providerData: {},
  additionnalProviderData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
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
  hasResetInProgress: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  status: {
    type: [{
      type: String,
      enum: ['active', 'disabled']
    }],
    default: ['active']
  },
  seances: [{
    type: Schema.Types.ObjectId,
    ref: 'Seance'
  }]
});


/**
 * Initialisation du displayName
 * Utilisation middleware pre validate de mongoose
 */
UserSchema.pre('validate', function (next) {
  this.displayName = this.firstname + ' ' + this.lastname;
  next();
});

// Export de la fonction seed du model
UserSchema.statics.seed = seed;

/**
 * Seed du model
 * @name seed
 * @param {object} doc objet user correspondant à l'objet dans env/default.js
 * @param {object} options object options correspondant à l'objet dans env/default.js
 */
function seed(doc, options) {
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
        User
          .findOne({
            email: doc.email
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

    // Ajout du user
    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database seeding: User ' + doc.email + ' abandonné')
          });
        }

        // Définition du user
        const user = new User(doc);
        user.provider = user.provider || 'local';
        user.password = user.password || 'password';
        user.updated = '';

        user.save((error) => {
          if (error) {
            return reject(error);
          }

          return resolve({
            message: 'Database seeding: User ' + user.email + ' ajouté avec le password - ' + user.password
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
* Initialisation du model User
*/
mongoose.model('User', UserSchema);
