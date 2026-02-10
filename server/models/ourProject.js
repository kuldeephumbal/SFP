const mongoose = require('mongoose');

const ourProjectSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    topic_details: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('OurProject', ourProjectSchema);
