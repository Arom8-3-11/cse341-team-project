//src/routes/ejs-routes.js
// Routes that render EJS pages.
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import { trainsPage } from '../controllers/trains.js';
import { tripsListPage, tripDetailsPage } from '../controllers/trips.js';
import { bookingPage, processBookingRequest } from './book.js';
import confirmationPage from './confirm.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trip list page
router.get('/trips', tripsListPage);

// Book ticket
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);

// Booking confirmation page
router.get('/trips/confirmation/:confirmationId', confirmationPage);

// Trip details page
router.get('/trips/:tripId', tripDetailsPage);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
