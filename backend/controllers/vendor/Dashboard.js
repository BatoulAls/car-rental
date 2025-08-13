// getTotalCars(vendorId)
const Op = require('sequelize');
const {getTotalCarsByVendor, getActiveCarsByVendor,getTotalBookingByVendor,getMonthlyBookingsByVendor} = require("../../services/dashboardService");


exports.getDashboardStats = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const totalCars = await getTotalCarsByVendor(vendorId);
        const totalActiveCars = await getActiveCarsByVendor(vendorId);
        const totalBooking = await getTotalBookingByVendor(vendorId);
        const MonthlyBooking = await getMonthlyBookingsByVendor(vendorId);

        res.json({
            totalCars,
            totalActiveCars,
            totalBooking,
            MonthlyBooking,
        })
    } catch (err) {
        console.error('getDashboardStats error:', err);
        res.status(500).json({error: 'Server error'});
    }
}