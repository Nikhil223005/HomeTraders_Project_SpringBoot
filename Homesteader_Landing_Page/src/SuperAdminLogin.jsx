
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin } from "./Api/api.js";
import "./SuperAdminLogin.css";

export default function SuperAdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await loginSuperAdmin({
        email: email.trim(),
        password,
      });
      const admin = response.data?.admin;
      if (!admin) {
        setError(response.data?.message || "Admin details were not returned by the server.");
        return;
      }

 const role = String(admin.role || admin.saRole || admin.sa_role || admin.srole || "").toUpperCase();
 if (role === "SUB_ADMIN") {
   sessionStorage.removeItem("superAdmin");
   sessionStorage.setItem(
     "subAdmin",
     JSON.stringify({
       sid: admin.sid || admin.id,
       sname: admin.sname || admin.name || admin.saName || admin.sa_name,
       semail: admin.semail || admin.email || admin.saEmail || admin.sa_email,
       srole: role,
     })
   );
   navigate("/subadmin-dashboard", { replace: true });
   return;
 }

 sessionStorage.removeItem("subAdmin");
 sessionStorage.setItem(
  "superAdmin",
  JSON.stringify({
    sa_id: admin.id || admin.saId || admin.sa_id,
    sa_name: admin.name || admin.saName || admin.sa_name, // FIX HERE
    sa_email: admin.email || admin.saEmail || admin.sa_email,
    sa_role: admin.role || admin.saRole || admin.sa_role,
  })
);
      navigate("/superadmin-dashboard", { replace: true });
    } catch (loginError) {
      if (loginError.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (loginError.response?.data?.message) {
        setError(loginError.response.data.message);
      } else {
        setError(
          loginError.message ||
            "Unable to connect to the login service. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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

        <form
          className="superadmin-card"
          onSubmit={handleLogin}
        >
          <div className="superadmin-lock">♙</div>

          <p className="superadmin-eyebrow">
            ADMINISTRATION PORTAL
          </p>

          <h2> Login</h2>

          <p className="superadmin-subtitle">
            Sign in to open your Homesteader management workspace.
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

          {error && (
            <p className="superadmin-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="superadmin-success" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="superadmin-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In to Dashboard →"}
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
