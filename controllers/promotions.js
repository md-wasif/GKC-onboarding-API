const mongoose = require('mongoose');
const router = require('express').Router();
const atob = require('atob');



const User = require('../models/User');
const Promotion = require('../models/Promotion');


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

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)

    const promotion = new Promotion({
        // user: userId,
        name: req.body.name,
        description: req.body.description,
        offer: req.body.offer,
        goaltype: req.body.goaltype,
    })
    try {
        const savePromotion = await promotion.save();
        res.json({ "code": "OK", "message": "Create Promotion Sussfully." })
    } catch (error) {
        res.json({ "code": "Error", message: error.message });
    }
});



router.get('/getPromotion', async (req, res) => {

    try {
        const savePromotion = await Promotion.aggregate([
            {
                $project: {
                    __v: 0
                }
            }
        ]);
        res.json({ "code": "OK", "data": savePromotion });
    } catch (error) {
        res.json({ "code": "Error", message: error.message })
    }
});


router.get('/getDetails', async (req, res) => {

      const promotion_id = mongoose.Types.ObjectId(req.query.id);
      try{
            const saveDetails = await Promotion.findById({_id: promotion_id}).select("-_id -offer -goaltype -isActive -startdate -enddate -__v"); 
            res.json({"code": "OK", "data": saveDetails})
      }catch(error){
          res.json({"code": "ERROR", message: error.message});
      }
});



router.put('/deactivatePromotion', async (req, res) => {
    
    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    var promotion_id = mongoose.Types.ObjectId(req.query.Id);

    try {
        const getData = req.body.promotion;
        const getNumber = req.body.input;
        await User.updateOne({user: userId}, 
            { $set: { "promotion": getData}})
        // $match: { user: userId }
        await Promotion.updateOne({ _id: promotion_id},

             [{ $set: {enddate: { $add: ["$enddate", getNumber*7*24*60*60000]}}}],
    //         // { $set: { "isActive": getData}},
    //         // { enddate : { $isActive : true }},
    //         // [{$set: {enddate: { $add: ["$enddate", getNumber*86400000] } }}]
     );
        const getdeactiveUser = await Promotion.findById(promotion_id).select("-__v");
        res.json({"code":"OK", "data": getdeactiveUser});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});

module.exports = router;