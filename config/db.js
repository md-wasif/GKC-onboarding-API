const mongoose = require('mongoose');
//require('dotenv/config');


const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex: true
  });
mongoose.connection.once('open', function(){
    console.log('connection with mongodb is established....');
}).on(function(error) {
    console.log('error while connecting with mongodb', error);
});
}






module.exports = connectDB;