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
            status: 'pending', // 'pending', 'confirmed', 'rejected', 'completed' , 'canceled'
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

exports.getMyBookings = async (req, res) => {
    try {
        // --- query-string helpers -------------------------------------------
        const {
            page     = 1,
            limit    = 10,
            status,              // optional → ?status=confirmed
            sort     = 'id',
            order    = 'DESC'    // ASC | DESC
        } = req.query;

        const whereClause = { customer_id: req.user.id };
        if (status) whereClause.status = status;

        // --- main query ------------------------------------------------------
        const { count, rows } = await Booking.findAndCountAll({
            where: whereClause,
            limit: +limit,
            offset: (page - 1) * limit,
            order: [[sort, order]],
            include: [
                {
                    model: Car,
                    attributes: [
                        'id', 'brand', 'model', 'seats', 'bags', 'no_of_doors', 'price_per_day','year','transmission','engine_capacity','regional_spec','description'
                        ,'fuel_type','color','location','mileage_limit','additional_mileage_charge','deposit_amount'
                    ],
                    include: [
                        {
                            model: CarImage,
                            attributes: ['image_url', 'is_main']
                        },
                        {
                            model: CarCategory,
                            attributes: ['name']
                        },
                        {
                            model: Vendor,
                            attributes: ['id', 'name', 'phone']
                        }
                    ]
                }
            ]
        });

        // --- shape the output ------------------------------------------------
        const history = rows.map(b => ({
            booking_id    : b.id,
            status        : b.status,
            payment_method: b.payment_method,
            start_date    : b.start_date,
            end_date      : b.end_date,
            total_price   : b.total_price,
            car: {
                id: b.Car.id,
                brand: b.Car.brand,
                model: b.Car.model,
                year: b.Car.year,
                category: b.Car.CarCategory?.name || null,
                seats: b.Car.seats,
                bags: b.Car.bags,
                no_of_doors: b.Car.no_of_doors,
                price_per_day: b.Car.price_per_day,
                transmission: b.Car.transmission,
                engine_capacity: b.Car.engine_capacity,
                regional_specs: b.Car.regional_specs,
                description: b.Car.description,
                fuel_type: b.Car.fuel_type,
                color: b.Car.color,
                location: b.Car.location,
                mileage_limit: b.Car.mileage_limit,
                additional_mileage_charge: b.Car.additional_mileage_charge,
                deposit_amount: b.Car.deposit_amount,
                images: b.Car.CarImages?.map(img => ({
                    image_url: img.image_url,
                    is_main: img.is_main
                })) || []
            },
            vendor: b.Car.Vendor ? {
                id   : b.Car.Vendor.id,
                name : b.Car.Vendor.name,
                phone: b.Car.Vendor.phone
            } : null,
            createdAt: b.createdAt
        }));

        res.json({
            total      : count,
            page       : +page,
            limit      : +limit,
            totalPages : Math.ceil(count / limit),
            history
        });

    } catch (err) {
        console.error('❌ getMyBookings error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findOne({
            where: { id: bookingId, deletedAt: null },
            include: [
                {
                    model : Car,
                    as    : 'Car',
                    attributes: [
                        'id','brand','model','year','price_per_day','seats','bags',
                        'no_of_doors','transmission','fuel_type','engine_capacity',
                        'regional_spec','description','color','location'
                    ],
                    include: [
                        {
                            model      : CarImage,
                            attributes : ['image_url','is_main']
                        },
                        {
                            model      : CarCategory,
                            attributes : ['name']
                        },
                        {
                            model      : Vendor,
                            attributes : ['id','name','phone']
                        }
                    ]
                }
            ]
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // 🚫  Plain customers may only view their own bookings
        if (booking.user_id !== req.user.id && req.user.role === 'customer') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json({
            booking_id     : booking.id,
            status         : booking.status,
            payment_method : booking.payment_method,
            start_date     : booking.start_date,
            end_date       : booking.end_date,
            total_price    : booking.total_price,
            created_at     : booking.created_at,
            car: {
                ...booking.Car.dataValues,
                category : booking.Car.CarCategory?.name || null,
                images   : booking.Car.CarImages.map(i => ({
                    url     : i.image_url,
                    is_main : i.is_main
                })),
                vendor: booking.Car.Vendor ? {
                    id   : booking.Car.Vendor.id,
                    name : booking.Car.Vendor.name,
                    phone: booking.Car.Vendor.phone
                } : null
            }
        });

    } catch (err) {
        console.error('❌ getBookingDetails error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;

        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                customer_id: userId,              // ✅ ensures customer owns the booking
                status: { [Op.in]: ['pending', 'confirmed'] }
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or cannot be cancelled.' });
        }

        // Optional: disallow cancel if start date already passed
        const now = new Date().toISOString().split('T')[0];
        if (booking.start_date < now) {
            return res.status(400).json({ error: 'Booking has already started and cannot be cancelled.' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully.' });

    } catch (err) {
        console.error('❌ Cancel Booking Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};