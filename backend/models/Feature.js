const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Feature = sequelize.define('Feature', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_: {
        type: DataTypes.ENUM('technical', 'comfort', 'safety','performance', 'other'),
        allowNull: true
    }
}, {
    tableName: 'car_features',
    timestamps: false
});


module.exports = Feature;

const Car = require('./Car');
Feature.belongsToMany(Car, {
    through: 'car_feature_mapping',
    foreignKey: 'feature_id'
});