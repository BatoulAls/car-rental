const Vendor = require('../models/Vendor');
const Region = require('../models/Region');
const User = require('../models/User');

exports.getAllVendors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;


        const { count, rows: vendors } = await Vendor.findAndCountAll({
            include: [
                {
                    model: Region,
                    attributes: ['id', 'name_en', 'name_ar']
                },
                {
                    model: User,
                    attributes: ['id', 'email']
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']], // optional sorting
        });

        res.json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page,
            vendors
        });


    } catch (err) {
        console.error('❌ Error fetching vendors:', err);
        res.status(500).json({ error: 'Server error' });
    }
};




exports.getVendorById = async (req, res) => {
    try {
        const vendorId = req.params.id;

        const vendor = await Vendor.findOne({
            where: { id: vendorId },
            include: [
                {
                    model: Region,
                    attributes: ['id', 'name_en', 'name_ar']
                },
                {
                    model: User,
                    attributes: ['id', 'email']
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json({
            id: vendor.id,
            name: vendor.name,
            phone: vendor.phone,
            verified: vendor.verified,
            active: vendor.active,
            photo: vendor.photo,
            background_image: vendor.background_image,
            description: vendor.description,
            shop_open_time: vendor.shop_open_time,
            shop_close_time: vendor.shop_close_time,
            open_24_7: vendor.open_24_7,
            email: vendor.User?.email || null,
            region: vendor.Region ? {
                id: vendor.Region.id,
                name_en: vendor.Region.name_en,
                name_ar: vendor.Region.name_ar
            } : null
        });

    } catch (err) {
        console.error('❌ Error fetching vendor details:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
