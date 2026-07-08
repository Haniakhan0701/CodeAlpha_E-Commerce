import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./ProductPage.css";

/**
 * Kraftly — Product Detail page.
 * Now fetches the real product (with real reviews/rating) from
 * GET /api/products/:id instead of the old mock array. Add to Cart calls
 * the real POST /api/cart route — if the person isn't logged in, it
 * redirects to /login instead of silently failing.
 */

function StarRow({ rating }) {
  return (
    <span className="kf-star-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(rating) ? "kf-star filled" : "kf-star"}>★</span>
      ))}
    </span>
  );
}

export default function ProductPage({ favorites = [], onToggleFavorite, followedShops = [], onToggleFollowShop, isLoggedIn, onCartCountChange }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`/api/products/${id}`);
      setProduct(data.product);
      setActiveImage(0);
      setSelectedVariants(
        Object.fromEntries(Object.entries(data.product.variants || {}).map(([k, opts]) => [k, opts[0]]))
      );

      // Load a few related items from the same category
      const params = new URLSearchParams({ category: data.product.category });
      const relatedData = await apiFetch(`/api/products?${params.toString()}`);
      setRelated(relatedData.products.filter((p) => p.id !== data.product.id).slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    setCartError("");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const data = await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, variants: selectedVariants, qty }),
      });
      const newCount = data.cart.reduce((sum, item) => sum + item.qty, 0);
      onCartCountChange?.(newCount);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setCartError(err.message);
    }
  }

  if (loading) return <p className="kf-empty-state">Loading product…</p>;
  if (error || !product) return <p className="kf-empty-state">{error || "Product not found."}</p>;

  const isFavorite = favorites.includes(product.id);
  const isFollowing = followedShops.includes(product.shop);
  const variantEntries = Object.entries(product.variants || {});

  return (
    <div className="kf-product-page">
      <div className="kf-breadcrumb">
        <Link to="/">Home</Link> / <span>{product.category}</span>
      </div>

      <div className="kf-product-layout">
        <div className="kf-gallery">
          <div className="kf-gallery-main">
            <img src={product.images[activeImage]} alt={product.title} />
          </div>
          <div className="kf-gallery-thumbs">
            {product.images.map((img, i) => (
              <button
                key={img}
                className={`kf-thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="kf-product-info">
          <Link to={`/shop/${encodeURIComponent(product.shop)}`} className="kf-shop-link">{product.shop}</Link>
          <h1>{product.title}</h1>

          <div className="kf-rating-row">
            <StarRow rating={product.rating} />
            <span>{product.rating || "No ratings yet"}</span>
            <span className="kf-review-link" onClick={() => setTab("reviews")}>
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="kf-price">${product.price.toFixed(2)}</p>

          {variantEntries.map(([label, options]) => (
            <div className="kf-variant-group" key={label}>
              <p className="kf-variant-label">{label}: <strong>{selectedVariants[label]}</strong></p>
              <div className="kf-variant-options">
                {options.map((opt) => (
                  <button
                    key={opt}
                    className={`kf-variant-btn ${selectedVariants[label] === opt ? "active" : ""}`}
                    onClick={() => setSelectedVariants((v) => ({ ...v, [label]: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="kf-qty-row">
            <span className="kf-variant-label">Quantity</span>
            <div className="kf-qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          {cartError && <p className="kf-error-banner">{cartError}</p>}

          <div className="kf-buy-row">
            <button className="kf-btn-primary kf-add-to-cart" onClick={handleAddToCart}>
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button
              className={`kf-fav-btn-lg ${isFavorite ? "active" : ""}`}
              onClick={() => onToggleFavorite(product.id)}
              aria-label="Save to favorites"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-6.7-4.3-9.3-8.4C.8 9.2 2 5.4 5.6 4.4c2-.6 4 .2 5.1 1.9C11.7 8 12 8 12 8s.3 0 1.3-1.7c1.1-1.7 3.1-2.5 5.1-1.9 3.6 1 4.8 4.8 2.9 8.2C18.7 16.7 12 21 12 21z" />
              </svg>
            </button>
          </div>

          <div className="kf-shop-follow-row">
            <span>From <strong>{product.shop}</strong></span>
            <button
              className={isFollowing ? "kf-btn-ghost following" : "kf-btn-ghost"}
              onClick={() => onToggleFollowShop(product.shop)}
            >
              {isFollowing ? "Following shop" : "Follow shop"}
            </button>
          </div>

          <div className="kf-trust-row">
            <span>🔒 Secure checkout</span>
            <span>↩ Easy 30-day returns</span>
          </div>
        </div>
      </div>

      <hr className="kf-stitch" />

      <div className="kf-tabs">
        <button className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>
          Description
        </button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>
          Reviews ({product.reviewCount})
        </button>
      </div>

      {tab === "description" ? (
        <p className="kf-description">{product.description}</p>
      ) : (
        <div className="kf-reviews">
          {!product.reviews || product.reviews.length === 0 ? (
            <p className="kf-empty-state">No written reviews yet for this item.</p>
          ) : (
            product.reviews.map((r) => (
              <div className="kf-review" key={r.id}>
                <div className="kf-review-head">
                  <strong>{r.author}</strong>
                  <StarRow rating={r.rating} />
                </div>
                <p>{r.text}</p>
              </div>
            ))
          )}
        </div>
      )}

      {related.length > 0 && (
        <>
          <hr className="kf-stitch" />
          <h2 className="kf-related-title">More from {product.category}</h2>
          <div className="kf-related-grid">
            {related.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="kf-related-card">
                <img src={p.images[0]} alt={p.title} />
                <p className="kf-related-name">{p.title}</p>
                <p className="kf-related-price">${p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
