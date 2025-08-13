const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { Op } = require('sequelize');

const getTotalCarsByVendor = async (vendorId) => {
    try {
        const count = await Car.count({ where: { vendor_id: vendorId } });
        return count;
    } catch (err) {
        console.error('getTotalCarsByVendor error:', err);
        return 0; // fallback
    }
}

const getActiveCarsByVendor = async (vendorId) => {
    try {
        const count = await Car.count({ where:
                { vendor_id: vendorId ,
                    isActive: true
                } });
        return count;
    } catch (err) {
        console.error('getTotalCarsByVendor error:', err);
        return 0; // fallback
    }
}

const getTotalBookingByVendor = async (vendorId) => {
    try {
        const count = await Booking.count({
            include: [{
                model: Car,
                where: { vendor_id : vendorId}
            }]
        });
        return count;
    } catch (err) {
        console.error('getTotalCarsByVendor error:', err);
        return 0; // fallback
    }
}

// Bookings created in the current month
const getMonthlyBookingsByVendor = async (vendorId) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const count = await Booking.count({
            where: {
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lt]: endOfMonth
                }
            },
            include: [{
                model: Car,
                where: { vendor_id: vendorId },
                attributes: []
            }]
        });

        return count;
    } catch (err) {
        console.error('getMonthlyBookingsByVendor error:', err);
        return 0;
    }
};




module.exports = {
    getTotalCarsByVendor,
    getActiveCarsByVendor,
    getTotalBookingByVendor,
    getMonthlyBookingsByVendor
};