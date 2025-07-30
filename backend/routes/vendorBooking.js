const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const {getMyBooking , getBooking} = require("../controllers/vendor/bookingController");


router.use(authMiddleware);
router.use(authRole('vendor'));


router.get('/', getMyBooking);
router.get('/:bookingId', getBooking);

module.exports = router;