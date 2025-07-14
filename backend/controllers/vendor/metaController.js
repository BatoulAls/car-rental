const { Op, Sequelize } = require('sequelize');
const Feature = require("../../models/Feature");
const Tag = require("../../models/Tag");
const Car = require("../../models/Car");
const Region = require("../../models/Region");
const City = require("../../models/City");
const Country = require("../../models/Country");
const CarCategory = require("../../models/CarCategory");

exports.getCarCategories = async (req, res) => {
    const categories = await CarCategory.findAll({ attributes: ['id', 'name'] });
    res.json(categories);
};

exports.getCities = async (req, res) => {
    const whereClause = {};
    if (req.query.country_id) {
        whereClause.country_id = req.query.country_id;
    }

    const cities = await City.findAll({
        where: whereClause,
        attributes: ['id', 'name_en', 'name_ar', 'country_id']
    });

    res.json(cities);
};


exports.getRegions = async (req, res) => {
    const { city_id } = req.query;
    const whereClause = city_id ? { city_id } : {};

    const regions = await Region.findAll({
        where: whereClause,
        attributes: ['id', 'name_en', 'name_ar', 'city_id']
    });

    res.json(regions);
};

exports.getCountries = async (req, res) => {
    const countries = await Country.findAll({ attributes: ['id', 'name_en', 'name_ar'] });
    res.json(countries);
};

exports.getTags = async (req, res) => {
    const tags = await Tag.findAll({ attributes: ['id', 'name'] });
    res.json(tags);
};

exports.getFeatures = async (req, res) => {
    const features = await Feature.findAll({ attributes: ['id', 'name', 'type_'] });
    res.json(features);
};

exports.getBrands = async (req, res) => {
    const defaultBrands = [
        'BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Nissan',
        'Kia', 'Hyundai', 'Chevrolet', 'Ford', 'Mazda', 'Lexus'
    ];

    const dbBrands = await Car.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']],
        where: { brand: { [Op.not]: null } }
    });

    const dynamic = dbBrands.map(b => b.brand);
    const combined = [...new Set([...defaultBrands, ...dynamic])].sort();

    res.json(combined);
};


exports.getTransmissions = (req, res) => {
    res.json(['Automatic', 'Manual']);
};

exports.getFuelTypes = (req, res) => {
    res.json(['Petrol', 'Diesel', 'Hybrid', 'Electric']);
};

exports.getEngineCapacities = (req, res) => {
    res.json(['1.5L', '2.0L', '2.5L', '3.0L', '4.0L']);
};

exports.getRegionalSpecs = (req, res) => {
    res.json(['GCC', 'American', 'European', 'Japanese']);
};
