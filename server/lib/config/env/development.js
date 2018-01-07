// Import de la configuration par défaut
const defaultConfig = require('./default');

module.exports = {
  app: {
    title: `${defaultConfig.app.title} - Environnement de developpement`
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  domain: process.env.DOMAIN || 'http://localhost',
  livereload: true,
  db: {
    uri: process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/bullesdesoi-dev`
  }
};
