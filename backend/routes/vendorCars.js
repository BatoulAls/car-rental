const express = require('express');
const router = express.Router();
const { getMyCars } = require('../controllers/vendor/vendorCarController')
const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');

router.use(authMiddleware);               // verifies token
router.use(authRole('vendor')); // checks role

router.get('/my-cars', getMyCars);

module.exports = router;

