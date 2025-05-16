const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Vendor = require('../models/Vendor');

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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cars',
    timestamps: false // manually managing timestamps
});

Car.belongsTo(Vendor, { foreignKey: 'vendor_id' });
// Car.belongsTo(CarCategory, { foreignKey: 'category_id' });
// Car.hasMany(CarImage, { foreignKey: 'car_id' });
// Car.hasMany(CarTags, { foreignKey: 'car_id' });

module.exports = Car;
