const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/Enquiry');

/**
 * @swagger
 * /api/enquiry:
 *   get:
 *     summary: Get all enquiries
 *     tags: [Enquiry]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', enquiryController.getEnquiries);

/**
 * @swagger
 * /api/enquiry/{id}:
 *   get:
 *     summary: Get enquiry by ID
 *     tags: [Enquiry]
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
router.get('/:id', enquiryController.getEnquiry);

/**
 * @swagger
 * /api/enquiry:
 *   post:
 *     summary: Create enquiry
 *     tags: [Enquiry]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               email:
 *                 type: string
 *               topic:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', enquiryController.createEnquiry);

/**
 * @swagger
 * /api/enquiry/{id}:
 *   put:
 *     summary: Update enquiry
 *     tags: [Enquiry]
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
 *               name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               email:
 *                 type: string
 *               topic:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', enquiryController.updateEnquiry);

/**
 * @swagger
 * /api/enquiry/{id}:
 *   delete:
 *     summary: Delete enquiry
 *     tags: [Enquiry]
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
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
