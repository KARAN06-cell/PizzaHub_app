// Run with: npm run seed
// Populates sample pizzas into the inventory and creates a default owner account
// (owner@pizza.com / owner123) if one doesn't already exist. Safe to re-run.
require("dotenv").config();
const connectDB = require("../config/db");
const Pizza = require("../models/Pizza");
const User = require("../models/User");

const samplePizzas = [
  {
    name: "Margherita",
    description: "Classic delight with 100% real mozzarella cheese",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=500",
    sizes: [
      { label: "Small", price: 149 },
      { label: "Medium", price: 249 },
      { label: "Large", price: 349 },
    ],
    stock: 25,
    isAvailable: true,
  },
  {
    name: "Farmhouse",
    description: "Delightful combination of onion, capsicum, tomato & mushroom",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    sizes: [
      { label: "Small", price: 199 },
      { label: "Medium", price: 329 },
      { label: "Large", price: 449 },
    ],
    stock: 20,
    isAvailable: true,
  },
  {
    name: "Peppy Paneer",
    description: "Loaded with double paneer, capsicum, red paprika & spicy tomatoes",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500",
    sizes: [
      { label: "Small", price: 209 },
      { label: "Medium", price: 349 },
      { label: "Large", price: 469 },
    ],
    stock: 18,
    isAvailable: true,
  },
  {
    name: "Chicken Tikka",
    description: "Tender chunks of chicken marinated with Indian spices",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=500",
    sizes: [
      { label: "Small", price: 249 },
      { label: "Medium", price: 399 },
      { label: "Large", price: 549 },
    ],
    stock: 15,
    isAvailable: true,
  },
  {
    name: "Pepper Barbecue Chicken",
    description: "A perfect blend of pepper barbecue sauce & grilled chicken",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    sizes: [
      { label: "Small", price: 259 },
      { label: "Medium", price: 409 },
      { label: "Large", price: 559 },
    ],
    stock: 12,
    isAvailable: true,
  },
  {
    name: "Vegan Veggie Delight",
    description: "Loaded with fresh veggies, dairy-free cheese",
    category: "Vegan",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500",
    sizes: [
      { label: "Small", price: 219 },
      { label: "Medium", price: 359 },
      { label: "Large", price: 479 },
    ],
    stock: 10,
    isAvailable: true,
  },
];

const run = async () => {
  await connectDB();

  await Pizza.deleteMany({});
  await Pizza.insertMany(samplePizzas);
  console.log(`Seeded ${samplePizzas.length} pizzas into inventory.`);

  const ownerExists = await User.findOne({ email: "owner@pizza.com" });
  if (!ownerExists) {
    await User.create({
      name: "Store Owner",
      email: "owner@pizza.com",
      password: "owner123",
      role: "owner",
    });
    console.log("Created default owner account -> owner@pizza.com / owner123");
  } else {
    console.log("Owner account already exists, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
