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

exports.createCar = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const {
            name, brand, model, year, price_per_day, seats,
            no_of_doors, bags, transmission, engine_capacity,
            fuel_type, regional_spec, description, color,
            location, mileage_limit, additional_mileage_charge,
            insurance_included, deposit_amount, region_id,
            category_id, feature_ids, tag_ids
        } = req.body;

        const images = req.files; // multer attaches here

        // ✅ Validation
        if (!brand || !model || !year || !price_per_day || !region_id || !category_id) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // ✅ Create tthe car
        const car = await Car.create({
            vendor_id: vendorId,
            name,
            brand,
            model,
            year,
            price_per_day,
            seats,
            no_of_doors,
            bags,
            transmission,
            engine_capacity,
            fuel_type,
            regional_spec,
            description,
            color,
            location,
            mileage_limit,
            additional_mileage_charge,
            insurance_included,
            deposit_amount,
            region_id,
            category_id,

        });

        // ✅ Attach features
        if (Array.isArray(feature_ids) && feature_ids.length > 0) {
            await car.setFeatures(feature_ids);
        }

        // ✅ Attach tags
        if (Array.isArray(tag_ids) && tag_ids.length > 0) {
            await car.setTags(tag_ids);
        }

        if (images && images.length > 0) {
            const mainImageUrl = `/uploads/${images[0].filename}`;

            const imagePromises = images.map((img, index) =>
                CarImage.create({
                    car_id: car.id,
                    image_url: `/uploads/${img.filename}`,
                    is_main: index === 0
                })
            );

            await Promise.all(imagePromises);

            //  Update main photo in Car table
            car.photo = mainImageUrl;
            await car.save();
        }

        res.status(201).json({ message: 'Car created successfully', car });

    } catch (err) {
        console.error('❌ createCar error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};