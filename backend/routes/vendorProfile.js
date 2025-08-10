const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const {getMyProfile , updateMyProfile} = require("../controllers/vendor/profileController");
const upload = require("../middleware/upload");

router.use(authMiddleware);
router.use(authRole('vendor'));

router.get('/',getMyProfile);
// router.put('/',upload.single('photo'),  updateMyProfile);
router.put('/',upload.fields([{ name: 'photo' }, { name:'background'}]) , updateMyProfile);

module.exports = router;