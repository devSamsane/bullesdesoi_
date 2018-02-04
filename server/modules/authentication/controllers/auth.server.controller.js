// Dépendances locales
const AuthService = require('../services/auth.server.service');

exports.signin = async (req, res, next) => {
  if (req.user) {
    const user = req.user;
    const token = await AuthService.generateJWT(user);
    return res.json({ user: user, token: token });
  }
};
