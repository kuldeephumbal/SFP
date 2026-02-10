const express = require('express');
const router = express.Router();
const { uploadBackground, deleteBackground } = require('../controllers/upload');
const auth = require('../middleware/auth');
const { backgroundUpload } = require('../config/multer');

/**
 * @swagger
 * /api/upload/background:
 *   post:
 *     summary: Upload background image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post('/background', auth, backgroundUpload.single('image'), uploadBackground);

/**
 * @swagger
 * /api/upload/background/{filename}:
 *   delete:
 *     summary: Delete background image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/background/:filename', auth, deleteBackground);

module.exports = router;
