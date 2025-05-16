const express = require('express');
const router = express.Router();
const { getAllCars , getCarFilterOptions } = require('../controllers/carController');

router.get('/', getAllCars); // GET /api/cars?page=1&limit=10
router.get('/options', getCarFilterOptions); // ✅ /api/cars/options

module.exports = router;

