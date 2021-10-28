const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
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
   brand: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
   },
   category: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Category'
   }
},
   {
      timestamps: true
   });


module.exports = mongoose.model('Product', productSchema);