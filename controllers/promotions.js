const mongoose = require('mongoose');
const router = require('express').Router();



const Promotion = require('../models/Promotion');

router.post('/createPromotion', async (req, res) => {

    const promotion = new Promotion({
        name: req.body.name,
        offer: req.body.offer,
        goaltype: req.body.goaltype,    
    })
    try {
        const savePromotion = await promotion.save();
        res.json({"code": "OK", "message": "Create Promotion Sussfully."})
    }catch(e){
        res.json({"code": "Error", message: error});
    }
});



router.get('/getPromotion', async (req, res) => {

      try{
           const savePromotion = await Promotion.aggregate([
               {$project: {__v: 0}}
           ]);
           res.json({"code": "OK", "data": savePromotion});
      }catch(e){
          res.json({"code": "Error", message: error})
      }
});


module.exports = router;