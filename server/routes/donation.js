const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation');
const { donationUpload } = require('../config/multer');

/**
 * @swagger
 * /api/donation:
 *   get:
 *     summary: Get all donations
 *     tags: [Donation]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', donationController.getDonations);

/**
 * @swagger
 * /api/donation/{id}:
 *   get:
 *     summary: Get donation by ID
 *     tags: [Donation]
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
router.get('/:id', donationController.getDonation);

/**
 * @swagger
 * /api/donation:
 *   post:
 *     summary: Create donation
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               email:
 *                 type: string
 *               pancard_number:
 *                 type: string
 *               address:
 *                 type: string
 *               amount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               payment_receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
    '/',
    donationUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'payment_receipt', maxCount: 1 }
    ]),
    donationController.createDonation
);

/**
 * @swagger
 * /api/donation/{id}:
 *   put:
 *     summary: Update donation
 *     tags: [Donation]
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
 *               full_name:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               email:
 *                 type: string
 *               pancard_number:
 *                 type: string
 *               address:
 *                 type: string
 *               amount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               payment_receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
    '/:id',
    donationUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'payment_receipt', maxCount: 1 }
    ]),
    donationController.updateDonation
);

/**
 * @swagger
 * /api/donation/{id}:
 *   delete:
 *     summary: Delete donation
 *     tags: [Donation]
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
router.delete('/:id', donationController.deleteDonation);

module.exports = router;
