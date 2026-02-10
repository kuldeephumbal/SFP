const ProblemRaised = require('../models/problemRaised');

// Get all problems
exports.getProblems = async (req, res) => {
    try {
        const problems = await ProblemRaised.find().sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single problem
exports.getProblem = async (req, res) => {
    try {
        const problem = await ProblemRaised.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create problem
exports.createProblem = async (req, res) => {
    try {
        const { name, mobile_number, city, message, description, video_url } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Document is required' });
        }

        const problem = new ProblemRaised({
            name,
            mobile_number,
            city,
            message,
            description,
            video_url,
            document: `/uploads/problems/${req.file.filename}`
        });

        const newProblem = await problem.save();
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update problem
exports.updateProblem = async (req, res) => {
    try {
        const { name, mobile_number, city, message, description, video_url } = req.body;

        const updateData = {
            name,
            mobile_number,
            city,
            message,
            description,
            video_url
        };

        if (req.file) {
            updateData.document = `/uploads/problems/${req.file.filename}`;
        }

        const problem = await ProblemRaised.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json(problem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete problem
exports.deleteProblem = async (req, res) => {
    try {
        const problem = await ProblemRaised.findByIdAndDelete(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
