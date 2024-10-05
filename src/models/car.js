const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
    make: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    mileage: { type: DataTypes.INTEGER },
    fuelType: { type: DataTypes.STRING, allowNull: false },
    transmission: { type: DataTypes.STRING, allowNull: false },
    bodyType: { type: DataTypes.STRING, allowNull: false }, 
    color: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
}, {
    schema: "cars_api",
    timestamps: true
});

module.exports = Car;
