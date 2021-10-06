const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name = {
        type: String, 
        required: true
    },
    price = {
        type: Number,
        required: true
    },
    description = {
       tyep: String
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
  },
  brands:[
     {type: Schema.Types.ObjectId, ref: 'Brand'}
   ]

});


module.exports = mongoose.model('Product', productSchema);