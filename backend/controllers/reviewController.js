const Review  = require('../models/Review');
const Booking = require('../models/Booking');
const Car     = require('../models/Car');
const User     = require('../models/User');
const { Op }  = require('sequelize');

exports.createReview = async (req, res) => {
    const { car_id, booking_id, rating, comment } = req.body;
    const userId = req.user.id;

    // 1. validate presence
    if (!car_id || !booking_id || !rating) {
        return res.status(400).json({ error: 'carId, bookingId, and rating are required.' });
    }

    // 2. fetch booking & ensure it belongs to this user and car
    const booking = await Booking.findOne({
        where: {
            id: booking_id,
            car_id: car_id,
            customer_id: userId,
            status: { [Op.in]: ['confirmed', 'completed'] }
        }
    });
    if (!booking) {
        return res.status(403).json({ error: 'Booking not found or not eligible for review.' });
    }

    // 3. (optional) ensure booking has ended
    if (new Date(booking.end_date) > new Date()) {
        return res.status(400).json({ error: 'You can review only after the booking ends.' });
    }

    // 4. create review
    const review = await Review.create({
        car_id: car_id,
        booking_id: booking_id,
        customer_id: userId,
        rating,
        comment
    });

    res.status(201).json({ message: 'Review submitted', review });
};


exports.getCarReviews = async (req, res) => {
    try {
        const car_id = req.params.car_id;
        const page  = +(req.query.page  || 1);
        const limit = +(req.query.limit || 10);
        const offset = (page - 1) * limit;

        // 1. Ensure the car exists
        const car = await Car.findByPk(car_id, { attributes: ['id', 'brand', 'model'] });
        if (!car) return res.status(404).json({ error: 'Car not found' });

        // 2. Fetch paginated reviews
        const { count, rows } = await Review.findAndCountAll({
            where: { car_id: car_id },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'user', attributes: ['id', 'username'] }
            ]
        });

        res.json({
            car: { id: car.id, brand: car.brand, model: car.model },
            totalReviews: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            reviews: rows.map(r => ({
                id      : r.id,
                rating  : r.rating,
                comment : r.comment,
                created : r.created_at,
                user    : r.user
            }))
        });

    } catch (err) {
        console.error('❌ getCarReviews error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
