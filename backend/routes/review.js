const express          = require('express');
const router           = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/reviews
router.post('/', authMiddleware, reviewController.createReview);
router.get('/car/:car_id', reviewController.getCarReviews);

module.exports = router;
