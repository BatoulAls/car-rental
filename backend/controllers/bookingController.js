const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const Vendor = require("../models/Vendor");
const CarCategory = require("../models/CarCategory");
const CarImage = require("../models/CarImage");
const Feature = require("../models/Feature");
const Tag = require("../models/Tag");

exports.checkAvailability = async (req, res) => {
    try {
        const { car_id, start_date, end_date } = req.query;

        if (!car_id) return res.status(400).json({ error: 'car_id is required' });

        // Step 1: Get all confirmed bookings for this car
        const bookings = await Booking.findAll({
            where: {
                car_id,
                status: 'confirmed',
                deletedAt: null
            },
            attributes: ['start_date', 'end_date']
        });

        // Step 2: Check if selected range overlaps any existing one
        let available = true;

        if (start_date && end_date) {
            const conflict = bookings.find(b =>
                new Date(start_date) <= new Date(b.end_date) &&
                new Date(end_date) >= new Date(b.start_date)
            );
            available = !conflict;
        }

        // Step 3: Return result
        res.json({
            available,
            booked_dates: bookings
        });

    } catch (err) {
        console.error('❌ Availability check error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.previewBooking = async (req, res) => {
    try {
        const { car_id, start_date, end_date } = req.body;

        if (!car_id || !start_date || !end_date) {
            return res.status(400).json({ error: 'car_id, start_date, and end_date are required' });
        }

        // 1. Get the car
        // const car = await Car.findByPk(car_id, {
        //     attributes: ['id', 'brand', 'model', 'price_per_day'],
        // });

        const car = await Car.findOne({
            where: { id: car_id },
            include: [
                { model: Vendor, attributes: ['id', 'name', 'phone', 'photo'] },
                { model: CarCategory, attributes: ['id', 'name'] },
                { model: CarImage, attributes: ['image_url'] },
                { model: Feature, through: { attributes: [] }, attributes: ['name','type_'] },
                { model: Tag, through: { attributes: [] }, attributes: ['name'] }
            ]
        });

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // 2. Check for conflicts
        const conflicts = await Booking.findAll({
            where: {
                car_id,
                status: 'confirmed',
                deletedAt: null,
                [Op.or]: [
                    {
                        start_date: { [Op.between]: [start_date, end_date] }
                    },
                    {
                        end_date: { [Op.between]: [start_date, end_date] }
                    },
                    {
                        start_date: { [Op.lte]: start_date },
                        end_date: { [Op.gte]: end_date }
                    }
                ]
            }
        });

        if (conflicts.length > 0) {
            return res.json({ available: false, message: 'Selected dates are already booked.' });
        }

        // 3. Calculate number of days
        const s = new Date(start_date);
        const e = new Date(end_date);
        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.ceil((e - s) / msPerDay) + 1;

        if (days <= 0) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        const total_price = days * car.price_per_day;

        // 4. Return summary
        res.json({
            available: true,
            car: car,
            booking_summary: {
                start_date,
                end_date,
                days,
                price_per_day: car.price_per_day,
                total_price
            },
            payment_methods: ['Cash', 'Card', 'Online']
        });

    } catch (err) {
        console.error('❌ Preview error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { car_id, start_date, end_date, payment_method } = req.body;

        if (!car_id || !start_date || !end_date || !payment_method) {
            return res.status(400).json({ error: 'car_id, start_date, end_date, and payment_method are required.' });
        }

        const car = await Car.findByPk(car_id);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        // Check for conflicts
        const conflicts = await Booking.findOne({
            where: {
                car_id,
                status: 'confirmed',
                deletedAt: null,
                [Op.or]: [
                    { start_date: { [Op.between]: [start_date, end_date] } },
                    { end_date: { [Op.between]: [start_date, end_date] } },
                    {
                        start_date: { [Op.lte]: start_date },
                        end_date: { [Op.gte]: end_date }
                    }
                ]
            }
        });

        if (conflicts) {
            return res.status(400).json({ error: 'Car is not available for selected dates.' });
        }

        // Calculate price
        const s = new Date(start_date);
        const e = new Date(end_date);
        const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;

        if (days <= 0) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        const total_price = days * car.price_per_day;

        // Create booking
        const booking = await Booking.create({
            car_id,
            customer_id: req.user.id, // from auth middleware
            start_date,
            end_date,
            total_price,
            status: 'pending', // or 'confirmed' if no payment
            payment_method
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                id: booking.id,
                car_id,
                start_date,
                end_date,
                days,
                total_price,
                status: booking.status,
                payment_method
            }
        });

    } catch (err) {
        console.error('❌ Create booking error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};