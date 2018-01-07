// dépendances NodeJS
const path = require('path');

// dépendances NPM
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const hbs = require('express-hbs');
const helmet = require('helmet');
const lusca = require('lusca')

// dépendances internes
const config = require('../config/config');
const log = require('./logger').log();
const expressLogger = require('./logger').logExpress();

/**
 * Initialisation des variables locales expressJS
 * @name initLocalVariables
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initLocalVariables = app => {
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  // Passage des paramètres URL à des variables locales
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

/**
 * Initialisation du module middlewares
 * Déclaration et paramétrage des middlewares expressJS
 * @name initMiddlewares
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initMiddlewares = app => {
  // Déclaration du middleware: Compression
  app.use(compress({
    filter: (req, res) => {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Déclaration du logger
  app.use(expressLogger);

  // Déclaration du middleware: Body-parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // Déclaration du middleware: Method-override
  // Doit être placé avant les autres middleware nécessitant d'avoir accès aux méthodes HTTP
  app.use(methodOverride());

  // Autorisation Access-Control-Allow-Origin
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin X-Requested-With Content-Type');
    next();
  });

  // Déclaration de lusca
  // TODO: A retirer si ce n'est pas utile au final
  app.use(lusca(config.csrf));
};


/**
 * Initialisation du module de moteur HTML
 * Utilisation de express handlebar
 * TODO: au démarrage utilisation uniquement d'une route root et renvoi d'un message. A modifier ensuite
 */
module.exports.initViewEngine = app => {
  app.engine('hbs', hbs.express4({
    partialsDir: [
      path.resolve('./server/modules/core/views/')
    ],
    extname: '.html'
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.resolve('./server/modules/core/views'));
};

/**
 * Initialisation du middleware Helmet
 * @name initHelmetHeaders
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initHelmetHeaders = app => {
  // Définition du max_age pour la configuration hsts (Strict-Transport-Security HTTP)
  // Le navigateur visitera seulement le site en https pour les visites dans les max_age jours
  const SIX_MONTHS = 15778476000;

  app.use(helmet.frameguard()); // Protection clickjacking
  app.use(helmet.xssFilter()); // Protection XSS (faible)
  app.use(helmet.noSniff()); // Protection sniffing MIME type
  app.use(helmet.ieNoOpen()); // Configuration X-Download-Options IE8+
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.use(helmet.hidePoweredBy()); // Ne pas afficher x-powered-by
};

/**
 * Initialisation de la configuration server
 * Appel des fichiers config
 * @name initModulesConfiguration
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initModulesConfiguration = app => {
  if (!config.files.server.config) {
    return '';
  } else {
    config.files.server.configs.forEach(configPath => {
      require(path.resolve(configPath))(app);
    });
  }
};

/**
 * Initialisation des fichiers statiques
 * @name initModulesClientRoutes
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initModulesClientRoutes = app => {
  app.use('/', express.static(path.resolve('./server/modules/core/views')));
}

/**
 * Initialisation des routes server
 * @name initModulesServerRoutes
 * @param {object} app objet représentant l'instance de l'application express
 */
module.exports.initModulesServerRoutes = app => {
  // Définition de la route server par défaut
  config.files.server.routes.forEach(routePath => {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Initialisation de l'instance app expressJS
 * @name init
 * @returns {object} app application express
 */
module.exports.init = () => {
  const app = express();

  // Activation des variables locales
  this.initLocalVariables(app);

  // Activation des middlewares
  this.initMiddlewares(app);

  // Activation de Helmet
  this.initHelmetHeaders(app);

  // Activation du moteur HTML
  this.initViewEngine(app);

  // Activation des routes statiques client
  this.initModulesClientRoutes(app);

  // Activation de la configuration server
  this.initModulesConfiguration(app);

  // Activation des routes server
  this.initModulesServerRoutes(app);

  return app;
};
