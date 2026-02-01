const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member');
const { memberUpload } = require('../config/multer');

/**
 * @swagger
 * /api/member:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: List of all members
 *       500:
 *         description: Server error
 */
router.get('/', memberController.getMembers);

/**
 * @swagger
 * /api/member/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member found
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.get('/:id', memberController.getMemberById);

/**
 * @swagger
 * /api/member:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', memberUpload.single('photo'), memberController.createMember);

/**
 * @swagger
 * /api/member/{id}:
 *   put:
 *     summary: Update a member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.put('/:id', memberUpload.single('photo'), memberController.updateMember);

/**
 * @swagger
 * /api/member/{id}:
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', memberController.deleteMember);

module.exports = router;
