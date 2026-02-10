const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/login');

// POST /api/auth/login
// Body: { email, password }
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret not configured' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/auth/register
// Body: { email, password, firstName, lastName, role }
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role || 'staff'
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered successfully',
            user: {
                id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/auth/profile
// Get logged-in user profile
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt
        });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/auth/profile
// Update logged-in user profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'First name, last name, and email are required' });
        }

        // Check if email is already taken by another user
        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase().trim(),
            _id: { $ne: req.user.id }
        });

        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const admin = await Admin.findByIdAndUpdate(
            req.user.id,
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim()
            },
            { new: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/auth/change-password
// Change user password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/auth/preferences
// Update user preferences (background image)
exports.updatePreferences = async (req, res) => {
    try {
        const { backgroundImage } = req.body;

        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store background image preference
        // For now, we'll just return success. You can extend the Admin model to include preferences
        res.json({
            message: 'Preferences updated successfully',
            backgroundImage: backgroundImage
        });
    } catch (err) {
        console.error('Update preferences error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

