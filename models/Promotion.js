const mongoose = require('mongoose');


const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    offer: {
        type: String,
        required: true,
    },
    goaltype: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startdate: {
        type: Date,
        default: Date.now,
    },
    enddate: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model('Promotion', promotionSchema);