const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const {getMyProfile} = require("../controllers/vendor/profileController");

router.use(authMiddleware);
router.use(authRole('vendor'));

router.get('/',getMyProfile);

module.exports = router;