const mongoose = require('mongoose');


const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    offer: {
        type: String,
        required: true,
    },
    goaltype: {
        type: String,
        required: true,
    },
    // isActive: {
    //     type: Boolean,
    //     default: false
    // },
    startdate: {
        type: Date,
        default: Date.now,
    },
    enddate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
});


module.exports = mongoose.model('Promotion', promotionSchema);