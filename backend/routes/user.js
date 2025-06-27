const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('photo'), userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
