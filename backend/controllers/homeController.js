const { Op } = require('sequelize')
const Car = require('../models/Car');
const Vendor = require("../models/Vendor");

exports.getHomeData = async function(req, res){
    try{
        console.log("⚙️  Home API hit");

        const [affordable , luxery, recent , brands] = await Promise.all([
            Car.findAll({where:{price_per_day : {[Op.lte] : 1000 } },limit:4,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ]}),
            Car.findAll({ where: { price_per_day: { [Op.gte]: 500 } }, limit: 4 ,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ]}),
            Car.findAll({ order: [['created_at', 'DESC']], limit: 4,     include: [
                    { model: Vendor, attributes: ['id', 'name', 'phone'] },
                ] }),
            Car.findAll({ attributes: ['brand'], group: ['brand'] })
        ]);
        res.json({
            affordable_cars: affordable,
            luxury_cars: luxery,
            recent_cars: recent,
            brands: brands.map(b => b.brand)
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}