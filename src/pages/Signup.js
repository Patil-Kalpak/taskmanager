import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name.trim());
      navigate("/dashboard");
    } catch (err) {
      const msgs = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password is too weak.",
      };
      setError(msgs[err.code] || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon">✦</div>
            <span className="auth-brand-name">TaskFlow</span>
          </div>
          <h1 className="auth-headline">
            Start doing more<br />
            <span>today.</span>
          </h1>
          <p className="auth-sub">
            Create your free account and take control of your tasks — it only takes 30 seconds.
          </p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(124,111,247,0.15)" }}>🔒</div>
            <div>
              <strong>Secure &amp; Private</strong>
              <p>Your data is protected and only yours</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(62,207,142,0.15)" }}>☁️</div>
            <div>
              <strong>Cloud Synced</strong>
              <p>Access your tasks from any device</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(247,169,111,0.15)" }}>🚀</div>
            <div>
              <strong>Free Forever</strong>
              <p>No credit card, no limits, no catch</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          {error && <div className="error-msg">⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={update("name")}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={update("password")}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={update("confirm")}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
