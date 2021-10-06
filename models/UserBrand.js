const mongoose = require('mongoose');


const userBrandSchema = new mongoose.Schema({

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
   isActive: {
     type: Boolean,
     default: false
   },
   users:[
      {type: Schema.Types.ObjectId, ref: 'User'}
   ],
    brands:[
     {type: Schema.Types.ObjectId, ref: 'Brand'}
   ],
    products:[
     {type: Schema.Types.ObjectId, ref: 'Product'}
   ]   
});


module.exports = mongoose.model('UserBrand', userBrandSchema);