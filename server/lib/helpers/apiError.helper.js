// Déclaration des variables
const API_ERROR_CODES = {
  serverError: 'SERVER_ERROR'
};

/**
 * Classe d'extension Error
 * @class ApiError
 * @extends {Error}
 */
class ApiError extends Error {

  constructor(message, { status, code } = {}) {
    super(message);

    // Configuration du code status HTTP
    // Par défaut renvoi du code 500
    this.status = status || 500;

    // Configuration du code erreur de l'api
    this.code = code || API_ERROR_CODES.serverError;

    // Garantie de l'utilisation du nom de l'api
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Export de la classe
module.exports = ApiError;
