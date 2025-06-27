const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    car_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    tableName: 'reviews',
    timestamps: false,
    paranoid: true
});

Review.belongsTo(User, { foreignKey: 'customer_id', as: 'user' });

module.exports = Review;
