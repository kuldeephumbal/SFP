const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema(
    {
        topic: { type: String, required: true },
        topic_details: { type: String, required: true },
        location: { type: String, required: true },
        event_date: { type: String, required: true },
        event_time: { type: String, required: true },
        photo: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('UpcomingEvent', upcomingEventSchema);
