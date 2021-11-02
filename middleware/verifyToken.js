const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = require('../config/token');




module.exports = function (req, res, next) {
  const token = req.header('auth-token');
  if (!token)
    //   return res.status(401).send('Access Denied');
    return res.json({ "code": "ERROR", "message": "Access Denied" });
  try {
    const verified = jwt.verify(token, config.secret);
    req.user = verified;
    next();
  } catch (err) {
    //res.status(400).send('Invalid Token');
    res.json({ "code": "ERROR", "message": "Invalid Token" });
  }

}

