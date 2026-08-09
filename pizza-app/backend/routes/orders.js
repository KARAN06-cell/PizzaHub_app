const express = require("express");
const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const { protect, ownerOnly } = require("../middleware/auth");

const router = express.Router();

// @route  POST /api/orders
// Customer only — places an order and gets it confirmed immediately.
// No payment gateway / API key involved: this is Cash on Delivery.
// body: { items: [{ pizzaId, size, quantity }], deliveryAddress, phone }
// NOTE: uses plain sequential updates (no Mongo session/transaction) so this
// works with a standalone local MongoDB instance, not just a replica set.
router.post("/", protect, async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: "Delivery address and phone are required" });
    }

    // First pass: validate everything before touching stock, so a bad item
    // doesn't leave earlier pizzas partially decremented.
    const resolved = [];
    for (const item of items) {
      const pizza = await Pizza.findById(item.pizzaId);
      if (!pizza) throw new Error(`Pizza not found: ${item.pizzaId}`);

      const sizeInfo = pizza.sizes.find((s) => s.label === item.size);
      if (!sizeInfo) throw new Error(`Invalid size "${item.size}" for ${pizza.name}`);

      const qty = Number(item.quantity) || 1;
      if (!pizza.isAvailable || pizza.stock < qty) {
        throw new Error(`${pizza.name} is out of stock`);
      }
      resolved.push({ pizza, sizeInfo, qty });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const { pizza, sizeInfo, qty } of resolved) {
      pizza.stock -= qty;
      await pizza.save();

      orderItems.push({
        pizza: pizza._id,
        name: pizza.name,
        size: sizeInfo.label,
        price: sizeInfo.price,
        quantity: qty,
      });
      totalAmount += sizeInfo.price * qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: "Cash on Delivery",
      status: "Confirmed", // instantly confirmed, no external payment step
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  GET /api/orders/my
// Customer — their own order history
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/orders
// Owner only — all customer orders
router.get("/", protect, ownerOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  PUT /api/orders/:id/status
// Owner only — update order status (Preparing / Out for Delivery / Delivered / Cancelled)
router.put("/:id/status", protect, ownerOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
