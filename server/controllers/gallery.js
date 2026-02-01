const Gallery = require('../models/gallery');

// Get all gallery items
const getGalleryItems = async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery items', error: error.message });
    }
};

// Get single gallery item
const getGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery item', error: error.message });
    }
};

// Create gallery item
const createGalleryItem = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const item = new Gallery({
            photo: `/uploads/gallery/${req.file.filename}`
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating gallery item', error: error.message });
    }
};

// Update gallery item
const updateGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        if (req.file) {
            item.photo = `/uploads/gallery/${req.file.filename}`;
        }

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error updating gallery item', error: error.message });
    }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gallery item', error: error.message });
    }
};

module.exports = {
    getGalleryItems,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
};
