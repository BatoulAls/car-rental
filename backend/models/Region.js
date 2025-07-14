const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Region = sequelize.define('Region', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name_en: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name_ar: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'regions',
    timestamps: false
});

module.exports = Region;


const Car = require('./Car');

Region.hasMany(Car, {
    foreignKey: 'region_id',
    as: 'cars'
});
