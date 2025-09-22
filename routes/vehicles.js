const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const { authenticateToken } = require("../middlewares/auth");

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Lista todos os veículos
 *     responses:
 *       200:
 *         description: Lista de veículos
 */
router.get("/", async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
});

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Cria um veículo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Veículo criado
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
