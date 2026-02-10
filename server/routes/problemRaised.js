const express = require('express');
const router = express.Router();
const problemRaisedController = require('../controllers/problemRaised');
const { problemRaisedUpload } = require('../config/multer');

/**
 * @swagger
 * /api/problem-raised:
 *   get:
 *     summary: Get all problems
 *     tags: [Problem Raised]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', problemRaisedController.getProblems);

/**
 * @swagger
 * /api/problem-raised/{id}:
 *   get:
 *     summary: Get problem by ID
 *     tags: [Problem Raised]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', problemRaisedController.getProblem);

/**
 * @swagger
 * /api/problem-raised:
 *   post:
 *     summary: Create a new problem
 *     tags: [Problem Raised]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               city:
 *                 type: string
 *               message:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', problemRaisedUpload.single('document'), problemRaisedController.createProblem);

/**
 * @swagger
 * /api/problem-raised/{id}:
 *   put:
 *     summary: Update problem
 *     tags: [Problem Raised]
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
 *               name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               city:
 *                 type: string
 *               message:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', problemRaisedUpload.single('document'), problemRaisedController.updateProblem);

/**
 * @swagger
 * /api/problem-raised/{id}:
 *   delete:
 *     summary: Delete problem
 *     tags: [Problem Raised]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', problemRaisedController.deleteProblem);

module.exports = router;
