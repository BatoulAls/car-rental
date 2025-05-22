const { Op, Sequelize } = require('sequelize');
const Car = require('../models/Car');

exports.getAllBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get distinct brands
        const brandsResult = await Car.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']],
            raw: true
        });

        const allBrands = brandsResult.map(b => b.brand).filter(Boolean);
        allBrands.sort((a, b) => a.localeCompare(b));
        const total = allBrands.length;
        const paginatedBrands = allBrands.slice(offset, offset + limit);

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            brands: paginatedBrands
        });

    } catch (err) {
        console.error('❌ Error fetching brands:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
