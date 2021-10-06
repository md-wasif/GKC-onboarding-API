const mongoose = require('mongoose');


const cuisineSchema = new mongoose.Schema({

     name = {
         type: String, 
         required: true
     },
     createdAt: {
        type: Date,
        default: Date.now
     },
     updatedAt: {
      type: Date,
      default: Date.now
   },
   isDeleted: {
     type: Boolean,
     default: false
   }
});


module.exports = mongoose.model('Cuisine', cuisineSchema);