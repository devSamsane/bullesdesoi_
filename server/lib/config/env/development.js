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
  },
  seedDB: {
    seed: process.env.MONGO_SEED || 'active',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    collections: [{
      model: 'User',
      options: {
        logResults: true
      },
      skip: {
        when: {}
      },
      docs: [{
        overwrite: 'true',
        multiModels: false,
        data: {
          firstname: 'admin',
          lastname: 'local',
          email: 'admin@local.com',
          phoneNumber: '0660000000',
          roles: ['admin', 'user']
        }
      }, {
        overwrite: true,
        multiModels: false,
        data: {
          firstname: 'user',
          lastname: 'local',
          phoneNumber: '0660000000',
          email: 'user@local.com',
          roles: ['user']
        }
      }, {
        overwrite: true,
        multiModels: true,
        data: {
          firstname: 'userdata',
          lastname: 'local',
          phoneNumber: '0660000000',
          email: 'user-data@local.com',
          roles: ['user']
        }
      }]
    }, {
      model: 'Seance',
      options: {
        logResults: true
      },
      skip: {
        when: {}
      },
      docs: [{
        overwrite: true,
        data: {
          intention: 'intention de la seance 1',
          rang: '1'
        }
      }]
    }, {
      model: 'Sophronisation',
      options: {
        logResults: true
      },
      skip: {
        when: {}
      },
      docs: [{
        overwrite: true,
        data: {
          description: 'description de la sophronisation de la seance 1',
          intention: 'intention de la sophronisation de la seance 1',
          type: 'futurisation',
          name: 'nom de la sophronisation de la seance 1'
        }
      }]
    }, {
      model: 'Relaxation',
      options: {
        logResults: true
      },
      skip: {
        when: {}
      },
      docs: [{
        overwrite: true,
        data: {
          intitule: 'intitule de la relaxation de la seance 1',
          intention: 'intention de la relaxation de la seance 1',
          consigne: 'consigne de la relaxation de la seance 1'
        }
      }]
    }]
  }
};
