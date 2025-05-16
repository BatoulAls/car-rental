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

// Region.belongsTo(require('./City'), { foreignKey: 'city_id' });
// City.hasMany(Region, { foreignKey: 'city_id' });


module.exports = Region;
