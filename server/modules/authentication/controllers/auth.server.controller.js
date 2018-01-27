exports.signin = async (req, res) => {
  return res.json(req.user);
};
