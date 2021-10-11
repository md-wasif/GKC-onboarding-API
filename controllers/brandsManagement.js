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

    //console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};



//GET /getAllBrands get all brands for user...
router.get('/getAllBrands', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    //const userId = ObjectId(filterId.id);
    const userId = mongoose.Types.ObjectId(filterId.id)
    var userBrands;
    try {

        userBrands = await UserBrand.aggregate([{
            $match: { profile: userId }
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
        }]);
        //const userBrands = await UserBrand.find({});
        res.json(userBrands);
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



//GET /getProducts get all products for brand..
router.get('/getProducts', async (req, res) => {

    var brand = req.query.brand;
    try {
        const products = await Product.find({ brand: brand }).select("-isDeleted -brand");
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
    try {
        const userbrands = await UserBrand.save();
        console.log(userbrands);
        res.json(userbrands);
    } catch (error) {
        res.json({ message: error });
    }
});



router.get('/getAllBrands/:id', async (req, res) => {

    try {
        const getallbrand = await UserBrand.findById(req.params.id);

        res.json(getallbrand);
    } catch (error) {
        res.json({ message: error });
    }
});



//GET /viewBrand get brand and products from userBrand.
router.get('/viewBrand', async (req, res) => {

    var userBrandId = mongoose.Types.ObjectId(req.query.userBrand);
    console.log(userBrandId);
    var userbrands;
    try {

        userbrands = await UserBrand.aggregate([{
            $match: { _id: userBrandId }
        },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "product"
            }
        }, {
            $unwind: "$product"
        },{
            $lookup: {
                from: "brands",
                localField: "product.brand",
                foreignField: "_id",
                as: "brand"
            }
        }, {
            $unwind: "$brand"
        }
        ]);
        console.log(userbrands);
        res.json(userbrands);
    } catch (error) {
        res.json({ message: error });
    }
});



//UPDATE /editBrand  update userbrand...
// router.put('/editBrand', async (req, res) => {

//     var userbrandId = mongoose.Types.ObjectId(req.query.userBrand);
//     //var productId = mongoose.Types.ObjectId(req.query.product);
//     //var editbrand;
//     try{
//          await UserBrand.updateOne({
//              _id: userbrandId}, //mongoose.Types.ObjectId(req.query.userBrand)},
//              req.body
//          );
//          const geteditbrand = await UserBrand.findOne({});
//          res.json(geteditbrand);
//       //console.log(editBrand);
//     }catch(error){
//         res.json({message: error});
//     }
// });


module.exports = router;