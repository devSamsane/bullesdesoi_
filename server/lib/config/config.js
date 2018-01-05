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
  // si le paramètre globPatterns est un array alors il faut itérer sur tous les membres de l'array
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(globPatterns => {
      // incrémentation de l'array output de retour
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
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
      output = _.union(output, files);
    }
  }
  return output;
};




