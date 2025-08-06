const Car = require('../../models/Car');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const {Op, where} = require("sequelize");


exports.getMyBooking = async (req, res) => {
    const vendorId = req.user.id;

    const { status , start_date , end_date } = req.query;
    const whereClause = {}

    if (status) whereClause.status = status;
    if (start_date) {
        whereClause.start_date = { [Op.gt]: start_date };
    }
    if (end_date) {
        whereClause.end_date = { [Op.lt]: end_date };
    }
    const booking = await Booking.findAll(
        {
            where : whereClause,
            include: [{
                model: Car,
                where: { vendor_id : vendorId}
            }, {
                model: User
            }
            ]
        }
    );

    if (!booking) {
        return res.status(404).json({"message": "Booking not found"});
    }
    res.status(201).json(booking);
}

exports.getBooking = async (req, res) => {
    try {

        const BookingId = req.params.bookingId;
        const vendorId = req.user.id;

        const booking = await Booking.findOne({
            where: {id: BookingId },
            include: [
                {
                    model: Car,
                    where: { vendor_id : vendorId}
                },
                {
                    model: User
                }
            ]
        })
        if (!booking) {
            return res.status(404).json({"message": "Booking not found"});
        }
        res.status(201).json(booking);
    }catch(err){
        res.status(500).json({"message": "getBooking Server Error"});
    }
}

exports.updateBooking = async (req, res) => {
    const { bookingId , newstatus} = req.body;
    const vendorId = req.user.id;

    const allowedStatus = [ "confirmed" , "rejected" , "completed" , "canceled" ]
    console.log(newstatus);
    console.log(bookingId);
    if (!allowedStatus.includes(newstatus)) {
            return res.status(400).json({ error: 'Invalid status value.' });
    }
    const booking = await Booking.findOne(
        {
            where: {id: bookingId},
            include: [{model: Car, where: {vendor_id: vendorId}}]
        })
    if(!booking) {
        return res.status(404).json({"message": "Booking not found"});
    }

    if(['completed', 'canceled'].includes(booking.status) ) {
        return res.status(400).json({error: `Cannot update a ${booking.status} booking.`});
    }
        booking.status = newstatus;
        await booking.save();

    res.json({ message: 'Booking status updated successfully.', bookingId: booking.id, newStatus: newstatus });
}