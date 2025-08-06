const Op = require('sequelize');
const User = require('../../models/User');
const Vendor = require('../../models/Vendor');
const Region = require('../../models/Region');

exports.getMyProfile = async (req, res) => {
    try {
        const vendor = await User.findOne({
            attributes: ['id', 'username', 'email', 'phone', 'photo', 'role', 'is_active'],
            where: { id: req.user.id,
                is_verified: true },
            include: [{
                model: Vendor,
                attributes: [
                    'id', 'name', 'phone', 'background_image', 'photo', 'description',
                    'shop_open_time', 'shop_close_time', 'open_24_7'
                ],
                include: [{ model: Region }]
            }]
        });

        // Check if vendor exists
        if (!vendor) {
            return res.status(404).json({
                status: 'error',
                message: 'Vendor profile not found or not verified.',
            });
        }

        // Success
        return res.status(200).json({
            status: 'success',
            message: 'Vendor profile retrieved successfully.',
            data: vendor,
        });

    } catch (error) {
        // Optional: log the error for debugging
        console.error('Error fetching vendor profile:', error);

        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while retrieving the vendor profile.',
        });
    }
};
