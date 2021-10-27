const mongoose = require('mongoose');
const router = require('express').Router();



const User = require('../models/User');
const Promotion = require('../models/Promotion');



router.post('/createPromotion', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);

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
    try {
        const saveDetails = await Promotion.findById({ _id: promotion_id }).select("-_id -offer -goaltype -isActive -startdate -enddate -__v");
        res.json({ "code": "OK", "data": saveDetails })
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.put('/activePromotion', async (req, res) => {

    var promotion_id = mongoose.Types.ObjectId(req.query.Id);
    var getActivateData;
    try {
        const getData = req.body.isActive;
        const getNumber = req.body.input;
        await Promotion.updateOne({ _id: promotion_id },

            [{ $set: { "isActive": getData, enddate: { $add: ["$enddate", getNumber * 7 * 24 * 60 * 60000] } } }],
        );
        await User.updateOne({
            $set: { "promotion": promotion_id }
        })

        getActivateData = await User.aggregate([{
            $unwind: "$promotion"
        }, {
            $lookup: {
                from: "promotions",
                localField: "promotion",
                foreignField: "_id",
                as: "promotions"
            }
        }, {
            $unwind: "$promotions"
        }, {
            $project: {
                firstName: 1,
                lastName: 1,
                promotions: 1
            }
        }])
        // console.logconst getdeactiveUser = await Promotion.findById(promotion_id).select("-__v");
        res.json({ "code": "OK", "data": getActivateData });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});

module.exports = router;