const OurProject = require('../models/ourProject');

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await OurProject.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single project
exports.getProject = async (req, res) => {
    try {
        const project = await OurProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create project
exports.createProject = async (req, res) => {
    try {
        const { topic, topic_details } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        const project = new OurProject({
            topic,
            topic_details,
            photo: `/uploads/projects/${req.file.filename}`
        });

        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const { topic, topic_details } = req.body;

        const updateData = { topic, topic_details };

        if (req.file) {
            updateData.photo = `/uploads/projects/${req.file.filename}`;
        }

        const project = await OurProject.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await OurProject.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
