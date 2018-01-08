// dépendances NPM
const mongoose = require('mongoose');

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
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  rang: {
    type: Number
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

/**
* Initialisation du model Seance
*/
mongoose.model('Seance', SeanceSchema);
