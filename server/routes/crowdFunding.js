const express = require('express');
const {
    getCrowdFundingItems,
    getCrowdFundingItem,
    createCrowdFundingItem,
    updateCrowdFundingItem,
    deleteCrowdFundingItem
} = require('../controllers/crowdFunding');
const { crowdFundingUpload } = require('../config/multer');

const router = express.Router();

/**
 * @swagger
 * /api/crowdfunding:
 *   get:
 *     summary: Get all crowdfunding items
 *     tags: [CrowdFunding]
 *     responses:
 *       200:
 *         description: List of crowdfunding items
 */
router.get('/', getCrowdFundingItems);

/**
 * @swagger
 * /api/crowdfunding/{id}:
 *   get:
 *     summary: Get a crowdfunding item by ID
 *     tags: [CrowdFunding]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crowdfunding item details
 *       404:
 *         description: Crowdfunding item not found
 */
router.get('/:id', getCrowdFundingItem);

/**
 * @swagger
 * /api/crowdfunding:
 *   post:
 *     summary: Create a new crowdfunding item
 *     tags: [CrowdFunding]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               topic_details:
 *                 type: string
 *               location:
 *                 type: string
 *               raised_amount:
 *                 type: number
 *               end_date:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Crowdfunding item created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', crowdFundingUpload.single('photo'), createCrowdFundingItem);

/**
 * @swagger
 * /api/crowdfunding/{id}:
 *   put:
 *     summary: Update a crowdfunding item
 *     tags: [CrowdFunding]
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
 *               topic:
 *                 type: string
 *               topic_details:
 *                 type: string
 *               location:
 *                 type: string
 *               raised_amount:
 *                 type: number
 *               end_date:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Crowdfunding item updated successfully
 *       404:
 *         description: Crowdfunding item not found
 */
router.put('/:id', crowdFundingUpload.single('photo'), updateCrowdFundingItem);

/**
 * @swagger
 * /api/crowdfunding/{id}:
 *   delete:
 *     summary: Delete a crowdfunding item
 *     tags: [CrowdFunding]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crowdfunding item deleted successfully
 *       404:
 *         description: Crowdfunding item not found
 */
router.delete('/:id', deleteCrowdFundingItem);

module.exports = router;
