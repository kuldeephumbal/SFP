const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);
