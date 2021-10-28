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


router.post('/createUserPromotion', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    try{
        const userPromotion = new UserPromotion({
            user: userId,
            promotion: req.body.promotion_id
        })
        await userPromotion.save();
    }catch(error){
        res.json({"code": "ERROR", message: error.message})
    }
})

router.get('/getAllPromotion', async (req, res) => {
    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    try {
        const savedPromotion = await UserPromotion.aggregate([{
            $match: { user: userId }},{
            $lookup: {
                from: "promotions",
                localField: "promotion",
                foreignField: "_id",
                as: "promotions"
            }
        }, {
            $unwind: "$promotions"
        }
    ]);
         let promotionArr = []
         savedPromotion.forEach((item) => {
             promotionArr.push(item.promotions)
         })
         savedPromotion[0].promotion = promotionArr
         savedPromotion.splice(1);
         const getPromotion = savedPromotion[0];
        
        res.json({ "code": "OK", "data": getPromotion });
    } catch (error) {
        res.json({ "code": "Error", message: error.message })
    }
});


router.get('/getPromotion', async (req, res) => {

    // const token = req.header('auth-token');
    // const filterId = await parseJwt(token);
    // const userId = mongoose.Types.ObjectId(filterId.id)
     const promotion_id = mongoose.Types.ObjectId(req.query.id);
    try {
        const saveDetails = await Promotion.findById({_id: promotion_id});
        res.json({ "code": "OK", "data": saveDetails })
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.put('/activeUserPromotion', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    var promotion_id = mongoose.Types.ObjectId(req.query.Id);
    var gettogglePromotion;
    try {
        const getData = req.body.isActive;
         const getNumber = req.body.input;
        gettogglePromotion = await UserPromotion.updateOne({
            $match: { user: userId, promotion: promotion_id }},
            //{$set: { "endDate": getNumber * 7 * 24 * 60 * 60000}}
            [{ $set: {"isActive": getData, endDate: { $add: ["$endDate", getNumber*7*24*60*60000] }}}],
        )
      
        const getdeactiveUser = await UserPromotion.findOne({gettogglePromotion});
        res.json({ "code": "OK", "data": getdeactiveUser });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

module.exports = router;