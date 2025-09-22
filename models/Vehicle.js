const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Vehicle = sequelize.define("Vehicle", {
  make: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  mileage: { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  stock: { type: DataTypes.INTEGER, defaultValue: 1 },
  image: { type: DataTypes.STRING }
});

module.exports = Vehicle;
