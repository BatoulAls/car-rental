const Op = require('sequelize');
const User = require('../../models/User');
const Vendor = require('../../models/Vendor');
const Region = require('../../models/Region');

exports.getMyProfile = async (req, res) => {
    try {
        const vendor = await User.findOne({
            attributes: ['id', 'username', 'email', 'phone', 'photo', 'role', 'is_active'],
            where: {
                id: req.user.id,
                is_verified: true
            },
            include: [{
                model: Vendor,
                attributes: [
                    'id', 'name', 'phone', 'background_image', 'photo', 'description',
                    'shop_open_time', 'shop_close_time', 'open_24_7'
                ],
                include: [{model: Region}]
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


exports.updateMyProfile = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(req.user);
        const {
            username,
            phone,
            is_active,
            name,
            background_image,
            description,
            shop_open_time,
            shop_close_time,
            open_24_7,
            region_id
        } = req.body;
        const photo = req.files?.photo?.[0];
        const bgphoto = req.files?.background?.[0];
        const user = await User.findByPk(id, {
            include: [{model: Vendor}]
        })


        if (username)
            user.username = username;
        if (phone) {
            user.phone = phone;
            user.Vendor.phone = phone;
        }
        if (is_active) {
            user.is_active = is_active;
            user.Vendor.active = is_active;
        }
        if (name)
            user.Vendor.name = name;
        if (description)
            user.Vendor.description = description;
        if (shop_open_time)
            user.Vendor.shop_open_time = shop_open_time;
        if (shop_close_time)
            user.Vendor.shop_close_time = shop_close_time;
        if (open_24_7)
            user.Vendor.open_24_7 = open_24_7;
        if (region_id)
            user.Vendor.region_id = region_id;

        if (photo) {
            user.photo = `/uploads/${photo.filename}`; // save relative path
            user.Vendor.photo = `/uploads/${photo.filename}`;
        }
        if (bgphoto) {
            user.Vendor.background_image = `/uploads/${bgphoto.filename}`;
        }
        await user.save();
        await user.Vendor.save();

        return res.status(200).json({"Message": "User Updated successfully", user: user});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to update profile', error: err.message});
    }
}