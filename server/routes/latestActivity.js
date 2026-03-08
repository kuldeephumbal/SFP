const express = require('express');
const router = express.Router();
const { latestActivityUpload } = require('../config/multer');
const {
    getLatestActivities,
    getLatestActivityById,
    createLatestActivity,
    updateLatestActivity,
    deleteLatestActivity
} = require('../controllers/latestActivity');

/**
 * @swagger
 * components:
 *   schemas:
 *     LatestActivity:
 *       type: object
 *       required:
 *         - activity_detail
 *         - photo
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         activity_detail:
 *           type: string
 *           description: Description of the latest activity
 *         photo:
 *           type: string
 *           description: Path to activity image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/latest-activity:
 *   get:
 *     summary: Get all latest activities
 *     tags: [LatestActivity]
 *     responses:
 *       200:
 *         description: List of latest activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LatestActivity'
 */
router.get('/', getLatestActivities);
router.get('/:id', getLatestActivityById);

/**
 * @swagger
 * /api/latest-activity:
 *   post:
 *     summary: Create a new latest activity
 *     tags: [LatestActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - activity_detail
 *               - image
 *             properties:
 *               activity_detail:
 *                 type: string
 *                 description: Description of the activity
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Activity image file
 *     responses:
 *       201:
 *         description: Latest activity created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', latestActivityUpload.single('image'), createLatestActivity);

/**
 * @swagger
 * /api/latest-activity/{id}:
 *   put:
 *     summary: Update a latest activity
 *     tags: [LatestActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               activity_detail:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Latest activity updated successfully
 *       404:
 *         description: Latest activity not found
 */
router.put('/:id', latestActivityUpload.single('image'), updateLatestActivity);

/**
 * @swagger
 * /api/latest-activity/{id}:
 *   delete:
 *     summary: Delete a latest activity
 *     tags: [LatestActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest activity deleted successfully
 *       404:
 *         description: Latest activity not found
 */
router.delete('/:id', deleteLatestActivity);

module.exports = router;
