const UpcomingEvent = require('../models/upcomigEvent');

// Get all upcoming events
const getUpcomingEvents = async (req, res) => {
    try {
        const events = await UpcomingEvent.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
    }
};

// Get upcoming event by ID
const getUpcomingEvent = async (req, res) => {
    try {
        const event = await UpcomingEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Upcoming event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming event', error: error.message });
    }
};

// Create upcoming event
const createUpcomingEvent = async (req, res) => {
    try {
        const { topic, topic_details, location, event_date, event_time } = req.body;
        if (!topic || !topic_details || !location || !event_date || !event_time) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Event photo is required' });
        }

        const event = new UpcomingEvent({
            topic,
            topic_details,
            location,
            event_date,
            event_time,
            photo: `/uploads/events/${req.file.filename}`
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating upcoming event', error: error.message });
    }
};

// Update upcoming event
const updateUpcomingEvent = async (req, res) => {
    try {
        const event = await UpcomingEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Upcoming event not found' });
        }

        const { topic, topic_details, location, event_date, event_time } = req.body;
        if (topic !== undefined) event.topic = topic;
        if (topic_details !== undefined) event.topic_details = topic_details;
        if (location !== undefined) event.location = location;
        if (event_date !== undefined) event.event_date = event_date;
        if (event_time !== undefined) event.event_time = event_time;
        if (req.file) {
            event.photo = `/uploads/events/${req.file.filename}`;
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating upcoming event', error: error.message });
    }
};

// Delete upcoming event
const deleteUpcomingEvent = async (req, res) => {
    try {
        const event = await UpcomingEvent.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Upcoming event not found' });
        }
        res.json({ message: 'Upcoming event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting upcoming event', error: error.message });
    }
};

module.exports = {
    getUpcomingEvents,
    getUpcomingEvent,
    createUpcomingEvent,
    updateUpcomingEvent,
    deleteUpcomingEvent
};
