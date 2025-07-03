const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Favorite = sequelize.define('Favorite', {
    id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id:   { type: DataTypes.INTEGER, allowNull: false },
    car_id:    { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'favorites',
    timestamps: false,
    paranoid: true
});

module.exports = Favorite;
