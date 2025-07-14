const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Country = sequelize.define('Country', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_en: DataTypes.STRING,
    name_ar: DataTypes.STRING
}, {
    tableName: 'countries',
    timestamps: false
});
module.exports = Country;
