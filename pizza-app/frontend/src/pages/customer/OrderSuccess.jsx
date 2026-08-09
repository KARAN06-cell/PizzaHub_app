import { Link, useLocation, Navigate } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="page order-success">
      <div className="success-icon">✅</div>
      <h1>Order Confirmed!</h1>
      <p className="muted">
        Order #{order._id.slice(-6).toUpperCase()} has been placed successfully.
      </p>

      <div className="order-review success-card">
        {order.items.map((item, idx) => (
          <div key={idx} className="review-row">
            <span>
              {item.name} ({item.size}) × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="review-row review-total">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <p className="muted">Payment: {order.paymentMethod}</p>
        <p className="muted">Status: {order.status}</p>
        <p className="muted">Delivering to: {order.deliveryAddress}</p>
      </div>

      <div className="success-actions">
        <Link to="/my-orders" className="btn btn-secondary">
          View My Orders
        </Link>
        <Link to="/" className="btn btn-primary">
          Order More
        </Link>
      </div>
    </div>
  );
}
