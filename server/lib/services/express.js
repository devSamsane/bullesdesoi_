// dépendances NodeJS
const path = require('path');

// dépendances NPM
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const hbs = require('express-hbs');

// dépendances internes
const config = require('../config/config');

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
