const mongoose = require('mongoose');

const latestActivitySchema = new mongoose.Schema(
    {
        activity_detail: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('LatestActivity', latestActivitySchema);
