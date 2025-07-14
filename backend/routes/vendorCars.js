const express = require('express');
const router = express.Router();
const { getMyCars, createCar} = require('../controllers/vendor/vendorCarController')
const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const upload = require('../middleware/upload');


router.use(authMiddleware);               // verifies token
router.use(authRole('vendor')); // checks role

router.get('/my-cars', getMyCars);
router.post('/cars/create', upload.array('images', 7), createCar);
module.exports = router;

