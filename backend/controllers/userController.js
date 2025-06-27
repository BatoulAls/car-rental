const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'phone', 'photo', 'role']
    });
    res.json(user);
};

exports.updateProfile = async (req, res) => {
    try {
    const { username, phone } = req.body;
    const photo = req.file; // comes from multer

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username?.trim() || user.username;
    user.phone = phone?.trim() || user.phone;

    if (photo) {
        user.photo = `/uploads/${photo.filename}`; // save relative path
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
};
