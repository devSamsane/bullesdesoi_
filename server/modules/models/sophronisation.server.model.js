// dépendances NPM
const mongoose = require('mongoose');

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

/**
* Initialisation du model Sophronisation
*/
mongoose.model('Sophronisation', SophronisationSchema);
