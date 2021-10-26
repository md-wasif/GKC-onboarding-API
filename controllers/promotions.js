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
})


module.exports = router;