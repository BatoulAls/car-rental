const express = require('express');
const router = express.Router();
const metaController = require('../controllers/vendor/metaController');

router.get('/car-categories', metaController.getCarCategories);
router.get('/countries', metaController.getCountries);
router.get('/cities', metaController.getCities);
router.get('/regions', metaController.getRegions);
router.get('/tags', metaController.getTags);
router.get('/features', metaController.getFeatures);

//car-options
router.get('/brands', metaController.getBrands);
router.get('/transmissions', metaController.getTransmissions);
router.get('/fuel-types', metaController.getFuelTypes);
router.get('/engine-capacities', metaController.getEngineCapacities);
router.get('/regional-specs', metaController.getRegionalSpecs);

module.exports = router;
