const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, favoriteController.addToFavorites);
router.delete('/:car_id', authMiddleware, favoriteController.removeFromFavorites);
router.get('/', authMiddleware, favoriteController.getFavoriteCars);

module.exports = router;
