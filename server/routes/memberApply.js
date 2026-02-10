const express = require('express');
const router = express.Router();
const memberApplyController = require('../controllers/memberApply');
const { memberApplicationUpload } = require('../config/multer');

/**
 * @swagger
 * /api/member-application:
 *   get:
 *     summary: Get all member applications
 *     tags: [Member Application]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', memberApplyController.getApplications);

/**
 * @swagger
 * /api/member-application/{id}:
 *   get:
 *     summary: Get member application by ID
 *     tags: [Member Application]
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
router.get('/:id', memberApplyController.getApplication);

/**
 * @swagger
 * /api/member-application:
 *   post:
 *     summary: Create member application
 *     tags: [Member Application]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               organization_name:
 *                 type: string
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *               relation_type:
 *                 type: string
 *               relation_name:
 *                 type: string
 *               profession:
 *                 type: string
 *               blood_group:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               aadhar_number:
 *                 type: string
 *               address:
 *                 type: string
 *               pin_code:
 *                 type: string
 *               email:
 *                 type: string
 *               id_type:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               id_document:
 *                 type: string
 *                 format: binary
 *               other_document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
    '/',
    memberApplicationUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'id_document', maxCount: 1 },
        { name: 'other_document', maxCount: 1 }
    ]),
    memberApplyController.createApplication
);

/**
 * @swagger
 * /api/member-application/{id}:
 *   put:
 *     summary: Update member application
 *     tags: [Member Application]
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
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               id_document:
 *                 type: string
 *                 format: binary
 *               other_document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
    '/:id',
    memberApplicationUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'id_document', maxCount: 1 },
        { name: 'other_document', maxCount: 1 }
    ]),
    memberApplyController.updateApplication
);

/**
 * @swagger
 * /api/member-application/{id}:
 *   delete:
 *     summary: Delete member application
 *     tags: [Member Application]
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
router.delete('/:id', memberApplyController.deleteApplication);

module.exports = router;
