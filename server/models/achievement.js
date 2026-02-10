const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        highlight: {
            type: String,
            required: true
        },
        impact: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Achievement', achievementSchema);
