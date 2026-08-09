import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.key} className="cart-row">
            <img
              src={item.image || "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=200"}
              alt={item.name}
              className="cart-img"
            />
            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>{item.size}</p>
              <p>₹{item.price} each</p>
            </div>
            <div className="cart-qty">
              <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.key, Math.min(item.quantity + 1, item.maxStock))
                }
              >
                +
              </button>
            </div>
            <p className="cart-line-total">₹{item.price * item.quantity}</p>
            <button className="link-btn danger" onClick={() => removeItem(item.key)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{totalAmount}</h3>
        <button className="btn btn-primary" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
