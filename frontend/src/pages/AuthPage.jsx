import { useState } from "react";
import "./Theme.css";
import "./AuthPage.css";

/**
 * Kraftly — Auth page.
 * Real login/register, calling the backend we built (/api/auth/login,
 * /api/auth/register). "Sign up with Google" is shown as a visual option
 * since it's a common expectation, but is not wired up — real Google
 * OAuth requires a separate setup (Google Cloud console + OAuth
 * credentials) that's a good next step, not something fakeable safely.
 */
export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const rawText = await res.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("Server returned an unexpected response");
      }

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("kf_token", data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kf-auth-page">
      <div className="kf-auth-hero">
        <div className="kf-auth-hero-content">
          <div className="kf-auth-mark">✦</div>
          <p className="kf-hero-eyebrow">Digital Products · Ebooks · Handmade Goods</p>
          <h1>
            Join a marketplace
            <br />
            <em>built for makers.</em>
          </h1>
          <p className="kf-hero-sub">
            Buy from thousands of independent shops, or open your own —
            with zero listing fees.
          </p>
        </div>
      </div>

      <div className="kf-auth-panel">
        <div className="kf-auth-card">
          <div className="kf-auth-tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
              Sign in
            </button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
              Create account
            </button>
          </div>

          <button type="button" className="kf-google-btn" disabled title="Coming soon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.58v3h3.93c2.3-2.12 3.53-5.24 3.53-8.82z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.93-3c-1.09.73-2.5 1.16-4 1.16-3.08 0-5.68-2.08-6.61-4.87H1.34v3.09C3.31 21.3 7.34 24 12 24z" />
              <path fill="#FBBC05" d="M5.39 14.38A7.2 7.2 0 010 12c0-.83.14-1.63.39-2.38V6.53H1.34a12 12 0 000 10.94z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.34 0 3.31 2.7 1.34 6.53l4.05 3.09C6.32 6.83 8.92 4.75 12 4.75z" />
            </svg>
            Continue with Google — coming soon
          </button>

          <div className="kf-auth-divider"><span>or</span></div>

          <form onSubmit={handleAuth} className="kf-auth-form">
            {mode === "register" && (
              <label className="kf-field">
                <span>Full name</span>
                <input required value={form.name} onChange={update("name")} placeholder="Aiko Tanaka" />
              </label>
            )}
            <label className="kf-field">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
            </label>
            <label className="kf-field">
              <span>Password</span>
              <input type="password" required minLength={6} value={form.password} onChange={update("password")} placeholder="••••••••" />
            </label>

            {error && <p className="kf-auth-error">{error}</p>}

            <button type="submit" className="kf-btn-primary kf-auth-submit" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="kf-auth-switch">
            {mode === "login" ? "New to Kraftly?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
