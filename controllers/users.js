const mongose = require('mongoose');
const bodyparser = require('body-parser');
const router = require('express').Router();
//const bcrypt = require('bcrypt');

const User = require('../models/User');


//CREATES A NEW USER
router.post('/', async (req, res) => {

     User.create ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
     });
     try{
        const savedUser = await User.save();
        res.json(savedUser);
    }catch(error){
       res.json({message : error});
    }
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async (req, res) => {
       try{
             const users = await User.find();
             res.json(users);
       }catch(error){
            res.json({message: error});
       }
});

//GET A SINGLE USER FROM A DATABASE.
router.get('/:id', async (req, res) => {
       try{
          const user = await User.findById(req.params.id);
             res.json(user);
       }catch(error){
           res.json({message: error});
       }
});

//DELETE A USER FROM THE DATABASE.
router.delete('/:id', async (req, res) => {
    try{
        const removedUser = await User.remove({ _id: req.params.id});
        res.json(removedUser);
    }catch(error)
    {
      res.json({message: error});
    }
});

//UPDATE A USER IN A DATABASE.
router.put('/:id', async (req, res) => {
   try{
         const updateuser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
           res.json(updateuser);
   }catch(err){
       res.json(err);
   }
});


module.exports = router;