const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vendor_id: {
        type: DataTypes.INTEGER,
    },
    region_id: {
        type: DataTypes.INTEGER,
    },
    category_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price_per_day: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    no_of_doors: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transmission: {
        type: DataTypes.STRING,
        allowNull: true
    },
    engine_capacity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    regional_spec: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Gcc'
    },
    fuel_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    availability_status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false //  Not active by default
    },
    average_rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0
    },
    review_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    mileage_limit: {
        type: DataTypes.INTEGER,
    },
    additional_mileage_charge: {
        type: DataTypes.DOUBLE,
    },
    insurance_included: {
        type: DataTypes.BOOLEAN,
    },
    deposit_amount: {
        type: DataTypes.DOUBLE,
    }


}, {
    tableName: 'cars',
    timestamps: true // manually managing timestamps
    ,paranoid: true
});

module.exports = Car;

const Feature = require('./Feature');
Car.belongsToMany(Feature, {
    through: 'car_feature_mapping',
    foreignKey: 'car_id'
});

const Tag = require('./Tag');
Car.belongsToMany(Tag, {
    through: 'car_tags',
    foreignKey: 'car_id'
});

const CarCategory = require('./CarCategory');
Car.belongsTo(CarCategory, { foreignKey: 'category_id' });

const Booking     = require('./Booking');   // note capital B
Car.hasMany(Booking, { foreignKey: 'car_id' });

const Vendor      = require('./Vendor');
const CarImage    = require('./CarImage');

Car.belongsTo(Vendor,   { foreignKey: 'vendor_id' });
Car.hasMany(CarImage,   { foreignKey: 'car_id' });

const User = require('./User');
const Favorite = require('./Favorite');
Car.belongsToMany(User, {
    through: Favorite,
    foreignKey: 'car_id',
    as: 'FavoritedByUsers'
});

const Review = require('./Review');
Car.hasMany(Review, { foreignKey: 'car_id', as: 'Reviews' });

const Region = require('./Region');

Car.belongsTo(Region, {
    foreignKey: 'region_id',
    as: 'region'
});

