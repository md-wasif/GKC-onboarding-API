const mongoose = require('mongoose');
const router = require('express').Router();
const atob = require('atob');
const moment = require('moment');


const verify = require('../utils/verifyToken');


const Promotion = require('../models/Promotion');
const UserPromotion = require('../models/UserPromotion');



const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    //console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};


router.post('/createPromotion', async (req, res) => {

    const promotion = new Promotion({
        // user: userId,
        name: req.body.name,
        description: req.body.description,
    })
    try {
        const savePromotion = await promotion.save();
        res.json({ "code": "OK", "message": "Create Promotion Sucessfully." })
    } catch (error) {
        res.json({ "code": "Error", message: error.message });
    }
});



router.get('/getAllPromotions', async (req, res) => {

    try {

        const getPromotions = await Promotion.aggregate([{
            $lookup: {
                from: "userpromotions",
                localField: "_id",
                foreignField: "promotion",
                as: "userpromotions"
            }
        }, {
            $unwind: {
                path: "$userpromotions",
                preserveNullAndEmptyArrays: true
            }
        },
        // },{$group: {
        //      _id: {
        //          userpromo: "$userpromotions", name: "$name", description: "$description", isActive: "$isActive"
        //      }  
        // }},
        {
            $project: {
                name: 1,
                description: 1,
                isActive: 1,
                isDeleted: 1,
                startDate: 1,
                endDate: 1,
                userpromotions: 1
            }
        }])

        var obj = [];
        getPromotions.forEach((promo) => {
            //  console.log(promo.name);
            if(promo.userpromotions){
                 obj.push({
                     '_id': promo._id,
                     'name' : promo.name, 
                    'description': promo.description,
                    'isActive': promo.userpromotions.isActive,
                    'startDate' : promo.userpromotions.startDate,
                    'endDate' :promo.userpromotions.endDate});
            }
            else{
                obj.push({
                    '_id': promo._id,
                    'name' : promo.name, 
                    'description': promo.description,
                    'isActive': promo.isActive,
                    'startDate': '',
                    'endDate': ''})
                };
        })
        //console.log(obj);
        res.json({ "code": "OK", "data": obj });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }

});



router.get('/getPromotion', async (req, res) => {

    // const token = req.header('auth-token');
    // const filterId = await parseJwt(token);
    // const userId = mongoose.Types.ObjectId(filterId.id)
    const promotion_id = mongoose.Types.ObjectId(req.query.Id);
    try {
        const saveDetails = await Promotion.findById({ _id: promotion_id });
        res.json({ "code": "OK", "data": saveDetails })
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.post('/activeUserPromotion', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    var promotion_id = mongoose.Types.ObjectId(req.query.Id);
    const getData = req.body.isActive;
    const getNumber = req.body.input;
    var userpromotion_id;
    try {
        const getuserPromotion = await UserPromotion.findOne({ promotion: promotion_id });
        if (getuserPromotion != undefined && getuserPromotion.length != 0) {

            userpromotion_id = getuserPromotion._id;
            await UserPromotion.updateOne({
                user: userId,
                _id: userpromotion_id
            },
                { $set: { "isActive": getData, "endDate": moment().add(getNumber, 'weeks').format("DD/MM/YYYY") } }
                // [{ $set: { "isActive": getData, endDate: { $add: ["$endDate", getNumber * 7 * 24 * 60 * 60000] } } }],
            )
        }
        else {
            userpromotion_id = new UserPromotion({
                user: userId,
                promotion: promotion_id,
                isActive: getData,
                endDate: moment().add(getNumber, 'weeks').format("DD/MM/YYYY")
            })
            await userpromotion_id.save();
        }

        const getdeactiveUser = await UserPromotion.findById(userpromotion_id);
        res.json({ "code": "OK", "data": getdeactiveUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

module.exports = router;