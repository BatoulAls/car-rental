const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'phone', 'photo', 'role']
    });
    res.json(user);
};

exports.updateProfile = async (req, res) => {
    const { username, phone, photo } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.photo = photo || user.photo;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
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
