const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({

   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: false
   },
   image: {
      type: String,
      required: false
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   cuisine: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Cuisine'
   }
}, {
   timestamps: true
});


module.exports = mongoose.model('Brand', brandSchema);