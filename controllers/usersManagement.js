const mongoose = require('mongoose');
const router = require('express').Router();
const atob = require('atob');



const User = require('../models/User');
const UserBrand = require('../models/UserBrand');
const { ObjectId } = require('bson');


const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    //console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};

//Create User Management..
router.post('/createUser', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = filterId.id;

    const user = new User({
        profile: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const savedUser = await user.save();
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
router.get('/getUser', async (req, res) => {
    const userinfo_Id = mongoose.Types.ObjectId(req.body.userId);
    var getuser;
    try {
        getuser = await UserBrand.aggregate({
            $match: { user: userinfo_Id }
        })
        // },{
        //     $lookup: {
        //         from: "users",
        //         localField: "_id",
        //         foreignField: "user",
        //         as: "users"
        //         }
        //     }
        //]);
        console.log(getuser);
        //const user = await User.findById(req.params.id);
        //res.json(user);
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
        await User.updateOne({ _id: userinfo_id },
            { $set: { "isActive": getUser } }
        );
        const getdeactiveUser = await User.findById(userinfo_id);
        res.json(getdeactiveUser);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;