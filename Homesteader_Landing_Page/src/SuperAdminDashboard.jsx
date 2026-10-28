import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getAdminEnquiries,
  getAgencyApplications,
  logoutSuperAdmin,
  updateAgencyApplicationStatus,
  updateEnquiryStatus,
} from "./Api/api.js";
import "./SuperAdminDashboard.css";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const adminData = sessionStorage.getItem("superAdmin");
  const [section, setSection] = useState("Dashboard");
  const [enquiries, setEnquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setError("");
    try {
      const [enquiryResponse, applicationResponse] = await Promise.all([
        getAdminEnquiries(),
        getAgencyApplications(),
      ]);
      setEnquiries(enquiryResponse.data);
      setApplications(applicationResponse.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        sessionStorage.removeItem("superAdmin");
        navigate("/superadmin-login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?.message ||
          "Could not load enquiries and agency applications."
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  if (!adminData) {
    return <Navigate to="/superadmin-login" replace />;
  }

  const admin = JSON.parse(adminData);

  const logout = async () => {
    try {
      await logoutSuperAdmin();
    } catch {
      setError("Could not confirm server logout. Your local session was cleared.");
    } finally {
      sessionStorage.removeItem("superAdmin");
      navigate("/superadmin-login", { replace: true });
    }
  };

  const updateApplication = async (application, status) => {
    setError("");
    try {
      await updateAgencyApplicationStatus(application.id, status);
      await loadRequests();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not update the agency application."
      );
    }
  };

  const updateEnquiry = async (enquiry, status) => {
    setError("");
    try {
      await updateEnquiryStatus(enquiry.id, status);
      await loadRequests();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not update the enquiry."
      );
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "Date unavailable";

  const menu = [
    { icon: "📊", name: "Dashboard" },
    { icon: "🌾", name: "Crop Management" },
    { icon: "👨‍🌾", name: "Farmer Management" },
    { icon: "💹", name: "Market Prices" },
    { icon: "🎓", name: "Agency Applications" },
    { icon: "✉️", name: "Enquiries" },
    { icon: "⚙️", name: "Settings" },
    { icon: "↪", name: "Logout" }
  ];

  const openSection = (name) => {
    if (name === "Dashboard" || name === "Agency Applications" || name === "Enquiries") {
      setSection(name);
      return;
    }
    window.alert(`${name} page is not connected yet.`);
  };

  return (
    <div className="sa-dashboard">
      <aside className="sa-sidebar">
        <div className="sa-logo">🌾 Homesteader</div>
        <p className="sa-menu-title">MAIN MENU</p>

        {menu.map((item) => (
          <button
            key={item.name}
            className={`sa-menu-item ${section === item.name ? "active" : ""}`}
            onClick={() => openSection(item.name)}
          >
            <span>{item.icon}</span> {item.name}
          </button>
        ))}

        <button className="sa-logout" onClick={logout}>
          ↪ Logout
        </button>
      </aside>

      <main className="sa-main">
        <header className="sa-header">
          <div>
            <h1>Super Admin Dashboard</h1>
            <p>Manage your Homesteader agriculture platform.</p>
          </div>

          <div className="sa-profile">
            <div className="sa-avatar">👤</div>
            <div>
              <strong>{admin.sa_name || "Super Admin"}</strong>
              <p>{admin.sa_role || "SUPER_ADMIN"}</p>
            </div>
          </div>
        </header>

        {error && <p className="sa-error" role="alert">{error}</p>}

        <section className="sa-welcome">
          <div>
            <h2>Welcome back, {admin.sa_name || "Admin"}! 👋</h2>
            <p>Here's your platform management overview.</p>
          </div>
          <span>🌿 Homesteader Admin</span>
        </section>

        <section className="sa-stats">
          <article className="sa-stat-card">
            <div className="sa-stat-icon">🌱</div>
            <h3>Total Crops</h3>
            <p>Manage crops</p>
          </article>
          <article className="sa-stat-card">
            <div className="sa-stat-icon">👨‍🌾</div>
            <h3>Registered Farmers</h3>
            <p>Manage farmers</p>
          </article>
          <article className="sa-stat-card">
            <div className="sa-stat-icon">💹</div>
            <h3>Market Prices</h3>
            <p>Update prices</p>
          </article>
          <button
            className="sa-stat-card sa-stat-button"
            onClick={() => setSection("Enquiries")}
          >
            <div className="sa-stat-icon">✉️</div>
            <h3>New Enquiries</h3>
            <p>{enquiries.filter((item) => item.status === "PENDING").length} to review</p>
          </button>
        </section>

        <section className="sa-content-grid">
          <article className="sa-panel">
            <h2>Quick Actions</h2>
            <p>Choose an area to manage.</p>

            <div className="sa-actions">
              <button onClick={() => openSection("Crop Management")}>
                🌾 Manage Crops
              </button>
              <button onClick={() => openSection("Farmer Management")}>
                👨‍🌾 View Farmers
              </button>
              <button onClick={() => openSection("Market Prices")}>
                💹 Update Market Prices
              </button>
              <button onClick={() => setSection("Enquiries")}>
                ✉️ View Enquiries ({enquiries.filter((item) => item.status === "PENDING").length})
              </button>
              <button onClick={() => setSection("Agency Applications")}>
                🎓 Agency Applications ({applications.filter((item) => item.status === "PENDING").length})
              </button>
            </div>
          </article>

          <article className="sa-panel sa-admin-info">
            <h2>Admin Profile</h2>
            <div className="sa-info-row">
              <span>Name</span>
              <strong>{admin.sa_name || "Super Admin"}</strong>
            </div>
            <div className="sa-info-row">
              <span>Email</span>
              <strong>{admin.sa_email || "Not available"}</strong>
            </div>
            <div className="sa-info-row">
              <span>Role</span>
              <strong>{admin.sa_role || "SUPER_ADMIN"}</strong>
            </div>
            <div className="sa-secure-note">🔒 Super Admin area</div>
          </article>
        </section>

        {section === "Agency Applications" ? (
          <section className="sa-request-section">
            <div className="sa-section-heading">
              <div>
                <h2>Agency applications</h2>
                <p>Accept agencies that can provide support to farmers, or reject applications.</p>
              </div>
              <button className="sa-refresh" onClick={loadRequests}>Refresh</button>
            </div>
            {isLoading ? (
              <p className="sa-state">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="sa-state">No agency applications have been submitted.</p>
            ) : (
              <div className="sa-request-list">
                {applications.map((application) => (
                  <article className="sa-request-card" key={application.id}>
                    <div className="sa-request-heading">
                      <div>
                        <h3>{application.agencyName}</h3>
                        <span className={`sa-status ${application.status.toLowerCase()}`}>
                          {application.status}
                        </span>
                      </div>
                      <small>{formatDate(application.createdAt)}</small>
                    </div>
                    <div className="sa-request-details">
                      <p><b>Contact:</b> {application.contactName}</p>
                      <p><b>Email:</b> {application.email}</p>
                      <p><b>Phone:</b> {application.phone}</p>
                      <p><b>Service area:</b> {application.serviceArea}</p>
                    </div>
                    <p className="sa-request-message">{application.description}</p>
                    {application.status === "PENDING" && (
                      <div className="sa-request-actions">
                        <button
                          className="sa-accept"
                          onClick={() => updateApplication(application, "ACCEPTED")}
                        >
                          Accept application
                        </button>
                        <button
                          className="sa-reject"
                          onClick={() => updateApplication(application, "REJECTED")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="sa-request-section">
            <div className="sa-section-heading">
              <div>
                <h2>Farmer enquiries</h2>
                <p>Read requests for help and mark them resolved when handled.</p>
              </div>
              <button className="sa-refresh" onClick={loadRequests}>Refresh</button>
            </div>
            {isLoading ? (
              <p className="sa-state">Loading enquiries...</p>
            ) : enquiries.length === 0 ? (
              <p className="sa-state">No farmer enquiries have been submitted.</p>
            ) : (
              <div className="sa-request-list">
                {enquiries.map((enquiry) => (
                  <article className="sa-request-card" key={enquiry.id}>
                    <div className="sa-request-heading">
                      <div>
                        <h3>{enquiry.topic}</h3>
                        <span className={`sa-status ${enquiry.status.toLowerCase()}`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <small>{formatDate(enquiry.createdAt)}</small>
                    </div>
                    <div className="sa-request-details">
                      <p><b>From:</b> {enquiry.name}</p>
                      <p><b>Email:</b> {enquiry.email}</p>
                    </div>
                    <p className="sa-request-message">{enquiry.message}</p>
                    {enquiry.status === "PENDING" && (
                      <div className="sa-request-actions">
                        <button
                          className="sa-accept"
                          onClick={() => updateEnquiry(enquiry, "RESOLVED")}
                        >
                          Mark resolved
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="sa-footer">
          © 2026 Homesteader | Agriculture Management Portal
        </footer>
      </main>
    </div>
  );
}
