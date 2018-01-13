// dépendances NPM
const mongoose = require('mongoose');
const chalk = require('chalk');

// dépendances locales
const config = require('./../../lib/config/config');

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
    required: true
  },
  firstname: {
    type: String,
    trim: true,
    required: true
  },
  lastname: {
    type: String,
    trim: true,
    required: true
  },
  displayName: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  providerData: {},
  additionnalProviderData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
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

UserSchema.statics.seed = seed;

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

    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database seeding: User ' + doc.email + ' abandonné')
          });
        }

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
