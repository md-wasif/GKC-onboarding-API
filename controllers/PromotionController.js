const mongoose = require('mongoose');
const router = require('express').Router();
const moment = require('moment');
const {userTokenFilter} = require('../utils/userFilter');


const verify = require('../middleware/verifyToken');


const Promotion = require('../models/Promotion');
const UserPromotion = require('../models/UserPromotion');




router.post('/createPromotion', verify, async (req, res) => {

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



router.get('/getAllPromotions', verify, async (req, res) => {

    const token = req.header('auth-token');
    const userId = await userTokenFilter(token);
    try {

        const promotions = await Promotion.aggregate([{
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
        {
            $project: {
                endDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$userpromotions.endDate"
                    }
                }, startDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$userpromotions.startDate"
                    }
                },
                name: 1,
                description: 1,
                isActive: 1,
                userpromotions: 1
            }
        },
        //         userpromotions: 1,
        //         name: 1,
        //         description:1,
        //         // isActive: 1
        //     }
        // },
        {
            $match: {
                //isActive: true,
               // isDeleted: false,
                "userpromotions.user": userId,
                 "userpromotions.endDate": {$gt: new Date()},
                //  "userpromotions.isActive": true,
        }}
        // {$group: {
        //      _id: {
        //          userpromo: "$userpromotions", name: "$name", description: "$description", isActive: "$isActive"
        //      }  
        // }},{
        //     $project: {
        //         endDate: {
        //                          $dateToString: {
        //                              format: "%Y-%m-%d",
        //                              date: "$userpromo.endDate"
        //                          }
        //                      },
        //     }
        // }
       ])

        // var obj = [];
        // getPromotions.forEach((promo) => {
        //     //  console.log(promo.name);
        //     if(promo.userpromotions){
        //          obj.push({
        //              '_id': promo._id,
        //              'name' : promo.name, 
        //             'description': promo.description,
        //             'isActive': promo.userpromotions.isActive,
        //             'startDate' : promo.userpromotions.startDate,
        //             'endDate' :promo.userpromotions.endDate});
        //     }
        //     else{
        //         obj.push({
        //             '_id': promo._id,
        //             'name' : promo.name, 
        //             'description': promo.description,
        //             'isActive': promo.isActive,
        //             'startDate': '',
        //             'endDate': ''})
        //         };
        // })
        //console.log(obj);
        res.json({ "code": "OK", "data": promotions });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }

});



router.get('/getPromotion', verify, async (req, res) => {

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
    const userId = await userTokenFilter(token);
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
                { $set: { "isActive": getData, "endDate": moment().add(7*parseInt(getNumber), 'd').format('YYYY-MM-DD 00:00:00')} }
                // [{ $set: { "isActive": getData, endDate: { $add: ["$endDate", getNumber * 7 * 24 * 60 * 60000] } } }],
            )
        }
        else {
            userpromotion_id = await UserPromotion.create({
                user: userId,
                promotion: promotion_id,
                isActive: getData,
                startDate: moment().format('YYYY-MM-DD 00:00:00'),
                endDate: moment().add(7*parseInt(getNumber), 'd').format('YYYY-MM-DD 00:00:00')
            })
        }

        const getdeactiveUser = await UserPromotion.findById(userpromotion_id);
        res.json({ "code": "OK", "data": getdeactiveUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});




module.exports = router;