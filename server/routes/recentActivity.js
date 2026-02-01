const express = require('express');
const router = express.Router();
const {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} = require('../controllers/recentActivity');

/**
 * @swagger
 * tags:
 *   name: RecentActivity
 *   description: Recent activity management
 */

/**
 * @swagger
 * /api/recent-activity:
 *   get:
 *     summary: Get all recent activities
 *     tags: [RecentActivity]
 *     responses:
 *       200:
 *         description: List of recent activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecentActivity'
 *   post:
 *     summary: Create a new recent activity
 *     tags: [RecentActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity_name
 *             properties:
 *               activity_name:
 *                 type: string
 *                 example: Blood Donation Camp Organized
 *     responses:
 *       201:
 *         description: Activity created
 *       400:
 *         description: Missing activity_name
 */
router.get('/', getActivities);
router.post('/', createActivity);

/**
 * @swagger
 * /api/recent-activity/{id}:
 *   put:
 *     summary: Update a recent activity
 *     tags: [RecentActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity updated
 *       404:
 *         description: Activity not found
 *   delete:
 *     summary: Delete a recent activity
 *     tags: [RecentActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted
 *       404:
 *         description: Activity not found
 */
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

/**
 * @swagger
 * components:
 *   schemas:
 *     RecentActivity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         activity_name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
