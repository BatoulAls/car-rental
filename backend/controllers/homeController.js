const { Op } = require('sequelize')
const Car = require('../models/Car');
const Vendor = require("../models/Vendor");
const Region = require("../models/Region");
const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');


exports.getHomeData = async function(req, res){
    try{
        console.log("⚙️  Home API hit");

        const [regions, affordable , luxery, recent , brands,reviews] = await Promise.all([
            Region.findAll({ attributes: ['id', 'name_en'] }),
            Car.findAll({where:{price_per_day : {[Op.lte] : 1000 } },limit:4,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ]}),
            Car.findAll({ where: { price_per_day: { [Op.gte]: 500 } }, limit: 4 ,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ]}),
            Car.findAll({ order: [['created_at', 'DESC']], limit: 4,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ] }),
            Car.findAll({ attributes: ['brand'], group: ['brand'] }),
            Review.findAll({ order: [['created_at', 'DESC']], limit: 2 ,  include: [
                    { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
                ]})

        ]);

        // ✅ Step 1: Combine all car IDs
        const allCars = [...affordable, ...luxery, ...recent];
        const allCarIds = [...new Set(allCars.map(car => car.id))];

        // ✅ Step 2: Get active bookings for today
        const today = new Date().toISOString().split('T')[0];
        const bookings = await Booking.findAll({
            where: {
                car_id: allCarIds,
                start_date: { [Op.lte]: today },
                end_date: { [Op.gte]: today },
                status: 'confirmed'
            }
        });
        const bookedCarIds = new Set(bookings.map(b => b.car_id));

        // ✅ Step 3: Annotate each car with `available: true/false`
        const markAvailability = carList =>
            carList.map(car => ({
                ...car.toJSON(),
                available: !bookedCarIds.has(car.id)
            }));


        res.json({
            regions: regions,
            affordable_cars: markAvailability(affordable),
            luxury_cars: markAvailability(luxery),
            recent_cars: markAvailability(recent),
            brands: brands.map(b => b.brand),
            reviews: reviews,
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}