import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColor = {
  Pending: "gray",
  Confirmed: "blue",
  Preparing: "orange",
  "Out for Delivery": "purple",
  Delivered: "green",
  Cancelled: "red",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page-loading">Loading orders...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                <span
                  className="status-pill"
                  style={{ borderColor: statusColor[order.status] }}
                >
                  {order.status}
                </span>
              </div>
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
              <p className="muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
