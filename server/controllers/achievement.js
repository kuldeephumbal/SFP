const Achievement = require('../models/achievement');

// Get all achievements
const getAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching achievements', error: error.message });
    }
};

// Get single achievement
const getAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching achievement', error: error.message });
    }
};

// Create achievement
const createAchievement = async (req, res) => {
    try {
        const { year, title, description, highlight, impact } = req.body;

        if (!year || !title || !description || !highlight || !impact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const achievement = new Achievement({
            year,
            title,
            description,
            highlight,
            impact
        });

        const savedAchievement = await achievement.save();
        res.status(201).json(savedAchievement);
    } catch (error) {
        res.status(500).json({ message: 'Error creating achievement', error: error.message });
    }
};

// Update achievement
const updateAchievement = async (req, res) => {
    try {
        const { year, title, description, highlight, impact } = req.body;
        const updateData = {};

        if (year !== undefined) updateData.year = year;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (highlight !== undefined) updateData.highlight = highlight;
        if (impact !== undefined) updateData.impact = impact;

        const achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: 'Error updating achievement', error: error.message });
    }
};

// Delete achievement
const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        res.json({ message: 'Achievement deleted successfully', achievement });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting achievement', error: error.message });
    }
};

module.exports = {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement
};
