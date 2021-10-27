const mongoose = require('mongoose');
const atob = require('atob');
const router = require('express').Router();
const Brand = require('../models/Brand');
const Cuisine = require('../models/Cuisine');
const Product = require('../models/Product');
const UserBrand = require('../models/UserBrand');
const authVerification = require('../routes/verifyToken');

const upload = require("../middleware/upload");


const parseJwt = async (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    //console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};



router.get('/getAllBrands', async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    var userBrands;
    try {

        userBrands = await UserBrand.aggregate([{
            $match: { user: userId }
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
        // }, {
        //     $group: {resutaurantName: "$restaurantURL"},
        // },{
        },{
           $project: {
                brand: 1,
                products: 1,
                user: 1,
                // restaurantURL: {
                //     restaurantName: "$restaurantURL" 
                // },
                restaurantURL: 1,
                isActive: 1
           }
        }]);
        res.json({ "code": "OK", "data": userBrands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
})



router.get('/getCuisines', async (req, res) => {

    try {
        const cuisines = await Cuisine.aggregate([
            {
                $project: {
                    name: 1
                }
            }
        ]);
        res.json({ "code": "OK", "data": cuisines });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.get('/getBrands', async (req, res) => {

    var cuisine = mongoose.Types.ObjectId(req.query.cuisine);
    try {
        const brands = await Brand.aggregate([{
            $match: { cuisine: cuisine }
        }, {
            $project: {
                name: 1
            }
        }])
        res.json({ "code": "OK", "data": brands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



// router.get('/getProducts', async (req, res) => {

//     var brand = mongoose.Types.ObjectId(req.query.brand);
//     try{

//         const categories = await Categorie.aggregate([{
//             $match: { brand: brand },
//         }, {
//             $lookup: {
//                 from: "products",
//                 localField: "items",
//                 foreignField: "_id",
//                 as: "products"
//             }
//         }, {
//             $unwind: "$products"
//         }, {
//             $project: {
//                 name: {
//                     "categoriesName": "$name"
//                 },
//                 name: 1,
//                 products: 1
//             }
//         }])
//         res.json({"code": "OK", "data": categories});
//     }catch(error){
//         res.json({"code": "ERROR", message: error.message});
//     }
// })

router.get('/getProducts', async (req, res) => {

    var brand = mongoose.Types.ObjectId(req.query.brand);
    try {
        const products = await Product.aggregate([{
            $match: { brand: brand },
        },
        {
            $group: {_id: "$categories"}
        }
        // {
        //       $group: {_id: {categories: "$categories", items: "$name", description: "$description"}}
        // }])
    ])
        // let itemsArr = []
        // products.forEach((item) => {
        //     itemsArr.push(item.items)
        // })
        // products[0].items = itemsArr
        // products.splice(1);
        res.json({ "code": "OK", "data": products });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});


// router.post('/createProduct', upload.single("file"), async (req, res) => {

//     const brandId = mongoose.Types.ObjectId(req.query.brand);
//     const imgUrl = `http://localhost:5000/${req.file.filename}`;
//     console.log(brandId);
//     console.log(imgUrl);
//     const newProducts = await Product.create ({ 
//         brand: brandId,
//         productName: req.body.name,
//         productPrice: req.body.price,
//         description: req.body.description,
//         img: req.body.imgUrl
//     });
//     try{
//          const productDetails = await newProducts.save();
//          console.log(productDetails);
//          res.json(productDetails);
//     }catch(error){
//         res.json({message: error});
//     }
// });



router.post('/createBrand', authVerification, async (req, res) => {

    const token = req.header('auth-token');
    const filterId = await parseJwt(token);
    const userId = filterId.id;

    const brandExist = await UserBrand.findOne({ brand: req.body.brand, user: userId });
    if (brandExist) return res.status(200).send({ "code": "OK", "message": "Brand already exists.." });

    const newUser = await UserBrand.create({
        user: userId,
        brand: req.body.brand,
        products: req.body.products,
        restaurantURL: req.body.url,
    });
    try {
        const userbrands = await newUser.save();
        res.json({ "code": "OK", "data": { user: newUser._id } });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});




router.get('/viewBrand', async (req, res) => {

    var userBrandId = mongoose.Types.ObjectId(req.query.userBrand);
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
                product: 1
            }
        }
        ]);
        let products = []
        userbrands.forEach((item) => {
            products.push(item.product)
        })
        userbrands[0].product = products
        userbrands.splice(1);
        const getuserbrands = userbrands[0];
        res.json({ "code": "OK", "data": getuserbrands });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});



router.put('/editBrand', async (req, res) => {

    var userbrandId = mongoose.Types.ObjectId(req.query.userBrand);
    try {
        const getProducts = req.body.products;
        await UserBrand.updateOne({ _id: userbrandId },
            { $set: { "products": getProducts } }
        );
        const getneweditBrand = await UserBrand.findById(userbrandId);
        res.json({ "code": "OK", "data": getneweditBrand });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});


router.put('/toggleBrand', async (req, res) => {

    var userinfo_id = mongoose.Types.ObjectId(req.query.userBrandId);

    try {
        const getUser = req.body.isActive;
        await UserBrand.updateOne({ _id: userinfo_id },
            { $set: { "isActive": getUser } }
        );
        const getdeactiveUserbrand = await UserBrand.findById(userinfo_id);
        res.json({ "code": "OK", "data": getdeactiveUserbrand });
    } catch (error) {
        res.json({ "code": "ERROR", message: error.message });
    }
});




module.exports = router;