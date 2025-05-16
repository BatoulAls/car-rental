const { Op , Sequelize } = require('sequelize');
const Car = require('../models/Car');
const Vendor = require('../models/Vendor');
const Region = require('../models/Region');

exports.getAllCars = async (req, res) => {
    try {
        const {
            brand,
            location,
            minPrice,
            maxPrice,
            year,
            transmission,
            fuel_type,
            color,
            seats,
            page = 1,
            limit = 10,
            sort_by,
            sort_order
        } = req.query;

        const whereClause = {};

        if (brand) whereClause.brand = brand;
        if (location) whereClause.location = location;
        if (year) whereClause.year = year;
        if (transmission) whereClause.transmission = transmission;
        if (fuel_type) whereClause.fuel_type = fuel_type;
        if (color) whereClause.color = color;
        if (seats) whereClause.seats = seats;

        if (minPrice || maxPrice) {
            whereClause.price_per_day = {};
            if (minPrice) whereClause.price_per_day[Op.gte] = parseFloat(minPrice);
            if (maxPrice) whereClause.price_per_day[Op.lte] = parseFloat(maxPrice);
        }

        // ✅ Sorting Logic
        let order = [['created_at', 'DESC']]; // default

        if (sort_by === 'price') {
            order = [['price_per_day', sort_order === 'asc' ? 'ASC' : 'DESC']];
        } else if (sort_by === 'year') {
            order = [['year', sort_order === 'asc' ? 'ASC' : 'DESC']];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Car.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order,
            include: [
                { model: Vendor, attributes: ['id', 'name', 'phone'] },
                // { model: CarCategory, attributes: ['id', 'name'] },
                // { model: CarImage, attributes: ['id', 'image_url', 'is_main'] },
                // { model: Feature, through: { attributes: [] } }, // hide join table
                // { model: Tag, through: { attributes: [] } },
            ]
        });

        res.json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
            data: rows
        });

    } catch (err) {
        console.error('❌ Filter error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.getCarFilterOptions = async (req, res) => {
    try {
        const [brands, regions, fuelTypes, transmissions, colors, vendors] = await Promise.all([
            Car.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']] }),
            Region.findAll({ attributes: ['id', 'name_en'] }),
            Car.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('fuel_type')), 'fuel_type']] }),
            Car.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('transmission')), 'transmission']] }),
            Car.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('color')), 'color']] }),
            // CarCategory.findAll({ attributes: ['id', 'name'] }),
            Vendor.findAll({ attributes: ['id', 'name'] })
        ]);

        res.json({
            brands: brands.map(b => b.brand).filter(Boolean),
            regions,
            fuel_types: fuelTypes.map(f => f.fuel_type).filter(Boolean),
            transmissions: transmissions.map(t => t.transmission).filter(Boolean),
            colors: colors.map(c => c.color).filter(Boolean),
            vendors
        });
    } catch (err) {
        console.error('❌ Error in filter options:', err);
        res.status(500).json({ error: 'Server error' });
    }
};