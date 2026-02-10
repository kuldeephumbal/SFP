const mongoose = require('mongoose');

const problemRaisedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: false
    },
    document: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProblemRaised', problemRaisedSchema);
