const express = require("express");
const Pizza = require("../models/Pizza");
const { protect, ownerOnly } = require("../middleware/auth");

const router = express.Router();

// @route  GET /api/pizzas
// Public — customer menu (everyone, including owner, sees the same inventory)
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: -1 });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/pizzas/:id
router.get("/:id", async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/pizzas
// Owner only — add a new pizza to the shared inventory
router.post("/", protect, ownerOnly, async (req, res) => {
  try {
    const { name, description, category, image, sizes, stock, isAvailable } = req.body;
    if (!name) return res.status(400).json({ message: "Pizza name is required" });

    const pizza = await Pizza.create({
      name,
      description,
      category,
      image,
      sizes,
      stock: stock ?? 0,
      isAvailable: isAvailable ?? true,
    });
    res.status(201).json(pizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  PUT /api/pizzas/:id
// Owner only — edit pizza details / update stock / toggle availability
router.put("/:id", protect, ownerOnly, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });

    const fields = ["name", "description", "category", "image", "sizes", "stock", "isAvailable"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) pizza[field] = req.body[field];
    });

    await pizza.save();
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  DELETE /api/pizzas/:id
// Owner only — remove from inventory
router.delete("/:id", protect, ownerOnly, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    await pizza.deleteOne();
    res.json({ message: "Pizza removed from inventory" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
