const express = require('express');
const router = express.Router();
const { getAllCars , getCarFilterOptions , getCarById , getSimilarCars } = require('../controllers/carController');

router.get('/', getAllCars); // GET /api/cars?page=1&limit=10
router.get('/options', getCarFilterOptions); // ✅ /api/cars/options


router.get('/:id', getCarById); // GET /api/cars/5
router.get('/:id/similar', getSimilarCars); // GET /api/cars/5

module.exports = router;

