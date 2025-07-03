const Favorite = require('../models/Favorite');
const Car = require('../models/Car');
const User = require('../models/User');
const CarImage = require('../models/CarImage');
const CarCategory = require('../models/CarCategory');
const Feature = require('../models/Feature');
const Tag = require("../models/Tag");
const Vendor = require("../models/Vendor");

exports.addToFavorites = async (req, res) => {
    try {
        const { car_id } = req.body;
        const userId = req.user.id;

        await Favorite.findOrCreate({
            where: { user_id: userId, car_id: car_id }
        });

        res.json({ message: 'Added to favorites' });

    } catch (err) {
        console.error('❌ addToFavorites error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const { carId } = req.params;
        const userId = req.user.id;

        await Favorite.destroy({
            where: { user_id: userId, car_id: carId }
        });

        res.json({ message: 'Removed from favorites' });

    } catch (err) {
        console.error('❌ removeFromFavorites error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getFavoriteCars = async (req, res) => {
    try {
        const userId = req.user.id;

        const cars = await Car.findAll({
            include: [
                {
                    model: User,
                    as: 'FavoritedByUsers',
                    where: { id: req.user.id }, // only cars favorited by this user
                    attributes: [],             // don’t return user info
                    through: { attributes: [] }
                },
                {
                    model: CarImage,
                    where: { is_main: true },
                    required: false,
                    attributes: ['image_url']
                },
                {
                    model: CarCategory
                },{
                model: Feature,
                through: { attributes: [] },
                attributes: ['name','type_']
                },
                { model: Tag, through: { attributes: [] }, attributes: ['name'] },
                { model: Vendor, attributes: ['id', 'name', 'phone', 'photo'] },

            ]
        });


        res.json(cars);

    } catch (err) {
        console.error('❌ getFavoriteCars error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
