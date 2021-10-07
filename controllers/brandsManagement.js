const mongoose = require('mongoose');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');




//GET /getCuisines All the Cuisines..
router.get('/getCuisines', async (req, res) => {

    try {
        const cuisines = await Cuisine.find({}).select("-isDeleted");
        res.json(cuisines);
    } catch (error) {
        res.json({ message: error });
    }
});


//GET /getBrands get all brands for cuisine..
router.get('/getBrands', async (req, res) => {

    let cuisineId = req.query.cuisineId;
    console.log(cuisineId);
    try {
        const brands = await Brand.find({ cuisine: cuisineId }).select("-isDeleted -cuisineId");
        res.json(brands);
    } catch (error) {
        res.json({ message: error });
    }
});


//GET /getProducts get all products for brand..
router.get('/getProducts', async (req, res) => {

    let brandId = req.query.brandId;
    try {
        const products = await Product.find({ brand: brandId }).select("-isDeleted -brandId");
        res.json(products);
    } catch (error) {
        res.json({ message: error });
    }
});



module.exports = router;