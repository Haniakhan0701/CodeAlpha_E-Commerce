import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./OrdersPage.css";

/**
 * Kraftly — Your Orders page.
 * Fetches the logged-in buyer's real order history from GET /api/orders
 * (the backend route already exists — this just wires the frontend to it).
 */
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/orders");
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kf-orders-page">
      <h1 className="kf-orders-title">Your Orders</h1>

      {error && <p className="kf-error-banner">{error}</p>}

      {loading ? (
        <p className="kf-empty-state">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="kf-empty-state">You haven't placed any orders yet.</p>
      ) : (
        <div className="kf-orders-list">
          {orders.map((order) => (
            <div className="kf-order-card" key={order._id}>
              <div className="kf-order-card-head">
                <div>
                  <p className="kf-order-id">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="kf-order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`kf-order-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>

              <div className="kf-order-items">
                {order.items.map((item, i) => (
                  <div className="kf-order-item" key={i}>
                    <span>{item.title}</span>
                    <span className="kf-order-item-qty">× {item.qty}</span>
                    <span className="kf-order-item-price">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="kf-order-total">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
