import { useState } from "react";
import SellerLayout from "./SellerLayout";
import { INITIAL_ORDERS } from "./sellerData";
import "./SellerOrders.css";

/**
 * Kraftly — Seller Orders page.
 * TODO: wire to GET /api/seller/orders and PUT /api/seller/orders/:id
 * once the backend exists.
 */
const STATUS_FLOW = ["Processing", "Shipped", "Delivered"];

export default function SellerOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  function advanceStatus(id) {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o;
        const nextIndex = Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1);
        return { ...o, status: STATUS_FLOW[nextIndex] };
      })
    );
  }

  return (
    <SellerLayout>
      <div className="kf-so-header">
        <h1>Orders</h1>
        <p>{orders.length} total orders</p>
      </div>

      <div className="kf-so-table">
        <div className="kf-so-row kf-so-row-head">
          <span>Buyer</span>
          <span>Item</span>
          <span>Date</span>
          <span>Total</span>
          <span>Status</span>
          <span></span>
        </div>
        {orders.map((o) => (
          <div className="kf-so-row" key={o.id}>
            <span className="kf-so-buyer">{o.buyer}</span>
            <span>{o.item}</span>
            <span className="kf-so-date">{o.date}</span>
            <span className="kf-so-total">${o.total.toFixed(2)}</span>
            <span>
              <span className={`kf-order-status ${o.status.toLowerCase()}`}>{o.status}</span>
            </span>
            {o.status !== "Delivered" ? (
              <button className="kf-btn-ghost kf-so-advance" onClick={() => advanceStatus(o.id)}>
                Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]}
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </SellerLayout>
  );
}
