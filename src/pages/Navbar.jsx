import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Theme.css";
import "./Navbar.css";

/**
 * Kraftly — top navigation.
 * Shows a "Log in" link when no one is signed in, and the real account
 * dropdown (with a working Log out) when someone is.
 */
export default function Navbar({ cartCount = 0, onSearch, currentUser, onLogout }) {
  const [query, setQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    onSearch?.(query);
    navigate("/");
  }

  return (
    <header className="kf-navbar">
      <div className="kf-navbar-inner">
        <Link to="/" className="kf-logo">
          <img src="/kraftly-logo.svg" alt="Kraftly" className="kf-logo-img" />
          Kraftly
        </Link>

        <form className="kf-search" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search for handmade jewelry, decor, gifts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </form>

        <nav className="kf-navbar-actions">
          <Link to="/seller" className="kf-sell-link">Sell on Kraftly</Link>
          <Link to="/cart" className="kf-cart-btn" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L4.5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
            {cartCount > 0 && <span className="kf-cart-badge">{cartCount}</span>}
          </Link>

          {currentUser ? (
            <div className="kf-account-wrap">
              <button className="kf-account-btn" onClick={() => setAccountOpen((o) => !o)}>
                <div className="kf-account-avatar">{currentUser.name?.[0] ?? "U"}</div>
              </button>
              {accountOpen && (
                <div className="kf-account-menu">
                  <Link to="/orders" onClick={() => setAccountOpen(false)}>Your Orders</Link>
                  <Link to="/favorites" onClick={() => setAccountOpen(false)}>Favorites</Link>
                  <button onClick={() => { setAccountOpen(false); onLogout?.(); }}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="kf-login-link">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
