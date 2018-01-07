/**
 * Définition du template à retourner sur la route '/'
 * @name coreTemplate
 */
exports.coreTemplate = (req, res, next) => {
  res.send('Bienvenue sur Bulles de Soi - ExpressJS')
};
