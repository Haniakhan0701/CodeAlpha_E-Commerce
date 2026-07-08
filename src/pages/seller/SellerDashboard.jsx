import SellerLayout from "./SellerLayout";
import { INITIAL_LISTINGS, INITIAL_ORDERS } from "./sellerData";
import "./SellerDashboard.css";

/**
 * Kraftly — Seller Dashboard home.
 * Mirrors the shape of Etsy's Shop Manager (stats, recent activity) but
 * leads with the actual reason a seller would switch: fees, laid out as
 * a direct side-by-side comparison instead of buried in a payout summary.
 */
export default function SellerDashboard({ sellerName = "Joanne" }) {
  const openOrders = INITIAL_ORDERS.filter((o) => o.status === "Processing").length;
  const activeListings = INITIAL_LISTINGS.filter((l) => l.status === "Active").length;
  const totalViews = INITIAL_LISTINGS.reduce((s, l) => s + l.views, 0);
  const totalFavorites = INITIAL_LISTINGS.reduce((s, l) => s + l.favorites, 0);
  const revenue = INITIAL_ORDERS.reduce((s, o) => s + o.total, 0);

  const recentActivity = [
    { id: "a1", text: "Meera S. favorited Hand-Stamped Copper Name Necklace", time: "29 minutes ago" },
    { id: "a2", text: "New order from Jonas K. — Sterling Silver Stacking Rings", time: "2 hours ago" },
    { id: "a3", text: "Aisha R. left a 5-star review", time: "6 hours ago" },
  ];

  return (
    <SellerLayout>
      <div className="kf-sd-header">
        <h1>Good evening, {sellerName}</h1>
        <p>Here's how your shop is doing.</p>
      </div>

      <div className="kf-fee-compare">
        <div className="kf-fee-compare-col etsy">
          <p className="kf-fee-compare-label">On Etsy</p>
          <p className="kf-fee-compare-line">$0.20 per listing</p>
          <p className="kf-fee-compare-line">6.5% transaction fee</p>
          <p className="kf-fee-compare-line">3% + $0.25 payment processing</p>
        </div>
        <div className="kf-fee-compare-arrow">→</div>
        <div className="kf-fee-compare-col kraftly">
          <p className="kf-fee-compare-label">On Kraftly</p>
          <p className="kf-fee-compare-line big">$0.00 — always</p>
          <p className="kf-fee-compare-sub">Keep 100% of every sale you make.</p>
        </div>
      </div>

      <div className="kf-stat-grid">
        <div className="kf-stat-card">
          <p className="kf-stat-label">Open Orders</p>
          <p className="kf-stat-value">{openOrders}</p>
        </div>
        <div className="kf-stat-card">
          <p className="kf-stat-label">Active Listings</p>
          <p className="kf-stat-value">{activeListings}</p>
        </div>
        <div className="kf-stat-card">
          <p className="kf-stat-label">Views (7d)</p>
          <p className="kf-stat-value">{totalViews.toLocaleString()}</p>
        </div>
        <div className="kf-stat-card">
          <p className="kf-stat-label">Favorites</p>
          <p className="kf-stat-value">{totalFavorites}</p>
        </div>
        <div className="kf-stat-card highlight">
          <p className="kf-stat-label">Revenue</p>
          <p className="kf-stat-value">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="kf-sd-lower">
        <div className="kf-sd-panel">
          <h2>Recent activity</h2>
          {recentActivity.map((a) => (
            <div className="kf-activity-row" key={a.id}>
              <span className="kf-activity-dot" />
              <div>
                <p>{a.text}</p>
                <p className="kf-activity-time">{a.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="kf-sd-panel">
          <h2>Tips to grow</h2>
          <div className="kf-tip">
            <p className="kf-tip-title">Add more photos</p>
            <p className="kf-tip-text">Listings with 5+ photos get 32% more views on average.</p>
          </div>
          <div className="kf-tip">
            <p className="kf-tip-title">Reply to messages fast</p>
            <p className="kf-tip-text">Shops that reply within a day convert 2x more browsers into buyers.</p>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
