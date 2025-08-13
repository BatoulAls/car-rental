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

exports.updateWorkingHours = async (req, res) => {
    const vendorId = req.user.id;

    try {
        const user = await User.findOne({
            where: {id: vendorId},
            include: [{model: Vendor, as: 'Vendor'}]
        })

        const vendorr = await Vendor.findOne({
            where: {user_id: vendorId},
        })
        if (!user || !vendorr) {
            return res.status(404).json({"Message": "User not found or not verified."});
        }

        const {shop_open_time, shop_close_time} = req.body;
        const open24FieldPresent = Object.prototype.hasOwnProperty.call(req.body, 'open_24_7');
        const open_24_7 = open24FieldPresent ? Boolean(req.body.open_24_7) : undefined;
        // If not 24/7, ensure both times provided together (optional policy)
        if (open24FieldPresent && open_24_7 === false) {
            if (shop_open_time === undefined || shop_close_time === undefined) {
                return res.status(400).json({
                    message: 'When open_24_7 is false, provide both shop_open_time and shop_close_time.',
                });
            }
        }

        const updates = {};
        if (shop_open_time !== undefined) updates.shop_open_time = shop_open_time;
        if (shop_close_time !== undefined) updates.shop_close_time = shop_close_time;

        if (open24FieldPresent) {
            updates.open_24_7 = open_24_7;
            if (open_24_7 === true) {
                updates.shop_open_time = null;
                updates.shop_close_time = null;
            }
        }

        if (Object.keys(updates).length === 0) return res.status(400).json({message: 'No valid fields to update.'})


        await vendorr.update(updates)

        return res.status(200).json({"Message": "Working Hours Updated successfully.",})
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to update Working Hours', error: err.message});
    }
}

exports.updateProfileImage = async (req, res) => {
    const id = req.user.id;
    const profileImage = req.file;

    const user = await User.findOne({
        where: {id: id},
        include: [{model: Vendor}],
    })

    if (!user) {
        return res.status(404).json({"Message": "User not found or not verified."});
    }

    if (profileImage) {
        user.photo = `/uploads/${profileImage.filename}`;
        await user.save();

        if (user.Vendor) {
            user.Vendor.photo = `/uploads/${profileImage.filename}`;
            await user.Vendor.save();
        }
        return res.status(200).json({"Message": "Profile Image Updated.",})
    } else {
        return res.status(404).json({"Message": "New Profile Image Not Found",})
    }

}

exports.updateVendorStatus = async (req, res) => {
    const id = req.user.id;
    const status = req.body.status;

    const user = await User.findOne({
        where: {id: id},
        include: [{model: Vendor}],
    })

    if (!user) {
        return res.status(404).json({"Message": "User not found or not verified."});
    }
    if (![0, 1].includes(status)) return res.status(400).json({"Message": "New Status is invalid."});

    user.is_active = status
    await user.save();

    if (user.Vendor) {
        user.Vendor.active = status
        await user.Vendor.save();
    }
    return res.status(200).json({"Message": "Vendor Status Updated.",})

}