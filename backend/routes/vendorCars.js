const express = require('express');
const router = express.Router();
const { getMyCars, createCar , getMyCarDetails , updateMyCar , updateCarImages , deleteCar} = require('../controllers/vendor/vendorCarController')
const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const upload = require('../middleware/upload');


router.use(authMiddleware);               // verifies token
router.use(authRole('vendor')); // checks role

router.get('/my-cars', getMyCars);
router.post('/cars/create', upload.array('images', 7), createCar);
router.get('/car/:carId', getMyCarDetails);
router.put('/car/:carId', updateMyCar);
router.put('/car/:carId/images', upload.array('images', 7) // allow up to 7 images,
, updateCarImages);
router.delete('/car/:carId',  deleteCar);


module.exports = router;

