// dépendances NodeJS
const fs = require('fs');

// dépendances NPM
const _ = require('lodash');
const winston = require('winston');
const winstonExpress = require('express-winston');

// dépendances locales
const config = require('../config/config');

// Déclaration des variables
let logger;
let loggerExpress;

/**
 * Définition de la classe Logger
 * @class Logger
 */
class Logger {

  /**
   * Instanciation du logger
   * @name log
   * @static
   * @memberof Logger
   * @returns {object} logger object contenant les paramétres de configuration winston
   */
  static log() {
    if (logger) {
      return logger;
    }

    // Instanciation de winston par défaut avec `console transport`
    logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          colorize: true,
          showLevel: true,
          handleExceptions: true,
          humanReadableUnhandledException: true
        })
      ],
      exitOnError: false
    });

    // Instanciation du fichier winston transport
    // const fileLoggerTransport = this.setupFileLogger();
    // fileLoggerTransport && logger.add(winston.transports.File, fileLoggerTransport);

    return logger;
  }

  /**
   * Passage des options à utiliser avec winston
   * @name setupFileLogger
   * @static
   * @memberof Logger
   * @returns {object} object contenant les options et paramètres winston
   */
  static setupFileLogger() {
    const _config = _.clone(config, true);
    const configFileLogger = _config.log.fileLogger;

    if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.filename')) {
      console.warn('+ Erreur: Fichier de configuration du logger introuvable');
      return false;
    }

    const logPath = `${configFileLogger.directoryPath}/${configFileLogger.filename}`;

    // Instanciation du fichier de log
    if (!fs.openSync(logPath, 'a+')) {
      throw new Error('Instanciation du fichier de log en erreur');
    }

    return {
      level: 'debug',
      colorize: false,
      filename: logPath,
      timestamp: true,
      maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
      maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
      json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : true,
      eol: '/n',
      tailable: true,
      showLevel: true,
      humanReadableUnhandledException: true
    };
  }

  /**
   * Définition du logger expressJS (winston-express)
   * @name logExpress
   * @static
   * @memberof Logger
   * @returns {object} loggerExpress objet contenant la configuration du logger express
   */
  static logExpress() {
    if (loggerExpress) {
      return loggerExpress;
    }
    // Définition des options du fichier de log
    const fileLoggerTransport = this.setupFileLogger();

    loggerExpress = winstonExpress.logger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          json: false,
          colorize: true
        }),
        new winston.transports.File({
          level: fileLoggerTransport.level,
          colorize: fileLoggerTransport.colorize,
          filename: fileLoggerTransport.filename,
          timestamp: fileLoggerTransport.timestamp,
          maxsize: fileLoggerTransport.maxsize,
          maxFiles: fileLoggerTransport.maxFiles,
          json: fileLoggerTransport.json,
          eol: fileLoggerTransport.eol,
          tailable: fileLoggerTransport.tailable,
          showLevel: fileLoggerTransport.true,
          humanReadableUnhandledException: fileLoggerTransport.humanReadableUnhandledException
        })
      ],
      meta: true,
      expressFormat: true,
      colorize: true
    });

    return loggerExpress;
  }
}

// Exposition de la classe Logger
module.exports = Logger;
