const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CarImage = sequelize.define('CarImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    car_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'car_images',
    timestamps: true,
    paranoid: true,
});

module.exports = CarImage;
