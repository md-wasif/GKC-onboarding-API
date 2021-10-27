const mongoose = require('mongoose');
const router = require('express').Router();
const atob = require('atob');
const bcrypt = require('bcrypt');



const User = require('../models/User');
const UserBrand = require('../models/UserBrand');


const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};



router.post('/createUser', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = filterId.id;

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        profile: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.json({"code": "OK", "message": "Create User Sussfully."});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});


//Edit User Management...
router.put('/editUser/:id', async (req, res) => {
    try {
        const updateuser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({"code": "OK", "data": updateuser});
    } catch (err) {
        res.json(err);
    }
});


//Get User Management..
router.get('/getUser', async (req, res) => {
    const userinfo_Id = mongoose.Types.ObjectId(req.query.userId);
    let getuserDetails;
    let checkBrand;
    try {

        getuserDetails = await User.findOne({ _id: userinfo_Id });
        checkBrand = await UserBrand.aggregate([{
            $match: { user: userinfo_Id }
        }, {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brands"
            }
        }, {
            $unwind: "$brands"
        },
        ]);
        let brandsArr = [];
        checkBrand.forEach((brand) => {
            brandsArr = brandsArr.concat(brand.brands);
        })
        getuserDetails._doc.brands = brandsArr;
        res.json({"code": "OK", "data": getuserDetails});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});


//Delete User Management..
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.id });
        res.json({"code":"OK", "data": removedUser});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});



router.get('/getUsers', async (req, res) => {
    //let userdetails;
    let users;
    try {
       // users = await User.find();
        users = await User.aggregate([{
            $lookup: {
                from: "userbrands",
                localField: "_id",
                foreignField: "user",
                as: "userbrands"
            }
        },
         {
            $lookup: {
                from: "brands",
                localField: "userbrands.brand",
                foreignField: "_id",
                as: "brands"
            }
        },
        {
            $project: {
             firstName: 1, 
             lastName: 1,  
             email: 1, 
             isActive: 1,
             brands: 1,
            }
        }
])
        // let products = []
        // users.forEach((item) => {
        //     products.push(item.brands)
        // })
        // //console.log(users[0].brands)
        // users[0].brands = products
        // users.splice(1);

        //console.log(userdetails);
        //console.log(users[0]);
        res.json({"code": "OK", "data": users});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});



router.put('/deactivateUser', async (req, res) => {

    var userinfo_id = mongoose.Types.ObjectId(req.query.userId);

    try {
        const getUser = req.body.isActive;
        await User.updateOne({ _id: userinfo_id },
            { $set: { "isActive": getUser } }
        );
        const getdeactiveUser = await User.findById(userinfo_id);
        res.json({"code":"OK", "data": getdeactiveUser});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});


module.exports = router;