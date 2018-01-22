module.exports = {
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'server/lib/config/config.js', 'server/lib/config/**/*.js', 'server/modules/*/controllers/**/*.js', 'server/modules/*/routes/**/*.js', 'server/modules/*/services/**/*.js', 'server/modules/*/strategies/**/*.js'],
    models: ['server/modules/models/*.js'],
    config: ['server/modules/*/config/**/*.js'],
    routes: ['server/modules/*/routes/**/*.js']
  }
};
