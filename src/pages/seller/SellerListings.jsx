import { useState } from "react";
import SellerLayout from "./SellerLayout";
import { INITIAL_LISTINGS } from "./sellerData";
import AddListingModal from "./AddListingModal";
import "./SellerListings.css";

/**
 * Kraftly — Seller Listings management.
 * TODO: wire to real CRUD routes (GET/POST/PUT/DELETE /api/seller/listings)
 * once the backend exists — this currently manages listings in memory only.
 */
export default function SellerListings() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("All");

  function addListing(newListing) {
    setListings((l) => [{ id: crypto.randomUUID(), status: "Active", views: 0, favorites: 0, orders: 0, ...newListing }, ...l]);
    setShowAddModal(false);
  }

  function toggleStatus(id) {
    setListings((l) =>
      l.map((item) =>
        item.id === id ? { ...item, status: item.status === "Active" ? "Draft" : "Active" } : item
      )
    );
  }

  function deleteListing(id) {
    setListings((l) => l.filter((item) => item.id !== id));
  }

  const filtered = filter === "All" ? listings : listings.filter((l) => l.status === filter);

  return (
    <SellerLayout>
      <div className="kf-sl-header">
        <div>
          <h1>Listings</h1>
          <p>{listings.length} total · {listings.filter((l) => l.status === "Active").length} active</p>
        </div>
        <button className="kf-btn-primary" onClick={() => setShowAddModal(true)}>
          + Add listing
        </button>
      </div>

      <div className="kf-sl-filters">
        {["All", "Active", "Draft"].map((f) => (
          <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="kf-sl-table">
        <div className="kf-sl-row kf-sl-row-head">
          <span>Listing</span>
          <span>Price</span>
          <span>Status</span>
          <span>Views</span>
          <span>Favorites</span>
          <span>Orders</span>
          <span></span>
        </div>
        {filtered.map((item) => (
          <div className="kf-sl-row" key={item.id}>
            <div className="kf-sl-listing-cell">
              <img src={item.image} alt={item.title} />
              <div>
                <p className="kf-sl-title">{item.title}</p>
                <p className="kf-sl-category">{item.category}</p>
              </div>
            </div>
            <span className="kf-sl-price">${item.price.toFixed(2)}</span>
            <span>
              <button
                className={`kf-status-pill ${item.status === "Active" ? "active" : "draft"}`}
                onClick={() => toggleStatus(item.id)}
              >
                {item.status}
              </button>
            </span>
            <span>{item.views.toLocaleString()}</span>
            <span>{item.favorites}</span>
            <span>{item.orders}</span>
            <button className="kf-sl-delete" onClick={() => deleteListing(item.id)}>Delete</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="kf-empty-state">No listings in this filter.</p>}
      </div>

      {showAddModal && (
        <AddListingModal onClose={() => setShowAddModal(false)} onSave={addListing} />
      )}
    </SellerLayout>
  );
}
