const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Small / Medium / Large
    price: { type: Number, required: true },
  },
  { _id: false }
);

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan"],
      default: "Veg",
    },
    image: { type: String, default: "" }, // image URL
    sizes: {
      type: [sizeSchema],
      default: [
        { label: "Small", price: 149 },
        { label: "Medium", price: 249 },
        { label: "Large", price: 349 },
      ],
    },
    stock: { type: Number, required: true, default: 0 }, // inventory count
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// A pizza is orderable only if the owner marked it available AND stock > 0
pizzaSchema.virtual("inStock").get(function () {
  return this.isAvailable && this.stock > 0;
});

pizzaSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Pizza", pizzaSchema);
