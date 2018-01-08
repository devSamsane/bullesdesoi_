// dépendances NPM
const mongoose = require('mongoose');

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
  }
});

/**
* Initialisation du model User
*/
mongoose.model('User', UserSchema);
