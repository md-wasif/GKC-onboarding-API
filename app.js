const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


const app = express();


dotenv.config({ path: './config/config.env' });

connectDB();

const userController = require('./controllers/UserController');
const brandController = require('./controllers/BrandController');
const userbrandController = require('./controllers/UserBrandController');
const promotionController = require('./controllers/PromotionController');

//Middlewares
app.use(express.json());
app.use(cors());


//Route Middlewares
app.use('/', userController);
app.use('/', brandController);
app.use('/', userbrandController);
app.use('/', promotionController);

module.exports = app;


