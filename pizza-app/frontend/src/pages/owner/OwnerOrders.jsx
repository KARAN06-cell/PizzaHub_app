import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="page-loading">Loading orders...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="status-select"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <p className="muted">
                Customer: {order.user?.name} ({order.user?.email}) — {order.phone}
              </p>
              <p className="muted">Deliver to: {order.deliveryAddress}</p>

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
