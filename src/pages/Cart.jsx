import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./Cart.css";

/**
 * Kraftly — Cart page.
 * Now fetches the real cart from GET /api/cart and mutates it via
 * PUT/DELETE /api/cart/:index — no more local-only cart state.
 */
export default function Cart({ onCartCountChange }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/cart");
      setCart(data.cart);
      onCartCountChange?.(data.cart.reduce((sum, item) => sum + item.qty, 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(index, qty) {
    try {
      const data = await apiFetch(`/api/cart/${index}`, {
        method: "PUT",
        body: JSON.stringify({ qty }),
      });
      setCart(data.cart);
      onCartCountChange?.(data.cart.reduce((sum, item) => sum + item.qty, 0));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(index) {
    try {
      const data = await apiFetch(`/api/cart/${index}`, { method: "DELETE" });
      setCart(data.cart);
      onCartCountChange?.(data.cart.reduce((sum, item) => sum + item.qty, 0));
    } catch (err) {
      setError(err.message);
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = cart.length === 0 ? 0 : 6.5;
  const total = subtotal + shipping;

  if (loading) return <div className="kf-cart-page"><p className="kf-empty-state">Loading your cart…</p></div>;

  return (
    <div className="kf-cart-page">
      <h1>Your Cart</h1>

      {error && <p className="kf-error-banner">{error}</p>}

      {cart.length === 0 ? (
        <div className="kf-empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="kf-btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <div className="kf-cart-layout">
          <div className="kf-cart-items">
            {cart.map((item, i) => (
              <div className="kf-cart-item" key={i}>
                <img src={item.product.images[0]} alt={item.product.title} />
                <div className="kf-cart-item-info">
                  <p className="kf-cart-item-title">{item.product.title}</p>
                  <p className="kf-cart-item-variants">
                    {Object.entries(item.variants || {}).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                  <div className="kf-cart-item-controls">
                    <div className="kf-qty-stepper">
                      <button onClick={() => updateQty(i, Math.max(1, item.qty - 1))}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(i, item.qty + 1)}>+</button>
                    </div>
                    <button className="kf-remove-btn" onClick={() => removeItem(i)}>Remove</button>
                  </div>
                </div>
                <p className="kf-cart-item-price">${(item.product.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="kf-order-summary">
            <h2>Order Summary</h2>
            <div className="kf-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="kf-summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <hr className="kf-stitch" />
            <div className="kf-summary-row kf-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="kf-btn-primary kf-checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>
            <Link to="/" className="kf-continue-link">Continue shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
