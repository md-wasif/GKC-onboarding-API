const mongoose = require('mongoose');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');


//Get All the Cuisines..
router.get('/getCuisines', async (req, res) => {

      try{
        const cuisines = await Cuisine.find();
        res.json(cuisines);
    }catch(error){
        res.json({message: error});
    }
});



router.get('/getAllBrands', async (req, res) => {

    try{
      const brands = await Brand.find();
      res.json(brands);
  }catch(error){
      res.json({message: error});
  }
});


// router.get('/getProducts', async (req, res) => {

//       let cuisineId = req.body.
//       try{
   
//       }catch(error){
//           res.json({message: error});
//       }
// });



router.post('/createBrand', async (req, res) => {
    
      Brand.create({
          name: req.body.name
      });
      try{
          const saveBrand = await Brand.save();
          res.json(saveBrand);
      }catch(error){
          res.json({message: error});
      }
});





module.exports = router;