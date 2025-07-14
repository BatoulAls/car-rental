const { Op } = require('sequelize');
const Car = require('../../models/Car');
const Feature = require('../../models/Feature');
const Tag = require('../../models/Tag');
const CarImage = require('../../models/CarImage');
const CarCategory = require('../../models/CarCategory');
const Region = require("../../models/Region");

exports.getMyCars = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Car.findAndCountAll({
            where: { vendor_id: vendorId },
            include: [
                {
                    model: Region,
                    as: 'region',
                    attributes: ['id', 'name_en', 'name_ar']
                },
                {
                    model: CarImage,
                    where: { is_main: true },
                    required: false,
                    attributes: ['image_url']
                },
                {
                    model: CarCategory,
                    attributes: ['name']
                },
                {
                    model: Feature,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'type_']
                },
                {
                    model: Tag,
                    as: 'Tags',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            cars: rows
        });

    } catch (err) {
        console.error('❌ getMyCars error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
