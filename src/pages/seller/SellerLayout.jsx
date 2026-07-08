import { Link, useLocation } from "react-router-dom";
import { SELLER_SHOP_NAME } from "./sellerData";
import "../Theme.css";
import "./SellerLayout.css";

/**
 * Kraftly — Seller Dashboard shared layout.
 * Sidebar nav (Dashboard / Listings / Orders), a link back to the buyer
 * site, and a persistent "0% fees" badge — the actual differentiator
 * from Etsy that this whole dashboard exists to deliver on.
 */
export default function SellerLayout({ children }) {
  const { pathname } = useLocation();

  const links = [
    { to: "/seller", label: "Dashboard", exact: true },
    { to: "/seller/listings", label: "Listings" },
    { to: "/seller/orders", label: "Orders" },
  ];

  function isActive(link) {
    return link.exact ? pathname === link.to : pathname.startsWith(link.to);
  }

  return (
    <div className="kf-seller-layout">
      <aside className="kf-seller-sidebar">
        <Link to="/" className="kf-seller-logo">
          <img src="/kraftly-logo.svg" alt="Kraftly" />
          Kraftly
        </Link>
        <p className="kf-seller-shop-name">{SELLER_SHOP_NAME}</p>

        <nav className="kf-seller-nav">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={isActive(l) ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="kf-fee-badge">
          <p className="kf-fee-badge-title">0% listing fees</p>
          <p className="kf-fee-badge-sub">0% transaction fees. Keep 100% of every sale.</p>
        </div>

        <Link to="/" className="kf-seller-exit">← Back to shop front</Link>
      </aside>

      <main className="kf-seller-main">{children}</main>
    </div>
  );
}
