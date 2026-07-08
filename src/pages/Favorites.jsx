import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./HomePage.css";
import "./OrdersPage.css";

/**
 * Kraftly — Favorites page.
 * Favorites are currently stored as an array of product IDs in App state
 * (not yet persisted to the backend — see TODO in App.jsx). This page
 * fetches all products and filters to just the favorited ones client-side.
 * TODO: once favorites are saved via POST /api/favorites/:productId, switch
 * this to GET /api/favorites which already returns the full list server-side.
 */
export default function Favorites({ favorites = [], onToggleFavorite }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  async function loadFavorites() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/products");
      setProducts(data.products.filter((p) => favorites.includes(p.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kf-favorites-page">
      <h1 className="kf-favorites-title">Your Favorites</h1>

      {error && <p className="kf-error-banner">{error}</p>}

      <div className="kf-product-grid">
        {loading ? (
          <p className="kf-empty-state">Loading favorites…</p>
        ) : products.length === 0 ? (
          <p className="kf-empty-state">
            You haven't favorited anything yet. Tap the heart icon on a product to save it here.
          </p>
        ) : (
          products.map((p) => (
            <Link to={`/product/${p.id}`} className="kf-card-link" key={p.id}>
              <article className="kf-product-card">
                <div className="kf-card-image-wrap">
                  <img src={p.images[0]} alt={p.title} className="kf-card-image" />
                  <button
                    type="button"
                    className="kf-fav-btn active"
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite(p.id);
                    }}
                    aria-label="Remove from favorites"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21s-6.7-4.3-9.3-8.4C.8 9.2 2 5.4 5.6 4.4c2-.6 4 .2 5.1 1.9C11.7 8 12 8 12 8s.3 0 1.3-1.7c1.1-1.7 3.1-2.5 5.1-1.9 3.6 1 4.8 4.8 2.9 8.2C18.7 16.7 12 21 12 21z" />
                    </svg>
                  </button>
                </div>
                <div className="kf-card-body">
                  <p className="kf-card-shop">{p.shop}</p>
                  <h3 className="kf-card-title">{p.title}</h3>
                  <p className="kf-card-price">${p.price.toFixed(2)}</p>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
