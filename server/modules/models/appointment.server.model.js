// dépendances NPM
const mongoose = require('mongoose');

// dépendances locales
const config = require('./../../lib/config/config');

// Déclaration du schéma mongoose
const Schema = mongoose.Schema;

/**
 * Déclaration de la structure du model Appointment
 */
const AppointmentSchema = new Schema({
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
* Initialisation du model Appointment
*/
mongoose.model('Appointment', AppointmentSchema);
