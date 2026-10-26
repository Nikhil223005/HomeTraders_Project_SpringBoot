
import React, { useState } from "react";
import "./SuperAdminLogin.css";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo only: connect this form to your backend for real authentication.
    setError("Login authentication is not connected yet.");
  };

  return (
    <div className="superadmin-page">
      <div className="superadmin-image">
        <div className="superadmin-image-content">
          <div className="superadmin-brand-icon">🌾</div>
          <h1>Homesteader</h1>
          <p>Empowering farmers. Growing a better future.</p>
          <div className="superadmin-image-note">
            Agriculture Management Portal
          </div>
        </div>
      </div>

      <div className="superadmin-form-section">
        <a href="/" className="superadmin-back">
          ← Back to Home
        </a>

        <form className="superadmin-card" onSubmit={handleLogin}>
          <div className="superadmin-lock">♙</div>
          <p className="superadmin-eyebrow">ADMINISTRATION PORTAL</p>
          <h2>Super Admin Login</h2>
          <p className="superadmin-subtitle">
            Sign in to manage your Homesteader platform.
          </p>

          <label htmlFor="admin-email">Email Address</label>
          <input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="superadmin-password-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="superadmin-show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="superadmin-error">{error}</p>}

          <button type="submit" className="superadmin-submit">
            Sign In to Dashboard →
          </button>

          <p className="superadmin-security">
            🔒 Authorized administrators only
          </p>
        </form>

        <p className="superadmin-footer">
          © 2026 Homesteader · Agriculture Management System
        </p>
      </div>
    </div>
  );
}
