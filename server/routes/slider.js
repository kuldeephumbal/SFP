const express = require('express');
const router = express.Router();
const { sliderUpload } = require('../config/multer');
const { getSliders, createSlider, deleteSlider } = require('../controllers/slider');

/**
 * @swagger
 * tags:
 *   name: Slider
 *   description: Slider management
 */

/**
 * @swagger
 * /api/slider:
 *   get:
 *     summary: Get all slider items
 *     tags: [Slider]
 *     responses:
 *       200:
 *         description: List of sliders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slider'
 *   post:
 *     summary: Create a new slider item
 *     tags: [Slider]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - image
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Community Service Initiative 2026
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Slider created
 *       400:
 *         description: Missing topic or image
 */
router.get('/', getSliders);
router.post('/', sliderUpload.single('image'), createSlider);

/**
 * @swagger
 * /api/slider/{id}:
 *   delete:
 *     summary: Delete a slider item
 *     tags: [Slider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slider deleted
 *       404:
 *         description: Slider not found
 */
router.delete('/:id', deleteSlider);

/**
 * @swagger
 * components:
 *   schemas:
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         topic:
 *           type: string
 *         photo:
 *           type: string
 *           description: Public path to the image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
