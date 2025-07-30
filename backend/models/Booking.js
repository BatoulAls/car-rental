const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CarCategory = require("./CarCategory");


const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    car_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'confirmed' },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    payment_method: {
        type: DataTypes.ENUM('Cash', 'Card', 'Online'),
        allowNull: false,
        defaultValue: 'Cash'
    },
}, {
    tableName: 'bookings',
    timestamps: false,
    paranoid: true
});


module.exports = Booking;


const Car = require('./Car');
Booking.belongsTo(Car, { foreignKey: 'car_id' });

const User = require('./User');
Booking.belongsTo(User, { foreignKey: 'customer_id' });

const Review = require('./Review');
Booking.hasMany(Review, { foreignKey: 'booking_id', as: 'reviews' });