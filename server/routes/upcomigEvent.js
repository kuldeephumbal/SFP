const express = require('express');
const {
    getUpcomingEvents,
    getUpcomingEvent,
    createUpcomingEvent,
    updateUpcomingEvent,
    deleteUpcomingEvent
} = require('../controllers/upcomigEvent');
const { upcomingEventUpload } = require('../config/multer');

const router = express.Router();

/**
 * @swagger
 * /api/upcoming-event:
 *   get:
 *     summary: Get all upcoming events
 *     tags: [UpcomingEvent]
 *     responses:
 *       200:
 *         description: List of upcoming events
 */
router.get('/', getUpcomingEvents);

/**
 * @swagger
 * /api/upcoming-event/{id}:
 *   get:
 *     summary: Get an upcoming event by ID
 *     tags: [UpcomingEvent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upcoming event details
 *       404:
 *         description: Upcoming event not found
 */
router.get('/:id', getUpcomingEvent);

/**
 * @swagger
 * /api/upcoming-event:
 *   post:
 *     summary: Create a new upcoming event
 *     tags: [UpcomingEvent]
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
 *               event_date:
 *                 type: string
 *               event_time:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upcoming event created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', upcomingEventUpload.single('photo'), createUpcomingEvent);

/**
 * @swagger
 * /api/upcoming-event/{id}:
 *   put:
 *     summary: Update an upcoming event
 *     tags: [UpcomingEvent]
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
 *               event_date:
 *                 type: string
 *               event_time:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upcoming event updated successfully
 *       404:
 *         description: Upcoming event not found
 */
router.put('/:id', upcomingEventUpload.single('photo'), updateUpcomingEvent);

/**
 * @swagger
 * /api/upcoming-event/{id}:
 *   delete:
 *     summary: Delete an upcoming event
 *     tags: [UpcomingEvent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upcoming event deleted successfully
 *       404:
 *         description: Upcoming event not found
 */
router.delete('/:id', deleteUpcomingEvent);

module.exports = router;
