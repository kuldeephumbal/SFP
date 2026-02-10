const Enquiry = require('../models/Enquiry');

// Get all enquiries
exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single enquiry
exports.getEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const { name, mobile_number, email, topic, description } = req.body;

        const enquiry = new Enquiry({
            name,
            mobile_number,
            email,
            topic,
            description
        });

        const newEnquiry = await enquiry.save();
        res.status(201).json(newEnquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update enquiry
exports.updateEnquiry = async (req, res) => {
    try {
        const { name, mobile_number, email, topic, description } = req.body;

        const updateData = { name, mobile_number, email, topic, description };

        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
