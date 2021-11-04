const mongoose = require('mongoose');
const router = require('express').Router();
const moment = require('moment');
const { userTokenFilter } = require('../utils/userFilter');


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

        // const promotions = await Promotion.aggregate([{
        //     $lookup: {
        //         from: "userpromotions",
        //         localField: "_id",
        //         foreignField: "promotion",
        //         as: "userpromotions"
        //     }
        // }, {
        //     $unwind: {
        //         path: "$userpromotions",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        // {
        //     $match: {
        //         isActive: true,
        //         isDeleted: false,
        //         $or: [
        //             {
        //                 "userpromotions.user": userId,
        //                 "userpromotions.endDate": {
        //                     $gt: new Date()
        //                 },
        //                 "userpromotions.isActive": true,
        //                 "userpromotions.isDeleted": false
        //             },
        //             {
        //                 userpromotions: { $exists: false}
        //             },
        //             {
        //                 "userpromotions.isActive": false
        //             },
        //             {
        //                 "userpromotions.isDeleted": true
        //             }
        //         ]
        //     }
        // },
        // {
        //     $project: {
        //         endDate: {
        //             $dateToString: {
        //                 format: "%m-%d-%Y",
        //                 date: "$userpromotions.endDate"
        //             }
        //         }, startDate: {
        //             $dateToString: {
        //                 format: "%m-%d-%Y",
        //                 date: "$userpromotions.startDate"
        //             }
        //         },
        //         name: 1,
        //         description: 1,
        //         isActive: 1,
        //         isDeleted: 1,
        //         userpromotions: 1
        //     }
        // },
        // ])
        let promotions = await Promotion.find({});
        const userpromotion = await Promotion.aggregate([{
            $lookup: {
                        from: "userpromotions",
                         localField: "_id",
                         foreignField: "promotion",
                         as: "userpromotions"
                     }
                 },{
                     $unwind: {
                    path: "$userpromotions",
                    preserveNullAndEmptyArrays: true
                     }
                 },
                 {
                     $match: {
                     "userpromotions.user": userId,
                     "userpromotions.endDate": {
                     $gt: new Date()},
                     "userpromotions.isActive": true,
                     "userpromotions.isDeleted": false
                    }
                },
            //     {
            // $project: {
            //     endDate: {
            //         $dateToString: {
            //             format: "%m-%d-%Y",
            //             date: "$userpromotions.endDate"
            //         }
            //     }, startDate: {
            //         $dateToString: {
            //             format: "%m-%d-%Y",
            //             date: "$userpromotions.startDate"
            //         }
            //     },
            // }
        ]);
        //var Obj = [];
        let brandsArr = [];
        for(let p=0; p<promotions.length; p++){
            const promo = promotions[p];
            if(userpromotion.length && promotions[p]._doc.name == userpromotion[0].name){     
                  brandsArr.push({promo, 'userpromotions': userpromotion[0].userpromotions});
                 // brandsArr = brandsArr.concat(promo.userpromotions);
            }
            else{
                brandsArr.push({promo});
            }
        }
       // promotions = brandsArr[0].userpromotions
        // promotions.forEach((promo) => {
        //     if(userpromotion.length && promo._doc.name == userpromotion[0].name){
        //         brandsArr = brandsArr.concat(userpromotion[0].userpromotions);
        //         promo = brandsArr;
        //     }
        // })
        // brandsArr.forEach((brand) => {
        //     console.log(brand);
        // })
        //promotions = brandsArr;
       // console.log(brandsArr);
        //promotions = brandsArr;
       // getuserDetails._doc.brands = brandsArr;
        // promotions.forEach((promo) => {
        //     if(userpromotion.length){
        //         //console.log(promo._id);
        //         //console.log(userpromotion[0].userpromotions.promotion);
        //     //    if(promo._id == userpromotion[0].userpromotions.promotion){
        //     //        console.log('Test');
        //     //    }
        //     }
        // })
        res.json({ "code": "OK", "data": brandsArr });
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
        const saveDetails = await Promotion.findById({ _id: promotion_id, isDeleted: false });
        res.json({ "code": "OK", "data": saveDetails })
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.post('/activeUserPromotion', async (req, res) => {

    const token = req.header('auth-token');
    const userId = await userTokenFilter(token);
    const getData = req.body.isActive;
    const getNumber = req.body.input;
    let promotionId = mongoose.Types.ObjectId(req.query.Id);
    let userpromotionId;
    try {
        const getuserPromotion = await UserPromotion.findOne({ promotion: promotionId, user: userId});
        if(getData == false && getuserPromotion != undefined && getuserPromotion.length != 0){
                   await UserPromotion.updateOne({
                       $set: {
                           "isActive": getData, 
                           "isDeleted": true, 
                           "endDate": "", 
                           "startDate": ""
                        }
                   })
        }
        else if (getuserPromotion != undefined && getuserPromotion.length != 0) {

            userpromotionId = getuserPromotion._id;
            await UserPromotion.updateMany({
                user: userId,
                _id: userpromotionId
            },
                { $set: { "isActive": getData, "isDeleted": false, "startDate": moment().format('YYYY-MM-DD h:mm:ss'), "endDate": moment().add(7 * parseInt(getNumber), 'd').format('YYYY-MM-DD h:mm:ss') } }
                // [{ $set: { "isActive": getData, endDate: { $add: ["$endDate", getNumber * 7 * 24 * 60 * 60000] } } }],
            )
        }
        else {
            userpromotionId = await UserPromotion.create({
                user: userId,
                promotion: promotionId,
                isActive: getData,
                startDate: moment().format('YYYY-MM-DD h:mm:ss'),
                endDate: moment().add(7 * parseInt(getNumber), 'd').format('YYYY-MM-DD h:mm:ss')
            })
        }

        const getdeactiveUser = await UserPromotion.findById(userpromotionId);
        res.json({ "code": "OK", "data": getdeactiveUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});




module.exports = router;