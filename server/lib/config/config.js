// dépendances NodeJS
const path = require('path');

// dépendances NPM
const glob = require('glob');
const _ = require('lodash');
const chalk = require('chalk');

/**
 * Récupération de l'ensemble des fichiers avec glob(pattern)
 * @name getGlobbedPaths
 * @param {object} globPatterns
 * @param {object} excludes
 * @return {object} output => liste l'ensemble des fichiers présents
 */
const getGlobbedPaths = (globPatterns, excludes) => {
  // définition du regex de récupération des fichiers
  const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // initialisation de la variable de retour
  let output = [];

  // récupération des fichiers
  // globPatterns => permet de déclarer les assets
  // si le paramètre globPatterns est un array alors il faut itérer sur tous les membres de l'array et pousser les valeurs dans l'array output
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(globPattern => {
      // incrémentation de l'array output de retour
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
    // si le paramètre globPatterns est un string alors il faut pousser la valeur dans l'array output
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      // déclaration de la variable files tel que files prend la valeur du nom du fichier si cela correspond au pattern
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(file => {
          if (_.isArray(excludes)) {
            let i;
            for (i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      // Passage de l'ensemble des fichiers trouvés à la valeur output
      output = _.union(output, files);
    }
  }
  return output;
};

/**
 * Vérification de l'existance du fichier d'environnement et de la définition de NODE_ENV (dev | prod)
 * @name validateEnvironmentVariable
 */
const validateEnvironmentVariable = () => {
  // Recherche du fichier de variables correspondant à l'environnement de démarrage
  const environnementFiles = glob.sync(path.resolve(`./server/lib/config/env/${process.env.NODE_ENV}.js`));

  // Si aucun fichier n'est trouvé
  if (!environnementFiles.length) {
    // Si aucune variable d'environnement n'est paramétrée
    if (!process.env.NODE_ENV) {
      console.warn(chalk.yellow('+ Alerte: Variable d\'environnement non definie. Pas de chargement du fichier de variables'));
      console.warn(chalk.yellow('+ Définition de l\'environnement par défaut - development'));
      // Définiton de l'environnement par défaut
      process.env.NODE_ENV = 'development';
    } else {
      console.warn(chalk.yellow('++ Paramétrage OK: Utilisation de l\'environnement paramétré'));
    }
  }
};

/**
 * Vérification de la déclaration du domaine
 * @name validateDomainIsSet
 * @param {object} config objet contenant les variables de configuration serveur
 */
const validateDomainIsSet = (config) => {
  if (!config.domain) {
    console.error(chalk.red('+ Erreur: la variable domain n\'est pas définie'));
  }
};

/**
 * Initialisation des répertoires server et client (server | src)
 * @name initGlobalConfigFolders
 * @param {object} config objet contenant les variables de configuration serveur
 * @param {object} assets objet contenant les variables des fichiers des assets
 */
const initGlobalConfigFolders = (config, assets) => {
  // Initialisation de l'objet
  config.folders = {
    server: {},
    client: {}
  };

  // Déclaration du répertoire client
  config.folders.client = `${process.cwd()}/src/app/`;
};

/**
 * Initialisation de la configuration
 * Récupération des fichiers déclarés dans assets
 * @name initGlobalConfigFiles
 * @param {object} config objet contenant les variables de configuration serveur
 * @param {object} assets objet contenant les variables des fichiers des assets
 */
const initGlobalConfigFiles = (config, assets) => {
  // Initialisation de l'objet
  config.files = {
    server: {},
    client: {}
  };

  // Récupération des fichiers de configuration
  config.files.configs = getGlobbedPaths(assets.server.config);

  // Récupération des fichiers de routes
  config.files.server.routes = getGlobbedPaths(assets.server.routes);
};

/**
 * Initialisation de l'objet config de configuration du serveur
 * @name initGlobalConfig
 */
const initGlobalConfig = () => {

  // Vérification de l'environnement
  validateEnvironmentVariable();

  // Récupération des assets par défaut
  const defaultAssets = require('../config/assets/default');

  // Récupération des assets liés à l'environnement
  const environmentAssets = require(`../config/env/${process.env.NODE_ENV}.js`)

  // Merge des assets
  const assets = _.merge(defaultAssets, environmentAssets);

  // Récupération de la configuration env. par défaut
  const defaultConfig = require('../config/env/default');

  // Récupération de la configuration env. par environnement
  const environmentConfig = require(`../config/env/${process.env.NODE_ENV}.js`);

  // Merge de la config
  const config = _.merge(defaultConfig, environmentConfig);

  // Enrichissement des informations de package.json
  const pkg = require('../../../package.json');
  config.bullesdesoi = pkg;

  // Appel de l'initialisation des fichiers de configuration
  initGlobalConfigFiles(config, assets);

  // Appel de l'initialisation des répertoires
  initGlobalConfigFolders(config, assets);

  // Appel de la vérification du domaine
  validateDomainIsSet(config);

  // Exposition de la fonction de récupération des fichiers dans l'objet config
  config.utils = {
    getGlobbedPaths: getGlobbedPaths
  };

  return config;
};

/**
 * Export de l'objet config
 */
module.exports = initGlobalConfig();
