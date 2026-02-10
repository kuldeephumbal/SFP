const mongoose = require('mongoose');

const crowdFundingSchema = new mongoose.Schema(
    {
        topic: { type: String, required: true },
        topic_details: { type: String, required: true },
        location: { type: String, required: true },
        raised_amount: { type: Number, required: true },
        end_date: { type: String, required: true },
        photo: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('CrowdFunding', crowdFundingSchema);
