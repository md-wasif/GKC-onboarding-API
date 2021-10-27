const mongoose = require('mongoose');
const router = require('express').Router();



const Promotion = require('../models/Promotion');

router.post('/createPromotion', async (req, res) => {

    const promotion = new Promotion({
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
            const saveDetails = await Promotion.aggregate([
                {$match: {_id: promotion_id}},{
                    $project: {
                        name: 1,
                        description: 1
                    }
                }]);
            res.json({"code": "OK", "data": saveDetails})
      }catch(error){
          res.json({"code": "ERROR", message: error.message});
      }
});



router.put('/deactivatePromotion', async (req, res) => {

    var promotion_id = mongoose.Types.ObjectId(req.query.Id);

    try {
        const getData = req.body.isActive;
        const getNumber = req.body.input;
        await Promotion.updateOne({ _id: promotion_id },

             [{ $set: { "isActive": getData, enddate: { $add: ["$enddate", getNumber*7*24*60*60000]}}}],
            // { $set: { "isActive": getData}},
            // { enddate : { $isActive : true }},
            // [{$set: {enddate: { $add: ["$enddate", getNumber*86400000] } }}]
    );
        const getdeactiveUser = await Promotion.findById(promotion_id).select("-__v");
        res.json({"code":"OK", "data": getdeactiveUser});
    } catch (error) {
        res.json({"code": "ERROR", message: error.message });
    }
});

module.exports = router;