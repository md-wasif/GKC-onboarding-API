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
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Profile'
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
  },
  productsId: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Product'
  }
  ]
}, {
  timestamps: true
});


module.exports = mongoose.model('UserBrand', userBrandSchema);