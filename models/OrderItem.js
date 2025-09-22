const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Order = require("./Order");
const Vehicle = require("./Vehicle");

const OrderItem = sequelize.define("OrderItem", {
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Vehicle.hasMany(OrderItem, { foreignKey: 'vehicleId' });

module.exports = OrderItem;
