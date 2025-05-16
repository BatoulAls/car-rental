const { Op } = require('sequelize')
const Car = require('../models/Car');
const Vendor = require("../models/Vendor");
const Region = require("../models/Region");
const Review = require('../models/Review');
const User = require('../models/User');


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
        res.json({
            regions: regions,
            affordable_cars: affordable,
            luxury_cars: luxery,
            recent_cars: recent,
            brands: brands.map(b => b.brand),
            reviews: reviews,
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}