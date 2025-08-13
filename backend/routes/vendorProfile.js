const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const {getMyProfile , updateMyProfile , updateWorkingHours , updateProfileImage , updateVendorStatus} = require("../controllers/vendor/profileController");
const upload = require("../middleware/upload");

router.use(authMiddleware);
router.use(authRole('vendor'));

router.get('/',getMyProfile);
router.put('/',upload.fields([{ name: 'photo' }, { name:'background'}]) , updateMyProfile);
router.patch('/update_workingHours',updateWorkingHours);
router.patch('/update_profileImage',upload.single('profileImage'), updateProfileImage);
router.patch('/update_status',updateVendorStatus);

module.exports = router;