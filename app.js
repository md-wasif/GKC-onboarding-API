const express  =  require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const connectDB = require('./config/db');


const app = express();


dotenv.config({path:'./config/config.env'});

connectDB();


const authRoute = require('./routes/auth');
// const usercontroller = require('./controllers/users');
const userManagementcontroller = require('./controllers/usersManagement');
const brandManagementcontroller = require('./controllers/brandsManagement');
const promotioncontroller = require('./controllers/promotionsController');

//Middlewares
app.use(express.json());
app.use(cors());


//Route Middlewares
app.use('/', authRoute);
app.use('/', userManagementcontroller);  //User Managment..
app.use('/', brandManagementcontroller); //Brand Management
app.use('/', promotioncontroller);       //Promotion
// app.use('/api/users', usercontroller);   //SignUp





//Listen On Server
const PORT = process.env.PORT || 5000; 

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));