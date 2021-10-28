const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
      },
}, {
    timestamps: true
});


module.exports = mongoose.model('Category', categorySchema);