// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.reset_token = token;
        user.reset_token_expiry = expiry;
        await user.save();

        const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

        // Configure nodemailer (for dev, use ethereal.email or your SMTP)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        });

        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expiry: { [require('sequelize').Op.gte]: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_token = null;
        user.reset_token_expiry = null;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};



exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ error: 'Incorrect current password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};