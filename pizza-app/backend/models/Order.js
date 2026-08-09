const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza", required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    // No payment gateway / API key needed — Cash on Delivery only.
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Confirmed", // order is confirmed instantly, no external payment step
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
