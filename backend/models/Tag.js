const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tags',
    timestamps: false
});



module.exports = Tag;

const Car = require('./Car');
Tag.belongsToMany(Car, {
    through: 'car_tags',
    foreignKey: 'tag_id'
});