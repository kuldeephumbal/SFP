const express = require('express');
const router = express.Router();
const {
    getYoutubeVideos,
    createYoutubeVideo,
    updateYoutubeVideo,
    deleteYoutubeVideo
} = require('../controllers/youtubeVideo');

/**
 * @swagger
 * components:
 *   schemas:
 *     YoutubeVideo:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         url:
 *           type: string
 *           description: YouTube video URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/youtube-video:
 *   get:
 *     summary: Get all YouTube videos
 *     tags: [YoutubeVideo]
 *     responses:
 *       200:
 *         description: List of YouTube videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/YoutubeVideo'
 */
router.get('/', getYoutubeVideos);

/**
 * @swagger
 * /api/youtube-video:
 *   post:
 *     summary: Create a new YouTube video
 *     tags: [YoutubeVideo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: YouTube video URL
 *     responses:
 *       201:
 *         description: YouTube video created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createYoutubeVideo);

/**
 * @swagger
 * /api/youtube-video/{id}:
 *   put:
 *     summary: Update a YouTube video
 *     tags: [YoutubeVideo]
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
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: YouTube video updated successfully
 *       404:
 *         description: YouTube video not found
 */
router.put('/:id', updateYoutubeVideo);

/**
 * @swagger
 * /api/youtube-video/{id}:
 *   delete:
 *     summary: Delete a YouTube video
 *     tags: [YoutubeVideo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: YouTube video deleted successfully
 *       404:
 *         description: YouTube video not found
 */
router.delete('/:id', deleteYoutubeVideo);

module.exports = router;
