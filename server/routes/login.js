const express = require('express');
const router = express.Router();
const { login, register, getProfile, updateProfile, changePassword, updatePreferences } = require('../controllers/login');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123123
 *           example:
 *             email: admin@gmail.com
 *             password: 123123
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */
// Admin login
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new admin
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: 123123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 default: staff
 *                 example: staff
 *           example:
 *             email: newadmin@cust.com
 *             password: StrongP@ss123
 *             firstName: John
 *             lastName: Doe
 *             role: admin
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Missing email/password/firstName/lastName or password too short
 *       409:
 *         description: Email already registered
 */
// Admin registration
router.post('/register', register);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@cust.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use
 */
router.put('/profile', auth, updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Missing required fields or password too short
 *       401:
 *         description: Current password is incorrect or unauthorized
 *       404:
 *         description: User not found
 */
router.put('/change-password', auth, changePassword);

/**
 * @swagger
 * /api/auth/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               backgroundImage:
 *                 type: string
 *                 example: /uploads/background-12345.jpg
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/preferences', auth, updatePreferences);

module.exports = router;
