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
  isDeleted: {
    type: Boolean,
    default: false
  },
  brands:[
     {type: Schema.Types.ObjectId, ref: 'Brand'}
   ]

},
{
   timestamps: true
});


module.exports = mongoose.model('Product', productSchema);