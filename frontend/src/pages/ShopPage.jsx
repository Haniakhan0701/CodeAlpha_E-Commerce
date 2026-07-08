import { useParams, Link } from "react-router-dom";
import { PRODUCTS, SHOP_INFO } from "./products";
import "./Theme.css";
import "./ShopPage.css";

/**
 * Kraftly — Shop page.
 * Shown when a customer clicks a shop's name or "Follow shop." Displays
 * the shop's banner, bio, follower-style follow button, and every product
 * that shop sells.
 */
export default function ShopPage({ favorites = [], onToggleFavorite, followedShops = [], onToggleFollowShop }) {
  const { shopName } = useParams();
  const decodedName = decodeURIComponent(shopName);
  const info = SHOP_INFO[decodedName] ?? { bio: "A small independent shop on Kraftly.", banner: null };
  const shopProducts = PRODUCTS.filter((p) => p.shop === decodedName);
  const isFollowing = followedShops.includes(decodedName);

  return (
    <div className="kf-shop-page">
      <div className="kf-shop-banner" style={info.banner ? { backgroundImage: `url(${info.banner})` } : undefined}>
        <div className="kf-shop-banner-overlay" />
      </div>

      <div className="kf-shop-header">
        <div className="kf-shop-avatar">{decodedName[0]}</div>
        <div className="kf-shop-header-info">
          <h1>{decodedName}</h1>
          <p>{info.bio}</p>
          <div className="kf-shop-stats">
            <span>{shopProducts.length} items</span>
            <span>·</span>
            <span>{(shopProducts.reduce((s, p) => s + p.reviewCount, 0)).toLocaleString()} sales</span>
          </div>
        </div>
        <button
          className={isFollowing ? "kf-btn-ghost following" : "kf-btn-primary"}
          onClick={() => onToggleFollowShop(decodedName)}
        >
          {isFollowing ? "Following" : "Follow shop"}
        </button>
      </div>

      <hr className="kf-stitch" />

      <h2 className="kf-shop-section-title">Items from this shop</h2>
      <div className="kf-shop-grid">
        {shopProducts.map((p) => (
          <Link to={`/product/${p.id}`} key={p.id} className="kf-shop-product">
            <div className="kf-shop-product-image-wrap">
              <img src={p.images[0]} alt={p.title} />
              <button
                type="button"
                className={`kf-fav-btn ${favorites.includes(p.id) ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(p.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.includes(p.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s-6.7-4.3-9.3-8.4C.8 9.2 2 5.4 5.6 4.4c2-.6 4 .2 5.1 1.9C11.7 8 12 8 12 8s.3 0 1.3-1.7c1.1-1.7 3.1-2.5 5.1-1.9 3.6 1 4.8 4.8 2.9 8.2C18.7 16.7 12 21 12 21z" />
                </svg>
              </button>
            </div>
            <p className="kf-shop-product-title">{p.title}</p>
            <p className="kf-shop-product-price">${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
