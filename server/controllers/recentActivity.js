const RecentActivity = require('../models/recentActivity');

// Get all recent activities
const getActivities = async (req, res) => {
    try {
        const activities = await RecentActivity.find().sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Failed to fetch activities' });
    }
};

// Create a new activity
const createActivity = async (req, res) => {
    try {
        const { activity_name } = req.body;

        if (!activity_name || !activity_name.trim()) {
            return res.status(400).json({ message: 'Activity name is required' });
        }

        const activity = await RecentActivity.create({ activity_name });

        res.status(201).json({
            message: 'Activity created successfully',
            activity,
        });
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ message: 'Failed to create activity' });
    }
};

// Update an activity
const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity_name } = req.body;

        if (!activity_name || !activity_name.trim()) {
            return res.status(400).json({ message: 'Activity name is required' });
        }

        const activity = await RecentActivity.findByIdAndUpdate(
            id,
            { activity_name },
            { new: true }
        );

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json({
            message: 'Activity updated successfully',
            activity,
        });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ message: 'Failed to update activity' });
    }
};

// Delete an activity
const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await RecentActivity.findByIdAndDelete(id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ message: 'Failed to delete activity' });
    }
};

module.exports = {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
};
