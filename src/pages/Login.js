import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const msgs = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-email": "Invalid email address.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/too-many-requests": "Too many attempts. Please try later.",
      };
      setError(msgs[err.code] || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon">✦</div>
            <span className="auth-brand-name">TaskFlow</span>
          </div>
          <h1 className="auth-headline">
            Manage your work<br />
            <span>with clarity.</span>
          </h1>
          <p className="auth-sub">
            Stay organised, hit your goals, and never lose track of what matters most.
          </p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(124,111,247,0.15)" }}>📊</div>
            <div>
              <strong>Visual Dashboard</strong>
              <p>Track your progress with live analytics</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(62,207,142,0.15)" }}>✅</div>
            <div>
              <strong>Smart Task Management</strong>
              <p>Priorities, deadlines and completion tracking</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(247,169,111,0.15)" }}>⚡</div>
            <div>
              <strong>Real-time Sync</strong>
              <p>Powered by Firebase — always up to date</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">
            Don't have an account?(test) <Link to="/signup">Sign up free</Link>
          </p>
          {error && <div className="error-msg">⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
