const mongoose = require('mongoose');
const atob = require('atob');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');
const UserBrand = require('../models/UserBrand');
const authVerification = require('../routes/verifyToken');




const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};

//UserId: "615d97f5204f20834f16f6e1"
//BrandId: "615ee70c82b3b22d6c191fba"
//GET /getAllBrands get all brands for user...
router.get('/getAllBrands', async (req, res) => {

    const token = req.header('auth-token');
    console.log(token);
    const userId = await parseJwt(token);
    console.log(userId.id);
    let userBrands;
    try {
        userBrands = await UserBrand.aggregate([{
            $match: { user: userId.id }
        },
        {
            $lookup: {
                From: "brand",
                localField: "brand",
                foreignField: "_id",
                as: "brands"
            }
        }, {
            $unwind: "brands"
        }
        ]);

        const brands = await brands.find({});
        res.json(brands);
    } catch (error) {
        res.json({ message: error });
    }
})

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

    var cuisine = req.query.cuisine;
    try {
        const brands = await Brand.find({ cuisine: cuisine }).select("-isDeleted -cuisine");
        res.json(brands);
    } catch (error) {
        res.json({ message: error });
    }
});


//var ObjectId = require('mongodb').ObjectId; 
// var id = req.params.gonderi_id;       
// var o_id = new ObjectId(id);
// db.test.find({_id:o_id})

//GET /getProducts get all products for brand..
router.get('/getProducts', async (req, res) => {

    var brand = req.query.brand;
    try {
        const products = await Product.find({ brand: brand}).select("-isDeleted -brand");
        res.json(products);
    } catch (error) {
        res.json({ message: error });
    }
});



//POST /createBrand get brand from insert Id and return brand object with count of products..
router.post('/createBrand', async (req, res) => {

      const token = req.header('auth-token');
      const filterId = await parseJwt(token);
      const userId = filterId.id;
       

    const users = await UserBrand.create({
        profile: userId,
        brand: req.body.brand,
        products: req.body.products,
    });
    console.log(users);
    //console.log(UserBrand);
    try {
        const userbrands = await UserBrand.save();
        console.log(userbrands);
        res.json(userbrands);
    } catch (error) {
        res.json({ message: error });
    }
});



module.exports = router;