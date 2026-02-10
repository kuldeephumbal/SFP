const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    pancard_number: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    payment_receipt: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
