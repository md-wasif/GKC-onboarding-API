const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({

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
   },
   cuisines:[
      {type: Schema.Types.ObjectId, ref: 'Cuisine'}
    ]
});


module.exports = mongoose.model('Brand', brandSchema);