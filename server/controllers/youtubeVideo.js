const YoutubeVideo = require('../models/youtubeVideo');

// Get all YouTube videos
exports.getYoutubeVideos = async (req, res) => {
    try {
        const videos = await YoutubeVideo.find().sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ message: 'Failed to fetch YouTube videos', error: error.message });
    }
};

// Create a new YouTube video
exports.createYoutubeVideo = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.trim()) {
            return res.status(400).json({ message: 'Video URL is required' });
        }

        const video = new YoutubeVideo({ url: url.trim() });
        await video.save();

        res.status(201).json({ message: 'YouTube video created successfully', video });
    } catch (error) {
        console.error('Error creating YouTube video:', error);
        res.status(500).json({ message: 'Failed to create YouTube video', error: error.message });
    }
};

// Update an existing YouTube video
exports.updateYoutubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { url } = req.body;

        if (!url || !url.trim()) {
            return res.status(400).json({ message: 'Video URL is required' });
        }

        const updated = await YoutubeVideo.findByIdAndUpdate(
            id,
            { url: url.trim() },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'YouTube video not found' });
        }

        res.status(200).json({ message: 'YouTube video updated successfully', video: updated });
    } catch (error) {
        console.error('Error updating YouTube video:', error);
        res.status(500).json({ message: 'Failed to update YouTube video', error: error.message });
    }
};

// Delete a YouTube video
exports.deleteYoutubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await YoutubeVideo.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'YouTube video not found' });
        }

        res.status(200).json({ message: 'YouTube video deleted successfully' });
    } catch (error) {
        console.error('Error deleting YouTube video:', error);
        res.status(500).json({ message: 'Failed to delete YouTube video', error: error.message });
    }
};
