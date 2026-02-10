const express = require('express');
const router = express.Router();
const {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement
} = require('../controllers/achievement');

/**
 * @swagger
 * /api/achievement:
 *   get:
 *     summary: Get all achievements
 *     responses:
 *       200:
 *         description: List of all achievements
 *   post:
 *     summary: Create a new achievement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               highlight:
 *                 type: string
 *               impact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Achievement created successfully
 *
 * /api/achievement/{id}:
 *   get:
 *     summary: Get achievement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Achievement details
 *   put:
 *     summary: Update achievement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Achievement updated
 *   delete:
 *     summary: Delete achievement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Achievement deleted
 */

// GET all achievements
router.get('/', getAchievements);

// GET single achievement
router.get('/:id', getAchievement);

// POST create achievement
router.post('/', createAchievement);

// PUT update achievement
router.put('/:id', updateAchievement);

// DELETE achievement
router.delete('/:id', deleteAchievement);

module.exports = router;
