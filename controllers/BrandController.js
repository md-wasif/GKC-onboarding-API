const mongoose = require('mongoose');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');
const UserBrand = require('../models/UserBrand');
const Category = require('../models/Category');
const verify = require('../middleware/verifyToken');
const {userTokenFilter} = require('../utils/userFilter');

const upload = require("../middleware/upload");




router.get('/getAllBrands', verify, async (req, res) => {

    const token = req.header('auth-token');
    const userId = await userTokenFilter(token);
    let userBrands;
    try {

        userBrands = await UserBrand.aggregate([{
            $match: { user: userId, isDeleted: false}
        },
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand"
            }
        }, {
            $unwind: "$brand"
        }, {
            $project: {
                brand: 1,
                products: 1,
                user: 1,
                restaurantUrl: 1,
                isActive: 1
            }
        }]);
        res.json({ "code": "OK", "data": userBrands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
})



router.get('/getCuisines', verify, async (req, res) => {

    try {
        const cuisines = await Cuisine.aggregate([
            {$match: {isDeleted: false}},
            {
                $project: {
                    name: 1,
                    image: 1,
                    isDeleted: 1
                }
            }
        ]);
        res.json({ "code": "OK", "data": cuisines });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.get('/getBrands', verify, async (req, res) => {

    let cuisine_Id = mongoose.Types.ObjectId(req.query.Id);
    try {
        const brands = await Brand.aggregate([{
            $match: { cuisine: cuisine_Id, isDeleted: false }
        }, {
            $project: {
                name: 1,
                description: 1,
                image: 1,
                isDeleted: 1
            }
        }])
        res.json({ "code": "OK", "data": brands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.get('/getProducts', verify, async (req, res) => {

    let brand_Id = mongoose.Types.ObjectId(req.query.Id);
    // var category = mongoose.Types.ObjectId(req.query.category);
    try {
        const products = await Category.aggregate([{
            $match: { brand: brand_Id, isDeleted: false },
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "items"
            }
        }
        ]);

        res.json({ "code": "OK", "data": products });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.post('/createBrand', verify, async (req, res) => {

    const token = req.header('auth-token');
    const userId = await userTokenFilter(token);
    const brandExist = await UserBrand.findOne({ brand: req.body.brand, user: userId });
    if (brandExist) return res.json({ "code": "ERROR", "message": "Brand already exists.." });
    
    const newUser = await UserBrand.create({
        user: userId,
        brand: req.body.brand,
        categories: req.body.categories,
        products: req.body.products,
        restaurantUrl: req.body.url,
    });
    try {
        res.json({ "code": "OK", "data": { user: newUser._id } });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.get('/viewBrand', verify, async (req, res) => {

    let userBrandId = mongoose.Types.ObjectId(req.query.Id);
    let userbrands;
    try {

        userbrands = await UserBrand.aggregate([{
            $match: { _id: userBrandId, isDeleted: false}
        },
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand"
            }
        },{
            $unwind: "$brand"
        },
        {
            $unwind: "$categories"
        },
        {
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "category"
            }
        }, {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "products",
                localField: "category._id",
                foreignField: "category",
                as: "items"
            }
        },{
            $project: {
                brand: 1,
                category: 1,
                items: 1
            }
        }
        ]);
        res.json({ "code": "OK", "data": userbrands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.put('/editBrand', verify, async (req, res) => {

    let userbrandId = mongoose.Types.ObjectId(req.query.Id);
    try {
        const getProducts = req.body.products;
        await UserBrand.updateOne({ _id: userbrandId, isDleted: false },
            { $set: { "products": getProducts } }
        );
        const getneweditBrand = await UserBrand.findById(userbrandId);
        res.json({ "code": "OK", "data": getneweditBrand });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});


router.put('/toggleBrand', verify, async (req, res) => {

    let userbrand_Id = mongoose.Types.ObjectId(req.query.Id);

    try {
        const getUser = req.body.isActive;
        await UserBrand.updateOne({ _id: userbrand_Id, isDeleted: false},
            { $set: { "isActive": getUser } }
        );
        const getdeactiveUserbrand = await UserBrand.findById(userbrand_id);
        res.json({ "code": "OK", "data": getdeactiveUserbrand });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});




module.exports = router;