const mongoose = require('mongoose');
const atob = require('atob');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');
const UserBrand = require('../models/UserBrand');



const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    //console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};

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
                as: "brand"
            }
        }, {
            $unwind: "brand"
        }
        ]);

        const brands = await brand.find({});
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


//POST /createBrand get brand from insert Id and return brand object with count of products..
router.post('/createBrand', async (req, res) => {

    // const token = req.header('auth-token');
    // const userId = await parseJwt(token);

    UserBrand.create({
        brandId: req.body.brandId,
        productsId: req.body.productsId,
        userId: req.body.userId,
        isActive: req.body.isActive
    });
    try {
        const userbrands = await UserBrand.save();
        console.log(userbrands);
        res.json(userbrands);
    } catch (error) {
        res.json({ message: error });
    }
});



module.exports = router;