const mongoose = require('mongoose');


const connectDB = async () => {
  try
  {
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex: true
  });

  mongoose.connection.on('error', function(error) {
            console.error('DATABASE CONNECTION ERROR:', error);
          });
          
        mongoose.connection.once('open', function() {
            console.log('DATABASE CONNECTED');
        });

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
  }






module.exports = connectDB;