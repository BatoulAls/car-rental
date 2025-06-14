const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

// Check availability (public)
router.get('/check-availability', bookingController.checkAvailability);

// Preview booking summary (protected)
router.post('/preview', authMiddleware, bookingController.previewBooking);

// Create booking (protected)
router.post('/', authMiddleware, bookingController.createBooking);

// Get current user's bookings (protected)
// router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);

module.exports = router;
