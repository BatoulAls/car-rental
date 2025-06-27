const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('customer', 'vendor', 'admin'),
        allowNull: false
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: true, // enables createdAt and updatedAt
    paranoid: true     // enables deletedAt (soft deletes)
});

User.beforeCreate(user => {
    if (user.role === 'vendor') {
        user.is_verified = false;      // ensure false no matter what was sent
    }else
    {
        user.is_verified = true;
    }
});

module.exports = User;
