const MemberApplication = require('../models/memberApply');
const Member = require('../models/member');

// Get all applications
exports.getApplications = async (req, res) => {
    try {
        const applications = await MemberApplication.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single application
exports.getApplication = async (req, res) => {
    try {
        const application = await MemberApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create application
exports.createApplication = async (req, res) => {
    try {
        const {
            organization_name,
            name,
            gender,
            date_of_birth,
            relation_type,
            relation_name,
            profession,
            blood_group,
            state,
            district,
            mobile_number,
            aadhar_number,
            address,
            pin_code,
            email,
            id_type
        } = req.body;

        if (!req.files || !req.files.id_document) {
            return res.status(400).json({ message: 'ID document is required' });
        }

        const idDocFile = Array.isArray(req.files.id_document)
            ? req.files.id_document[0]
            : req.files.id_document;

        const profileFile = req.files.image
            ? (Array.isArray(req.files.image) ? req.files.image[0] : req.files.image)
            : null;

        const otherDocFile = req.files.other_document
            ? (Array.isArray(req.files.other_document) ? req.files.other_document[0] : req.files.other_document)
            : null;

        const application = new MemberApplication({
            organization_name,
            name,
            gender,
            date_of_birth,
            relation_type,
            relation_name,
            profession,
            blood_group,
            state,
            district,
            mobile_number,
            aadhar_number,
            address,
            pin_code,
            email,
            id_type,
            profile_picture: profileFile ? `/uploads/member-applications/${profileFile.filename}` : null,
            id_document: `/uploads/member-applications/${idDocFile.filename}`,
            other_document: otherDocFile ? `/uploads/member-applications/${otherDocFile.filename}` : null
        });

        const newApplication = await application.save();
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update application
exports.updateApplication = async (req, res) => {
    try {
        const {
            organization_name,
            name,
            gender,
            date_of_birth,
            relation_type,
            relation_name,
            profession,
            blood_group,
            state,
            district,
            mobile_number,
            aadhar_number,
            address,
            pin_code,
            email,
            id_type,
            status
        } = req.body;

        const updateData = {};

        if (organization_name !== undefined) updateData.organization_name = organization_name;
        if (name !== undefined) updateData.name = name;
        if (gender !== undefined) updateData.gender = gender;
        if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
        if (relation_type !== undefined) updateData.relation_type = relation_type;
        if (relation_name !== undefined) updateData.relation_name = relation_name;
        if (profession !== undefined) updateData.profession = profession;
        if (blood_group !== undefined) updateData.blood_group = blood_group;
        if (state !== undefined) updateData.state = state;
        if (district !== undefined) updateData.district = district;
        if (mobile_number !== undefined) updateData.mobile_number = mobile_number;
        if (aadhar_number !== undefined) updateData.aadhar_number = aadhar_number;
        if (address !== undefined) updateData.address = address;
        if (pin_code !== undefined) updateData.pin_code = pin_code;
        if (email !== undefined) updateData.email = email;
        if (id_type !== undefined) updateData.id_type = id_type;
        if (status !== undefined) updateData.status = status;

        const existingApplication = await MemberApplication.findById(req.params.id);
        if (!existingApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (req.files && req.files.image) {
            const profileFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;
            updateData.profile_picture = `/uploads/member-applications/${profileFile.filename}`;
        }

        if (req.files && req.files.id_document) {
            const idDocFile = Array.isArray(req.files.id_document)
                ? req.files.id_document[0]
                : req.files.id_document;
            updateData.id_document = `/uploads/member-applications/${idDocFile.filename}`;
        }

        if (req.files && req.files.other_document) {
            const otherDocFile = Array.isArray(req.files.other_document)
                ? req.files.other_document[0]
                : req.files.other_document;
            updateData.other_document = `/uploads/member-applications/${otherDocFile.filename}`;
        }

        const application = await MemberApplication.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (updateData.status === 'accepted' && existingApplication.status !== 'accepted') {
            const existingMember = await Member.findOne({ name: existingApplication.name });
            if (!existingMember) {
                await Member.create({
                    name: existingApplication.name,
                    status: 'Member',
                    photo: existingApplication.profile_picture || null
                });
            }
        }

        res.json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await MemberApplication.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
