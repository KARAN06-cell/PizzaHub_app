import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function PizzaCard({ pizza }) {
  const [selectedSize, setSelectedSize] = useState(pizza.sizes[0]?.label || "");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const sizeInfo = pizza.sizes.find((s) => s.label === selectedSize) || pizza.sizes[0];
  const outOfStock = !pizza.isAvailable || pizza.stock <= 0;

  const handleAdd = () => {
    if (outOfStock || !sizeInfo) return;
    addItem(pizza, sizeInfo.label, sizeInfo.price, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={`pizza-card ${outOfStock ? "out-of-stock" : ""}`}>
      <img
        src={pizza.image || "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=500"}
        alt={pizza.name}
        className="pizza-img"
      />
      <div className="pizza-body">
        <div className="pizza-title-row">
          <h3>{pizza.name}</h3>
          <span className={`badge badge-${pizza.category.toLowerCase().replace("-", "")}`}>
            {pizza.category}
          </span>
        </div>
        <p className="pizza-desc">{pizza.description}</p>

        {outOfStock ? (
          <p className="stock-warning">Out of stock</p>
        ) : (
          <>
            <div className="size-select">
              {pizza.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className={`size-btn ${selectedSize === s.label ? "active" : ""}`}
                  onClick={() => setSelectedSize(s.label)}
                >
                  {s.label} ₹{s.price}
                </button>
              ))}
            </div>
            <p className="stock-note">{pizza.stock} left in stock</p>
            <button className="btn btn-primary" onClick={handleAdd}>
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
