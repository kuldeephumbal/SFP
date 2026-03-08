const LatestActivity = require('../models/latestActivity');

// Get all latest activities
exports.getLatestActivities = async (req, res) => {
    try {
        const activities = await LatestActivity.find().sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error fetching latest activities:', error);
        res.status(500).json({ message: 'Failed to fetch latest activities', error: error.message });
    }
};

// Get single latest activity by ID
exports.getLatestActivityById = async (req, res) => {
    try {
        const activity = await LatestActivity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Latest activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        console.error('Error fetching latest activity:', error);
        res.status(500).json({ message: 'Failed to fetch latest activity', error: error.message });
    }
};

// Create a new latest activity
exports.createLatestActivity = async (req, res) => {
    try {
        console.log('Create Activity Request:', {
            body: req.body,
            file: req.file ? req.file.filename : 'No file'
        });
        const { activity_detail } = req.body;

        if (!activity_detail) {
            return res.status(400).json({ message: 'Activity detail is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const newActivity = new LatestActivity({
            activity_detail,
            photo: `/uploads/latest-activity/${req.file.filename}`
        });

        await newActivity.save();
        res.status(201).json({ message: 'Latest activity created successfully', activity: newActivity });
    } catch (error) {
        console.error('Error creating latest activity:', error);
        res.status(500).json({
            message: 'Failed to create latest activity',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update a latest activity
exports.updateLatestActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity_detail } = req.body;

        const updateData = {};

        if (activity_detail) {
            updateData.activity_detail = activity_detail;
        }

        if (req.file) {
            updateData.photo = `/uploads/latest-activity/${req.file.filename}`;
        }

        const updatedActivity = await LatestActivity.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Latest activity not found' });
        }

        res.status(200).json({ message: 'Latest activity updated successfully', activity: updatedActivity });
    } catch (error) {
        console.error('Error updating latest activity:', error);
        res.status(500).json({ message: 'Failed to update latest activity', error: error.message });
    }
};

// Delete a latest activity
exports.deleteLatestActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedActivity = await LatestActivity.findByIdAndDelete(id);

        if (!deletedActivity) {
            return res.status(404).json({ message: 'Latest activity not found' });
        }

        res.status(200).json({ message: 'Latest activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting latest activity:', error);
        res.status(500).json({ message: 'Failed to delete latest activity', error: error.message });
    }
};
