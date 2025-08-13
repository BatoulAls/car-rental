const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const { getDashboardStats } = require('../controllers/vendor/Dashboard');

router.use(authMiddleware);
router.use(authRole('vendor'));

router.get('/',getDashboardStats);

module.exports = router;