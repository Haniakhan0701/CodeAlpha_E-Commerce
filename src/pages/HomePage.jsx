import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./HomePage.css";

/**
 * Kraftly — Home / Marketplace page.
 * Now fetches real products from GET /api/products (with category/search
 * as query params) instead of the old mock array. Hero decoration images
 * are static picsum seeds now, decoupled from real product data, so the
 * hero doesn't break if the database is ever empty.
 */

const CATEGORIES = [
  "All", "Digital Products", "Ebooks", "Jewelry", "Home Decor",
  "Clothing", "Art & Prints", "Electronics", "Craft Supplies", "Toys & Games",
];

function TiltCard({ product, isFavorite, onToggleFavorite }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`,
    });
  }

  function handleMouseLeave() {
    setStyle({ transform: "perspective(700px) rotateX(0) rotateY(0) translateY(0)" });
  }

  return (
    <Link to={`/product/${product.id}`} className="kf-card-link">
      <article
        className="kf-product-card"
        ref={ref}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="kf-card-image-wrap">
          <img src={product.images[0]} alt={product.title} className="kf-card-image" />
          <button
            type="button"
            className={`kf-fav-btn ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(product.id);
            }}
            aria-label="Save to favorites"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-6.7-4.3-9.3-8.4C.8 9.2 2 5.4 5.6 4.4c2-.6 4 .2 5.1 1.9C11.7 8 12 8 12 8s.3 0 1.3-1.7c1.1-1.7 3.1-2.5 5.1-1.9 3.6 1 4.8 4.8 2.9 8.2C18.7 16.7 12 21 12 21z" />
            </svg>
          </button>
        </div>
        <div className="kf-card-body">
          <p className="kf-card-shop">{product.shop}</p>
          <h3 className="kf-card-title">{product.title}</h3>
          <p className="kf-card-price">${product.price.toFixed(2)}</p>
        </div>
      </article>
    </Link>
  );
}

export default function HomePage({ searchQuery = "", favorites = [], onToggleFavorite }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (searchQuery) params.set("search", searchQuery);

      const data = await apiFetch(`/api/products?${params.toString()}`);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="kf-hero">
        <div className="kf-hero-inner">
          <div className="kf-hero-text">
            <p className="kf-hero-eyebrow">Digital Products · Ebooks · Handmade Goods</p>
            <h1>
              Find something
              <br />
              <em>nobody else has.</em>
            </h1>
            <p className="kf-hero-sub">
              Thousands of independent makers, one marketplace. Jewelry, home decor,
              clothing, art, and more — all handmade, all real.
            </p>
            <button
              type="button"
              className="kf-btn-primary kf-hero-cta"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start browsing
            </button>
          </div>
          <div className="kf-hero-visual">
            <div className="kf-hero-dome" />
            <div className="kf-hero-frame kf-hero-frame-back">
              <img src="https://picsum.photos/seed/hero-back/500/600" alt="" />
            </div>
            <div className="kf-hero-frame kf-hero-frame-front">
              <img src="https://picsum.photos/seed/hero-front/500/600" alt="" />
            </div>
            <div className="kf-hero-chip kf-hero-chip-1">
              <img src="https://picsum.photos/seed/hero-chip1/200/200" alt="" />
            </div>
            <div className="kf-hero-chip kf-hero-chip-2">
              <img src="https://picsum.photos/seed/hero-chip2/200/200" alt="" />
            </div>
            <div className="kf-hero-badge kf-hero-badge-1">Handmade</div>
            <div className="kf-hero-badge kf-hero-badge-2">Free shipping</div>
          </div>
        </div>
      </section>

      <div className="kf-category-bar" id="products">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`kf-chip ${activeCategory === c ? "active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <hr className="kf-stitch" />

      {searchQuery && !loading && (
        <p className="kf-search-result-note">
          Showing results for <strong>"{searchQuery}"</strong> — {products.length} item{products.length !== 1 ? "s" : ""}
        </p>
      )}

      {error && <p className="kf-error-banner">{error}</p>}

      <div className="kf-product-grid">
        {loading ? (
          <p className="kf-empty-state">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="kf-empty-state">No products match your search. Try another term or category.</p>
        ) : (
          products.map((p) => (
            <TiltCard
              key={p.id}
              product={p}
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}
