const mongoose = require('mongoose');
const moment = require('moment');


const userpromotionSchema = new mongoose.Schema({

    isDeleted: {
        type: Boolean,
        default: false
     },
     startDate: {
         type: String,
          default: moment().format('DD/MM/YYYY')
     },
     endDate: {
         type: String,
          default: moment().format('DD/MM/YYYY')
     },
     isActive: {
         type: Boolean,
         default: false
     },
     user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      promotion: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Promotion'
      },
}, {
    timestamps: true
})


module.exports = mongoose.model('UserPromotion', userpromotionSchema);