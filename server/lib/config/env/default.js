module.exports = {
  app: {
    title: 'Bulles de Soi',
    description: 'Site web de sophrologie et prise de rendez-vous en ligne',
    keywords: 'sophrologie, relaxation, gestion du stress, perinatalité, enfance, adolescence'
  },
  log: {
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      filename: process.env.LOG_FILE || 'app-log.json',
      maxsize: 10485760,
      maxFiles: 2,
      json: true
    }
  },
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  db: {
    promise: global.Promise,
    options: {
      // Paramètres nécessaires pour activer l'auth par certificat sous mongodb
      // ssl: true,
      // sslValidate: false,
      // checkServerIdentity: false,
      // sslCA: fs.readFileSync('../sslcerts/ssl-ca.pem'),
      // sslCert: fs.readFileSync('../sslcerts/ssl-cert.pem'),
      // sslKey: fs.readFileSync('../sslcerts/ssl-key.pem'),
      // sslPass: 'Q0J%6Luc~<4|)73'
    },
    // Activation du mode debug
    debug: process.env.MONGODB_DEBUG || false
  },
  msg: {
    global: {
      default: 'La validation du `{PATH}` a échoué pour la valeur `{VALUE}`',
      required: 'Le `{PATH}` est un champs obligatoire'
    },
    number: {
      min: 'La `{VALUE}` est inférieure à la valeur minimum requise `{MIN}`',
      max: 'La `{VALUE}` est supérieure à la valeur maximum requise `{MAX}`'
    },
    date: {
      min: 'Le `{PATH}` ({VALUE}) est inférieur à la date minimum requise ({MIN})',
      max: 'Le `{PATH}` ({VALUE}) est supérieur à la date maximum requise ({MAX})'
    },
    string: {
      enum: 'La valeur `{VALUE}` n\'est pas autorisée pour le champs `{PATH}`',
      match: 'La valeur `{VALUE}` est invalide pour le champs `{PATH}`',
      minlength: 'Champs `{PATH}`: la ({VALUE}) est inférieur au minimum requis ({MINLENGTH})',
      maxlength: 'Champs `{PATH}`: la ({VALUE}) est supérieur au maximum requis ({MAXLENGTH})'
    }
  }
};
