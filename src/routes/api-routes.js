//src/routes/api-routes.js
// Routes that expose JSON API endpoints.
import { Router } from 'express';
import { getAllTrains, getTrainById } from '../controllers/trains.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import { getSchedulesForTrip, getSchedulesForTripAndMonth } from '../controllers/schedules.js';
import { getAllBookings } from '../controllers/bookings.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Train:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: series-e353
 *         name:
 *           type: string
 *           example: Series E353 Limited Express
 *         operator:
 *           type: string
 *           example: JR East
 *         imageUrl:
 *           type: string
 *         imageAlt:
 *           type: string
 *         type:
 *           type: string
 *           example: Limited Express
 *         maxSpeedKmh:
 *           type: number
 *           example: 130
 *         capacity:
 *           type: number
 *           example: 482
 *         powerSource:
 *           type: string
 *           example: Electric
 *         bestFor:
 *           type: string
 *         description:
 *           type: string
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: alpine-panorama
 *         name:
 *           type: string
 *           example: Alpine Panorama Express
 *         description:
 *           type: string
 *         region:
 *           type: string
 *           example: central
 *         startStation:
 *           type: string
 *           example: nagoya
 *         endStation:
 *           type: string
 *           example: toyama
 *         duration:
 *           type: string
 *           example: 4.5 hours
 *         distance:
 *           type: number
 *           example: 180
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *         bestSeason:
 *           type: string
 *           example: autumn
 *         operatingMonths:
 *           type: array
 *           items:
 *             type: number
 *         imageUrl:
 *           type: string
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         tripId:
 *           type: string
 *           example: alpine-panorama
 *         departureTime:
 *           type: string
 *           example: "08:30"
 *         arrivalTime:
 *           type: string
 *           example: "13:00"
 *         daysOfWeek:
 *           type: array
 *           items:
 *             type: string
 *           example: [monday, tuesday, wednesday]
 *         status:
 *           type: boolean
 *     Passenger:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: Yuki
 *         lastName:
 *           type: string
 *           example: Tanaka
 *         email:
 *           type: string
 *           example: yuki.tanaka@example.com
 *         phone:
 *           type: string
 *           example: +81 120-555-1234
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: JRA1B2C3D4
 *         scheduleId:
 *           type: number
 *           example: 1
 *         tripId:
 *           type: string
 *           example: alpine-panorama
 *         ticketClass:
 *           type: string
 *           example: premium
 *         selectedDay:
 *           type: string
 *           example: monday
 *         passengers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Passenger'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/trains:
 *   get:
 *     summary: Returns all trains.
 *     tags: [Trains]
 *     responses:
 *       200:
 *         description: A list of trains.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Train'
 *       500:
 *         description: Failed to fetch trains.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trains', getAllTrains);

/**
 * @swagger
 * /api/trains/{id}:
 *   get:
 *     summary: Returns one train by ID.
 *     tags: [Trains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The train ID.
 *     responses:
 *       200:
 *         description: The requested train.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Train'
 *       404:
 *         description: Train not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch train.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trains/:id', getTrainById);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Returns all trips.
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: A list of trips.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Failed to fetch trips.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trips', getAllTrips);

/**
 * @swagger
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Returns the schedules for a trip, optionally filtered by month.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID.
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: >
 *           Optional month number (1-12). Returns the trip's schedules when
 *           the trip operates during that month, otherwise an empty array.
 *     responses:
 *       200:
 *         description: The schedules for the trip.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Invalid month number.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch schedules.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trips/:id/schedules', (req, res) => {
    if (req.query.month !== undefined) {
        return getSchedulesForTripAndMonth(req, res);
    }
    return getSchedulesForTrip(req, res);
});

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Returns one trip by ID.
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID.
 *     responses:
 *       200:
 *         description: The requested trip.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch trip.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trips/:id', getTripById);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Returns all bookings.
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: A list of bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Failed to fetch bookings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/bookings', getAllBookings);

export default router;
