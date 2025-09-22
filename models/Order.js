const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const Order = sequelize.define("Order", {
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" }
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;
