const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../utils/validation');
const config = require('../config/token'); 


//Register
router.post('/register', async (req, res) => {

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    //res.send({"code":"OK", "data": {user: user._id}});
    res.send({ "code": "OK", "message": "Registered Sucessfully.." });
  } catch (error) {
    res.status(400).send({ "code": "ERROR", message: error.message });
  }
});


//Login
router.post('/login', async (req, res) => {

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the email exists.
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({
    "code": "ERROR",
    "data": {
      "type": "Wrong Email",
      "message": "Email entered is wrong"
    }
  }); 

  const validpass = await bcrypt.compare(req.body.password, user.password);
  if (!validpass) return res.status(400).json({
    "code": "ERROR",
    "data": {
      "type": "Wrong password",
      "message": "Password entered is wrong"
    }
  }); //.send('password is incorrect!');

  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  

  res.header('auth-token', token).json({
    "code": "OK",
    "data": {
      "auth": true,
      "token": token
    }
  }); 
});


//Logout
router.get('/logout', async (req, res) => {
  res.status(200).json({
    "code": "OK",
    "data": {
      "auth": false,
      "token": null
    }
  }); 
});

//const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
// res.header('auth-token', token).send(token);
//res.send('Logged In!');

module.exports = router;