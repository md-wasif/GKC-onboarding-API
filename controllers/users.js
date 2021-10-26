const mongose = require('mongoose');
const router = require('express').Router();

const Profile = require('../models/Profile');


//CREATES A NEW USER
router.post('/', async (req, res) => {

    Profile.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const savedUser = await Profile.save();
        res.json({ "code": "OK", "message": "Creating new User Sussfully.." });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async (req, res) => {
    try {
        const users = await Profile.find();
        res.json({ "code": "OK", "data": users });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

//GET A SINGLE USER FROM A DATABASE.
router.get('/:id', async (req, res) => {
    try {
        const user = await Profile.findById(req.params.id);
        res.json({ "code": "OK", "data": user });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

//DELETE A USER FROM THE DATABASE.
router.delete('/:id', async (req, res) => {
    try {
        const removedUser = await Profile.remove({ _id: req.params.id });
        res.json({ "code": "OK", "data": removedUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

//UPDATE A USER IN A DATABASE.
router.put('/:id', async (req, res) => {
    try {
        const updateuser = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ "code": "OK", "data": updateuser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});


module.exports = router;