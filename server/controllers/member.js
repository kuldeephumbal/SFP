const Member = require('../models/member');

// Get all members
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch members', error: error.message });
    }
};

// Get single member by ID
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch member', error: error.message });
    }
};

// Create new member
exports.createMember = async (req, res) => {
    try {
        const { name, status } = req.body;

        if (!name || !status) {
            return res.status(400).json({ message: 'Name and status are required' });
        }

        const photoPath = req.file ? `/uploads/members/${req.file.filename}` : null;

        const newMember = new Member({
            name,
            status,
            photo: photoPath
        });

        const savedMember = await newMember.save();
        res.status(201).json({ member: savedMember, message: 'Member created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create member', error: error.message });
    }
};

// Update member
exports.updateMember = async (req, res) => {
    try {
        const { name, status } = req.body;
        const memberId = req.params.id;

        if (!name || !status) {
            return res.status(400).json({ message: 'Name and status are required' });
        }

        const updateData = { name, status };
        if (req.file) {
            updateData.photo = `/uploads/members/${req.file.filename}`;
        }

        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ member: updatedMember, message: 'Member updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update member', error: error.message });
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        const deletedMember = await Member.findByIdAndDelete(memberId);

        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete member', error: error.message });
    }
};
