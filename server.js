// dépendances NPM
const chalk = require('chalk');

// dépendances locales
const app = require('./server/lib/app');

app.start()
  .catch(error => {
    console.warn(chalk.red(`+ Erreur: échec du démarrage du serveur ${error.message}`));
    throw (error);
  });
