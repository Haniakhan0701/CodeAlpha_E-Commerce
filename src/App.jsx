import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ShopPage from "./pages/ShopPage";
import Orders from "./pages/OrdersPage";
import Favorites from "./pages/Favorites";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerListings from "./pages/seller/SellerListings";
import SellerOrders from "./pages/seller/SellerOrders";
import { apiFetch } from "./utils/api";
import "./pages/Theme.css";

/**
 * Kraftly — root app.
 * Cart now lives on the backend (tied to the logged-in user), not in local
 * state — App.jsx only tracks a lightweight cartCount for the navbar badge.
 * Cart.jsx and Checkout.jsx fetch/mutate the real cart themselves.
 * Adding to cart requires being logged in (the backend cart is a field on
 * the User document) — ProductPage redirects to /login if it gets a 401.
 */
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.pathname.startsWith("/seller") || location.pathname === "/login";

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const [favorites, setFavorites] = useState([]);
  const [followedShops, setFollowedShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("kf_token");
    if (!token) {
      setCheckingSession(false);
      return;
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired");
        const data = await res.json();
        setUser(data.user);
        return refreshCartCount();
      })
      .catch(() => localStorage.removeItem("kf_token"))
      .finally(() => setCheckingSession(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshCartCount() {
    try {
      const data = await apiFetch("/api/cart");
      setCartCount(data.cart.reduce((sum, item) => sum + item.qty, 0));
    } catch {
      setCartCount(0);
    }
  }

  function handleAuthSuccess(userData) {
    setUser(userData);
    refreshCartCount();
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("kf_token");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  }

  // Called by ProductPage after it successfully POSTs to /api/cart
  function onCartCountChange(newCount) {
    setCartCount(newCount);
  }

  function toggleFavorite(productId) {
    setFavorites((f) => (f.includes(productId) ? f.filter((id) => id !== productId) : [...f, productId]));
  }

  function toggleFollowShop(shopName) {
    setFollowedShops((f) => (f.includes(shopName) ? f.filter((s) => s !== shopName) : [...f, shopName]));
  }

  if (checkingSession) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#6f6a8f" }}>
        Loading Kraftly…
      </div>
    );
  }

  return (
    <div className="kf-app">
      {!hideNavbar && (
        <Navbar cartCount={cartCount} onSearch={setSearchQuery} currentUser={user} onLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/login" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route
          path="/"
          element={<HomePage searchQuery={searchQuery} favorites={favorites} onToggleFavorite={toggleFavorite} />}
        />
        <Route
          path="/product/:id"
          element={
            <ProductPage
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              followedShops={followedShops}
              onToggleFollowShop={toggleFollowShop}
              isLoggedIn={!!user}
              onCartCountChange={onCartCountChange}
            />
          }
        />
        <Route path="/cart" element={<Cart onCartCountChange={onCartCountChange} />} />
        <Route path="/checkout" element={<Checkout onOrderPlaced={() => setCartCount(0)} />} />
        <Route
          path="/shop/:shopName"
          element={
            <ShopPage
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              followedShops={followedShops}
              onToggleFollowShop={toggleFollowShop}
            />
          }
        />
        <Route path="/seller" element={<SellerDashboard sellerName={user?.name} />} />
        <Route path="/seller/listings" element={<SellerListings />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
