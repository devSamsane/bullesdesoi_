/**
 * Définition du template à retourner sur la route '/'
 * @name coreTemplate
 */
exports.coreTemplate = (req, res, next) => {
  res.render('index');
};
