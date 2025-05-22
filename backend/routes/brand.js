const express = require('express');
const router = express.Router();
const { getAllBrands } = require('../controllers/brandController');

router.get('/', getAllBrands); // /api/brands

module.exports = router;