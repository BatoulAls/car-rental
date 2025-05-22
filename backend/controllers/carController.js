const { Op , Sequelize } = require('sequelize');
const Car = require('../models/Car');
const Vendor = require('../models/Vendor');
const CarCategory = require('../models/CarCategory');
const Feature = require('../models/Feature');
const CarImage = require('../models/CarImage');
const Tag = require('../models/Tag');
const Region = require('../models/Region');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');


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
            sort_order,
            pickup_date,
            dropoff_date,
        } = req.query;

        const whereClause = {};

        // If no pickup/dropoff, default to today
        const startDate = pickup_date || new Date().toISOString().split('T')[0];
        const endDate = dropoff_date || new Date().toISOString().split('T')[0];

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

        let bookedCarIds = new Set();
        const carIds = rows.map(car => car.id);

        //
        const overlappingBookings = await Booking.findAll({
            where: {
                car_id: carIds,
                [Op.or]: [
                    {
                        start_date: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        end_date: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        start_date: { [Op.lte]: startDate },
                        end_date: { [Op.gte]: endDate }
                    }
                ],
                status: 'confirmed'
            }
        });
        //
        bookedCarIds = new Set(overlappingBookings.map(b => b.car_id));
        const data = rows.map(car => ({
            ...car.toJSON(),
            available: !bookedCarIds.has(car.id)
        }));


        res.json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
            data: data
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

        // ✅ Get availability info from bookings
        const today = new Date().toISOString().split('T')[0];
        const carIds = rows.map(car => car.id);

        const activeBookings = await Booking.findAll({
            where: {
                car_id: carIds,
                start_date: { [Op.lte]: today },
                end_date: { [Op.gte]: today },
                status: 'confirmed'
            }
        });

        const bookedCarIds = new Set(activeBookings.map(b => b.car_id));

        // ✅ Add availability field to each car
        const data = rows.map(car => ({
            ...car.toJSON(),
            available: !bookedCarIds.has(car.id)
        }));
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

exports.getCarById = async (req, res) => {
    try {
        const carId = req.params.id;

        const car = await Car.findOne({
            where: { id: carId },
            include: [
                { model: Vendor, attributes: ['id', 'name', 'phone', 'photo'] },
                { model: CarCategory, attributes: ['id', 'name'] },
                { model: CarImage, attributes: ['image_url'] },
                { model: Feature, through: { attributes: [] }, attributes: ['name','type_'] },
                { model: Tag, through: { attributes: [] }, attributes: ['name'] }
            ]
        });

        if (!car) return res.status(404).json({ error: 'Car not found' });

        // Check availability
        const today = new Date().toISOString().split('T')[0];

        const isBooked = await Booking.findOne({
            where: {
                car_id: carId,
                start_date: { [Op.lte]: today },
                end_date: { [Op.gte]: today },
                status: 'confirmed'
            }
        });

        const available = !isBooked;

        // Get reviews
        const reviews = await Review.findAll({
            where: { car_id: carId },
            include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
            order: [['created_at', 'DESC']],
            limit: 3
        });

        const allRatings = await Review.findAll({
            where: { car_id: carId },
            attributes: ['rating']
        });

        const ratingValues = allRatings.map(r => r.rating);
        const averageRating = ratingValues.length
            ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
            : null;

        const reviewCount = ratingValues.length;

        // ✅ Group features by type
        const groupedFeatures = {};
        car.Features.forEach(feature => {
            console.log(feature);
            const type = feature.type_ || 'other';
            if (!groupedFeatures[type]) {
                groupedFeatures[type] = [];
            }
            groupedFeatures[type].push(feature.name);
        });

        // Construct clean response
        res.json({
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            regional_spec: car.regional_spec,
            location: car.location,
            category: car.CarCategory,
            price_per_day: car.price_per_day,
            mileage_limit: car.mileage_limit,
            additional_mileage_charge: car.additional_mileage_charge,
            insurance_included: car.insurance_included || true,
            available: available,
            overview: car.description,
            images: car.CarImages.map(img => img.image_url),
            features: groupedFeatures,
            tags: car.Tags.map(t => t.name),
            vendor: {
                id: car.Vendor.id,
                name: car.Vendor.name,
                phone: car.Vendor.phone,
                photo: car.Vendor.photo,
            },
            average_rating: averageRating,
            review_count: reviewCount,
            reviews: reviews.map(r => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                created_at: r.created_at,
                user: r.user
            }))
        });

    } catch (err) {
        console.error('❌ getCarById error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getSimilarCars = async (req, res) => {
    try {
        const carId = req.params.id;

        const currentCar = await Car.findByPk(carId);
        if (!currentCar) return res.status(404).json({ error: 'Car not found' });

        const similarCars = await Car.findAll({
            where: {
                id: { [Op.ne]: carId }, // exclude current car
                [Op.or]: [
                    { brand: currentCar.brand },
                    { category_id: currentCar.category_id }
                ]
            },
            limit: 4,
            include: [
                {
                    model: CarCategory,
                    attributes: ['name']
                },
                {
                    model: CarImage,
                    where: { is_main: true },
                    required: false, // in case no main image
                    attributes: ['image_url']
                }
            ],
            attributes: ['id', 'brand', 'model', 'seats', 'bags', 'no_of_doors', 'price_per_day']
        });

        const result = similarCars.map(car => ({
            id: car.id,
            brand: car.brand,
            model: car.model,
            category: car.CarCategory ? car.CarCategory.name : null,
            seats: car.seats,
            bags: car.bags,
            no_of_doors: car.no_of_doors,
            price_per_day: car.price_per_day,
            photo: car.CarImages?.[0]?.image_url || null
        }));

        res.json(result);
    } catch (err) {
        console.error('❌ getSimilarCars error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
