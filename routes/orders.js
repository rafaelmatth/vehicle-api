const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Vehicle = require("../models/Vehicle");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", authenticateToken, async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: OrderItem, include: [Vehicle] }]
  });
  res.json(orders);
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado
 */
router.post("/", authenticateToken, async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: "Nenhum item no pedido" });

  let total = 0;
  const order = await Order.create({ userId: req.user.id, total: 0, status: "pending" });

  for (const i of items) {
    const vehicle = await Vehicle.findByPk(i.vehicleId);
    if (!vehicle) return res.status(404).json({ error: `Veículo ${i.vehicleId} não encontrado` });

    const price = vehicle.price * (i.quantity || 1);
    total += price;

    await OrderItem.create({
      orderId: order.id,
      vehicleId: vehicle.id,
      quantity: i.quantity || 1,
      price
    });
  }

  order.total = total;
  await order.save();

  const result = await Order.findByPk(order.id, { include: [{ model: OrderItem, include: [Vehicle] }] });
  res.status(201).json(result);
});

module.exports = router;
