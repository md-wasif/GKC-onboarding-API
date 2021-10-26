const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = require('../token');



module.exports = function auth(req, res, next) {

  //check header or url parameters or post parameters for token
  const token = req.header('auth-token');
  if (!token)
    return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, config.secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }

}