const express = require('express');
const { getGalleryItems, getGalleryItem, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/gallery');
const { galleryUpload } = require('../config/multer');

const router = express.Router();

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: List of gallery items
 */
router.get('/', getGalleryItems);

/**
 * @swagger
 * /api/gallery/{id}:
 *   get:
 *     summary: Get a gallery item by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gallery item details
 *       404:
 *         description: Gallery item not found
 */
router.get('/:id', getGalleryItem);

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery item
 *     tags: [Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', galleryUpload.single('photo'), createGalleryItem);

/**
 * @swagger
 * /api/gallery/{id}:
 *   put:
 *     summary: Update a gallery item
 *     tags: [Gallery]
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
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Gallery item updated successfully
 *       404:
 *         description: Gallery item not found
 */
router.put('/:id', galleryUpload.single('photo'), updateGalleryItem);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery item
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gallery item deleted successfully
 *       404:
 *         description: Gallery item not found
 */
router.delete('/:id', deleteGalleryItem);

module.exports = router;
