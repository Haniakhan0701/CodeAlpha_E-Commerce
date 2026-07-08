import { useState, useRef } from "react";
import { CATEGORIES } from "./sellerData";
import "./AddListingModal.css";

/**
 * Kraftly — Add Listing modal.
 * Deliberately short: title, category, price, one photo, done. This is
 * the actual "easier than Etsy" moment — Etsy's listing form has a dozen
 * required fields (SKU, shipping profiles, production partners, etc.)
 * before a first-time seller can publish anything.
 * TODO: wire to POST /api/seller/listings once the backend exists, and
 * replace the local image preview with a real upload to cloud storage.
 */
export default function AddListingModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !price) return;
    onSave({
      title: title.trim(),
      category,
      price: parseFloat(price),
      image: imagePreview || "https://picsum.photos/seed/new-listing/300/300",
    });
  }

  return (
    <div className="kf-modal-backdrop" onClick={onClose}>
      <div className="kf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kf-modal-head">
          <h2>New listing</h2>
          <button className="kf-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="kf-listing-form">
          <button
            type="button"
            className="kf-listing-photo-btn"
            onClick={() => fileInputRef.current?.click()}
            style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : undefined}
          >
            {!imagePreview && <span>+ Add photo</span>}
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />

          <label className="kf-field">
            <span>Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hand-Stamped Copper Necklace" />
          </label>

          <label className="kf-field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="kf-field">
            <span>Price (USD)</span>
            <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="28.50" />
          </label>

          <p className="kf-listing-fee-note">$0.00 to publish this listing. No expiration, no renewal fee.</p>

          <div className="kf-listing-form-actions">
            <button type="submit" className="kf-btn-primary">Publish listing</button>
            <button type="button" className="kf-btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
