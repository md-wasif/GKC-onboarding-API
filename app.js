const express  =  require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const connectDB = require('./config/db');

const app = express();


dotenv.config({path:'./config/config.env'});

connectDB();


const authRoute = require('./routes/auth');
const usercontroller = require('./controllers/users');

//Middlewares
app.use(express.json());


//Route Middlewares
app.use('/', authRoute);
app.use('/api/users', usercontroller);




//Listen On Server
const PORT = process.env.PORT || 5000; 

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));