const mongose = require('mongoose');
const router = require('express').Router();


const User = require('../models/User');


//Create User Management..
router.post('/createUser', async (req, res) => {

    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const savedUser = await User.save();
        res.json(savedUser);
    } catch (error) {
        res.json({ message: error });
    }
});



//Edit User Management...
router.put('/editUser/:id', async (req, res) => {
    try {
        const updateuser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateuser);
    } catch (err) {
        res.json(err);
    }
});


//Get User Management..
router.get('/getUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.json({ message: error });
    }
});


//Delete User Management..
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.id });
        res.json(removedUser);
    } catch (error) {
        res.json({ message: error });
    }
});



router.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json({ message: error });
    }
});


  
router.put('/deactivateUser', async (req, res) => {
  
      var userinfo_id = mongose.Types.ObjectId(req.query.userId);
  
      try {
          const getUser = req.body.isActive;
          await UserBrand.updateOne({ _id: userinfo_id },
              { $set: { "isActive": getUser } }
          );
          const getdeactiveUser = await UserBrand.findById(userinfo_id);
          res.json(getdeactiveUser);
      } catch (error) {
          res.json({ message: error });
      }
  });


module.exports = router;