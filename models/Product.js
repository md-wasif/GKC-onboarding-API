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
      required: true
   },
   img: { 
      data: Buffer, 
      contentType: String 
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   brand:{
      type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
   }
},
   {
      timestamps: true
   });


module.exports = mongoose.model('Product', productSchema);