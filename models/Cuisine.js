const mongoose = require('mongoose');


const cuisineSchema = new mongoose.Schema({

   name: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: false
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
}, {
   timestamps: true
});


module.exports = mongoose.model('Cuisine', cuisineSchema);