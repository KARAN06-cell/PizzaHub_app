import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({
          pizzaId: i.pizzaId,
          size: i.size,
          quantity: i.quantity,
        })),
        deliveryAddress: address,
        phone,
      };
      // Order is confirmed instantly — Cash on Delivery, no payment gateway API key needed.
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate("/order-success", { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          {error && <p className="form-error">{error}</p>}

          <label>Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
          />

          <label>Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <div className="payment-box">
            <strong>Payment Method:</strong> Cash on Delivery
            <p className="muted">No card details or payment API key required.</p>
          </div>

          <button className="btn btn-primary" type="submit" disabled={placing}>
            {placing ? "Placing order..." : `Confirm Order — ₹${totalAmount}`}
          </button>
        </form>

        <div className="order-review">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.key} className="review-row">
              <span>
                {item.name} ({item.size}) × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="review-row review-total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
