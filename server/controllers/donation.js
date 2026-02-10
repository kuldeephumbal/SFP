const Donation = require('../models/donation');

// Get all donations
exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single donation
exports.getDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create donation
exports.createDonation = async (req, res) => {
    try {
        const {
            full_name,
            mobile_number,
            email,
            pancard_number,
            address,
            amount
        } = req.body;

        if (!req.files || !req.files.payment_receipt) {
            return res.status(400).json({ message: 'Payment receipt is required' });
        }

        const paymentReceiptFile = Array.isArray(req.files.payment_receipt)
            ? req.files.payment_receipt[0]
            : req.files.payment_receipt;

        const photoFile = req.files.image
            ? (Array.isArray(req.files.image) ? req.files.image[0] : req.files.image)
            : null;

        const donation = new Donation({
            full_name,
            mobile_number,
            email,
            pancard_number,
            address,
            amount,
            payment_receipt: `/uploads/donations/${paymentReceiptFile.filename}`,
            photo: photoFile ? `/uploads/donations/${photoFile.filename}` : null
        });

        const newDonation = await donation.save();
        res.status(201).json(newDonation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update donation
exports.updateDonation = async (req, res) => {
    try {
        const {
            full_name,
            mobile_number,
            email,
            pancard_number,
            address,
            amount
        } = req.body;

        const updateData = {
            full_name,
            mobile_number,
            email,
            pancard_number,
            address,
            amount
        };

        if (req.files && req.files.payment_receipt) {
            const paymentReceiptFile = Array.isArray(req.files.payment_receipt)
                ? req.files.payment_receipt[0]
                : req.files.payment_receipt;
            updateData.payment_receipt = `/uploads/donations/${paymentReceiptFile.filename}`;
        }

        if (req.files && req.files.image) {
            const photoFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;
            updateData.photo = `/uploads/donations/${photoFile.filename}`;
        }

        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json(donation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete donation
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
