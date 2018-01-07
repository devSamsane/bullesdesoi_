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
  }
};
