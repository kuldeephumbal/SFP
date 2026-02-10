const CrowdFunding = require('../models/crowdFunding');

// Get all crowd funding items
const getCrowdFundingItems = async (req, res) => {
    try {
        const items = await CrowdFunding.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching crowdfunding items', error: error.message });
    }
};

// Get crowd funding item by ID
const getCrowdFundingItem = async (req, res) => {
    try {
        const item = await CrowdFunding.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Crowdfunding item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching crowdfunding item', error: error.message });
    }
};

// Create crowd funding item
const createCrowdFundingItem = async (req, res) => {
    try {
        const { topic, topic_details, location, raised_amount, end_date } = req.body;
        if (!topic || !topic_details || !location || !raised_amount || !end_date) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        const item = new CrowdFunding({
            topic,
            topic_details,
            location,
            raised_amount,
            end_date,
            photo: `/uploads/crowdfunding/${req.file.filename}`
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating crowdfunding item', error: error.message });
    }
};

// Update crowd funding item
const updateCrowdFundingItem = async (req, res) => {
    try {
        const item = await CrowdFunding.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Crowdfunding item not found' });
        }

        const { topic, topic_details, location, raised_amount, end_date } = req.body;
        if (topic !== undefined) item.topic = topic;
        if (topic_details !== undefined) item.topic_details = topic_details;
        if (location !== undefined) item.location = location;
        if (raised_amount !== undefined) item.raised_amount = raised_amount;
        if (end_date !== undefined) item.end_date = end_date;
        if (req.file) {
            item.photo = `/uploads/crowdfunding/${req.file.filename}`;
        }

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error updating crowdfunding item', error: error.message });
    }
};

// Delete crowd funding item
const deleteCrowdFundingItem = async (req, res) => {
    try {
        const item = await CrowdFunding.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Crowdfunding item not found' });
        }
        res.json({ message: 'Crowdfunding item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting crowdfunding item', error: error.message });
    }
};

module.exports = {
    getCrowdFundingItems,
    getCrowdFundingItem,
    createCrowdFundingItem,
    updateCrowdFundingItem,
    deleteCrowdFundingItem
};
