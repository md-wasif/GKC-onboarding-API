const mongoose = require('mongoose');


const userBrandSchema = new mongoose.Schema({

  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  restaurantURL: {
    type: Array,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
  },
  products: 
    [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
}, {
  timestamps: true
});


module.exports = mongoose.model('UserBrand', userBrandSchema);