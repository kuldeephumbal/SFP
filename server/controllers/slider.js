const Slider = require('../models/slider');

// Get all sliders
const getSliders = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ createdAt: -1 });
        res.json(sliders);
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).json({ message: 'Failed to fetch sliders' });
    }
};

// Create a new slider
const createSlider = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const photoPath = `/uploads/slider/${req.file.filename}`;

        const slider = await Slider.create({ topic, photo: photoPath });

        res.status(201).json({
            message: 'Slider created successfully',
            slider,
        });
    } catch (error) {
        console.error('Error creating slider:', error);
        res.status(500).json({ message: 'Failed to create slider' });
    }
};

// Delete a slider by ID
const deleteSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await Slider.findByIdAndDelete(id);

        if (!slider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.json({ message: 'Slider deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider:', error);
        res.status(500).json({ message: 'Failed to delete slider' });
    }
};

module.exports = {
    getSliders,
    createSlider,
    deleteSlider,
};
