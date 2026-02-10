const path = require('path');
const fs = require('fs');

// POST /api/upload/background
// Upload background image
exports.uploadBackground = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the file path/URL
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/upload/background/:filename
// Delete background image
exports.deleteBackground = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
