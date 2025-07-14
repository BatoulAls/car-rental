// models/City.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name_en: DataTypes.STRING,
    name_ar: DataTypes.STRING
}, {
    tableName: 'cities',
    timestamps: true
});

module.exports = City;
