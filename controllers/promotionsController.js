const mongoose = require('mongoose');
const router = require('express').Router();
const atob = require('atob');



const Promotion = require('../models/Promotion');
// const Category = require('../models/Category');
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
        res.json({ "code": "OK", "message": "Create Promotion Sussfully." })
    } catch (error) {
        res.json({ "code": "Error", message: error.message });
    }
});



// router.get('/getPromotions', async (req, res) => {

//     try{

//         const getAllPromotions = await Promotion.find({});
//         res.json({"code": "OK", "data": getAllPromotions});
//     }catch(error){
//         res.json({"code": "ERROR", message: error.message});
//     }
// });


router.get('/getAllPromotions', async (req, res) => {

        // const token = req.header('auth-token');
        // const filterId = await parseJwt(token);
        // const userId = mongoose.Types.ObjectId(filterId.id)
        try{

           const getPromotions =  await Promotion.aggregate([{
                $lookup: {
                    from: "userpromotions",
                    localField: "_id",
                    foreignField: "promotion",
                    as: "userpromotions"
                }
            }])
            res.json({"code": "OK", "data": getPromotions});
        }catch(error){
            res.json({"code": "ERROR", message: error.message});
        }
       
});

// router.get('/getAllPromotions', async (req, res) => {
//     const token = req.header('auth-token');
//     const filterId = await parseJwt(token);
//     const userId = mongoose.Types.ObjectId(filterId.id)
//     try {
//         //const getAllPromotions = await Promotion.find({});
        

//         const savedPromotion = await UserPromotion.aggregate([{
//             $match: { user: userId }
//         }, {
//             $lookup: {
//                 from: "promotions",
//                 localField: "promotion",
//                 foreignField: "_id",
//                 as: "promotions"
//             }
//         }, {
//             $unwind: "$promotions"
//         }, {
//             $project: {
//                 promotions: 1,
//                 startDate: 1,
//                 endDate: 1,
//                 isActive: 1,
//                 isDeleted: 1,
//                 user: 1
//             }
//         }
//         ]);
//         let promotionArr = []
//         savedPromotion.forEach((item) => {
//             promotionArr.push(item.promotions)
//         })
//         savedPromotion[0].promotions = promotionArr
//         savedPromotion.splice(1);

//         res.json({ "code": "OK", "data": savedPromotion });
//     } catch (error) {
//         res.json({ "code": "Error", message: error.message })
//     }
// });


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
    try {
        
        const userPromotion = new UserPromotion({
            user: userId,
             promotion: promotion_id
        })
         const getuserPromotion = await userPromotion.save();
        //  console.log(getuserPromotion);
         const userpromotion_id = getuserPromotion._id;
        await UserPromotion.updateOne({
            user: userId, _id: userpromotion_id },
            //{$set: { "endDate":  7 * 24 * 60 * 60000}}
            [{ $set: { "isActive": getData, endDate: { $add: ["$endDate", getNumber * 7 * 24 * 60 * 60000] } } }],
        )

        const getdeactiveUser = await UserPromotion.findById(userpromotion_id);
        res.json({ "code": "OK", "data": getdeactiveUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

module.exports = router;