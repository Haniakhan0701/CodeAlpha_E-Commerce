import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./Theme.css";
import "./Checkout.css";

/**
 * Kraftly — Checkout page.
 * This now actually calls POST /api/orders, which creates a real Order
 * document from the user's real backend cart and clears that cart — this
 * is the fix for "Place order" not showing up in Your Orders before,
 * since it previously only cleared local state and never told the server
 * anything happened.
 * Payment fields are still a visual placeholder (no real processor wired
 * up) — that's a separate, deliberate scope boundary, not a bug.
 */
export default function Checkout({ onOrderPlaced }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", zip: "", country: "",
    cardNumber: "", expiry: "", cvc: "",
  });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await apiFetch("/api/cart");
      setCart(data.cart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCart(false);
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = 6.5;
  const total = subtotal + shipping;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const shippingAddress = {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        zip: form.zip,
        country: form.country,
      };
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
      });
      onOrderPlaced?.();
      setPlaced(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="kf-confirmation">
        <div className="kf-confirmation-mark">✓</div>
        <h1>Order placed!</h1>
        <p>Thanks for shopping small. Check "Your Orders" to see it anytime.</p>
        <button className="kf-btn-primary" onClick={() => navigate("/orders")}>View your orders</button>
      </div>
    );
  }

  if (loadingCart) {
    return <div className="kf-checkout-page"><p className="kf-empty-state">Loading your cart…</p></div>;
  }

  if (cart.length === 0) {
    return (
      <div className="kf-checkout-page">
        <p className="kf-empty-state">Your cart is empty — add something before checking out.</p>
      </div>
    );
  }

  return (
    <div className="kf-checkout-page">
      <h1>Checkout</h1>

      {error && <p className="kf-error-banner">{error}</p>}

      <form className="kf-checkout-layout" onSubmit={handlePlaceOrder}>
        <div className="kf-checkout-form">
          <section className="kf-checkout-section">
            <h2>Shipping address</h2>
            <div className="kf-form-grid">
              <label className="kf-field-full">
                <span>Full name</span>
                <input required value={form.fullName} onChange={update("fullName")} />
              </label>
              <label className="kf-field-full">
                <span>Address</span>
                <input required value={form.address} onChange={update("address")} />
              </label>
              <label>
                <span>City</span>
                <input required value={form.city} onChange={update("city")} />
              </label>
              <label>
                <span>ZIP / Postal code</span>
                <input required value={form.zip} onChange={update("zip")} />
              </label>
              <label className="kf-field-full">
                <span>Country</span>
                <input required value={form.country} onChange={update("country")} />
              </label>
            </div>
          </section>

          <section className="kf-checkout-section">
            <h2>Payment</h2>
            <div className="kf-form-grid">
              <label className="kf-field-full">
                <span>Card number</span>
                <input required placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={update("cardNumber")} />
              </label>
              <label>
                <span>Expiry</span>
                <input required placeholder="MM/YY" value={form.expiry} onChange={update("expiry")} />
              </label>
              <label>
                <span>CVC</span>
                <input required placeholder="123" value={form.cvc} onChange={update("cvc")} />
              </label>
            </div>
            <p className="kf-payment-note">🔒 This is a demo checkout — no real payment is processed.</p>
          </section>
        </div>

        <div className="kf-order-summary">
          <h2>Order Summary</h2>
          {cart.map((item, i) => (
            <div className="kf-summary-item" key={i}>
              <img src={item.product.images[0]} alt="" />
              <div>
                <p>{item.product.title}</p>
                <p className="kf-summary-item-qty">Qty {item.qty}</p>
              </div>
              <span>${(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr className="kf-stitch" />
          <div className="kf-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="kf-summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="kf-summary-row kf-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" className="kf-btn-primary kf-place-order-btn" disabled={placing}>
            {placing ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
