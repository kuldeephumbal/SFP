const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema(
    {
        activity_name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('RecentActivity', recentActivitySchema);
