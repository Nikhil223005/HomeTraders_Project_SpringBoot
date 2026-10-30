import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getAdminEnquiries,
  getAgencyApplications,
  logoutSuperAdmin,
  updateAgencyApplicationStatus,
  updateEnquiryStatus,
} from "./Api/api.js";
import "./SuperAdminDashboard.css";
import SubAdminRegister from "./SubAdminRegister.jsx";

const menu = [
  { icon: "📊", name: "Dashboard" },
  { icon: "🌾", name: "Crop Management" },
  { icon: "👥", name: "Sub Admin Registration" },
  { icon: "💹", name: "Market Prices" },
  { icon: "🎓", name: "Agency Applications" },
  { icon: "✉️", name: "Enquiries" },
  { icon: "⚙️", name: "Settings" },
];

const getStatus = (item) => String(item?.status || "PENDING").toUpperCase();
const getField = (item, ...keys) =>
  keys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null && value !== "");

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  let admin = { sa_name: "Admin", sa_email: "", sa_role: "" };

  try {
    const saved = sessionStorage.getItem("superAdmin");
    if (saved) {
      const parsed = JSON.parse(saved);
      admin = {
        sa_id: parsed.sa_id || parsed.id || parsed.saId || "",
        sa_name: parsed.sa_name || parsed.name || parsed.saName || parsed.fullName || "Admin",
        sa_email: parsed.sa_email || parsed.email || parsed.saEmail || "",
        sa_role: parsed.sa_role || parsed.role || parsed.saRole || "SUPER_ADMIN",
      };
    }
  } catch (parseError) {
    console.error("Could not read the saved super admin profile.", parseError);
  }

  const [section, setSection] = useState("Dashboard");
  const [enquiries, setEnquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const [enquiryResponse, applicationResponse] = await Promise.all([
        getAdminEnquiries(),
        getAgencyApplications(),
      ]);
      setEnquiries(Array.isArray(enquiryResponse.data) ? enquiryResponse.data : []);
      setApplications(Array.isArray(applicationResponse.data) ? applicationResponse.data : []);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        sessionStorage.removeItem("superAdmin");
        navigate("/superadmin-login", { replace: true });
        return;
      }
      setError(requestError.response?.data?.message || "Could not load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const stats = useMemo(() => {
    const pendingApplications = applications.filter((item) => getStatus(item) === "PENDING").length;
    const approvedApplications = applications.filter((item) =>
      ["APPROVED", "ACCEPTED"].includes(getStatus(item))
    ).length;
    const openEnquiries = enquiries.filter((item) =>
      !["RESOLVED", "CLOSED", "COMPLETED"].includes(getStatus(item))
    ).length;

    return {
      applications: applications.length,
      pendingApplications,
      approvedApplications,
      enquiries: enquiries.length,
      openEnquiries,
      currentAdmin: admin.sa_name,
    };
  }, [admin.sa_name, applications, enquiries]);

  const logout = async () => {
    try {
      await logoutSuperAdmin();
    } catch (logoutError) {
      console.error("Could not complete the super admin logout request.", logoutError);
    }
    sessionStorage.removeItem("superAdmin");
    navigate("/superadmin-login", { replace: true });
  };

  const updateApplication = async (application, status) => {
    setUpdatingId(application.id);
    setError("");
    try {
      await updateAgencyApplicationStatus(application.id, status);
      await loadRequests();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateEnquiry = async (enquiry, status) => {
    setUpdatingId(enquiry.id);
    setError("");
    try {
      await updateEnquiryStatus(enquiry.id, status);
      await loadRequests();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update enquiry.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? "Date unavailable" : parsedDate.toLocaleString();
  };

  const openSection = (name) => {
    if (["Dashboard", "Sub Admin Registration", "Agency Applications", "Enquiries"].includes(name)) {
      setSection(name);
      setSearch("");
      setStatusFilter("ALL");
      return;
    }
    window.alert(`${name} page is not connected yet.`);
  };

  const filteredItems = (items) => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const currentStatus = getStatus(item);
      const matchesStatus = statusFilter === "ALL" ||
        (statusFilter === "APPROVED" && ["APPROVED", "ACCEPTED"].includes(currentStatus)) ||
        (statusFilter === "RESOLVED" && ["RESOLVED", "CLOSED", "COMPLETED"].includes(currentStatus)) ||
        currentStatus === statusFilter;
      const searchableText = Object.values(item || {}).join(" ").toLowerCase();
      return matchesStatus && (!query || searchableText.includes(query));
    });
  };

  const renderRequestCard = (item, type) => {
    const isApplication = type === "application";
    const name = getField(
      item,
      ...(isApplication
        ? ["agencyName", "companyName", "name", "applicantName"]
        : ["name", "fullName", "customerName", "senderName"])
    ) || (isApplication ? "Agency application" : "Enquiry");
    const email = getField(item, "email", "agencyEmail", "applicantEmail");
    const phone = getField(item, "mobile", "phone", "phoneNumber", "contactNumber");
    const date = getField(item, "createdAt", "submittedAt", "applicationDate", "date");
    const status = getStatus(item);
    const summary = getField(item, "message", "description", "address");
    const isUpdating = updatingId === item.id;

    return (
      <article className="sa-request-card" key={`${type}-${item.id}`}>
        <div className="sa-request-heading">
          <div>
            <h3>{name}</h3>
            {date && <small>{formatDate(date)}</small>}
          </div>
          <span className={`sa-status ${status.toLowerCase()}`}>{status.replaceAll("_", " ")}</span>
        </div>
        <div className="sa-request-details">
          {email && <p><strong>Email:</strong> {email}</p>}
          {phone && <p><strong>Phone:</strong> {phone}</p>}
        </div>
        {summary && <p className="sa-request-message">{summary}</p>}
        <div className="sa-request-actions">
          {isApplication && !["APPROVED", "ACCEPTED"].includes(status) && (
            <button className="sa-accept" disabled={isUpdating} onClick={() => updateApplication(item, "APPROVED")}>
              {isUpdating ? "Updating..." : "Approve agency"}
            </button>
          )}
          {isApplication && status === "PENDING" && (
            <button className="sa-reject" disabled={isUpdating} onClick={() => updateApplication(item, "REJECTED")}>
              Reject
            </button>
          )}
          {!isApplication && !["RESOLVED", "CLOSED", "COMPLETED"].includes(status) && (
            <button className="sa-accept" disabled={isUpdating} onClick={() => updateEnquiry(item, "RESOLVED")}>
              {isUpdating ? "Updating..." : "Mark resolved"}
            </button>
          )}
        </div>
      </article>
    );
  };

  if (!sessionStorage.getItem("superAdmin")) {
    return <Navigate to="/superadmin-login" replace />;
  }

  const statCards = [
    { icon: "🏢", label: "Agency applications", value: stats.applications, detail: "All submitted applications", section: "Agency Applications", tone: "green" },
    { icon: "⏳", label: "Pending applications", value: stats.pendingApplications, detail: "Waiting for review", section: "Agency Applications", filter: "PENDING", tone: "amber" },
    { icon: "✅", label: "Approved agencies", value: stats.approvedApplications, detail: "Accepted applications", section: "Agency Applications", filter: "APPROVED", tone: "blue" },
    { icon: "✉️", label: "Total enquiries", value: stats.enquiries, detail: "Received by the platform", section: "Enquiries", tone: "purple" },
    { icon: "📬", label: "Open enquiries", value: stats.openEnquiries, detail: "Need a response", section: "Enquiries", tone: "rose" },
  ];

  return (
    <div className="sa-dashboard">
      <aside className="sa-sidebar">
        <div className="sa-logo">🌾 Homesteader</div>
        <p className="sa-menu-title">MAIN MENU</p>
        {menu.map((item) => {
          const badgeCount = item.name === "Agency Applications"
            ? stats.pendingApplications
            : item.name === "Enquiries"
              ? stats.openEnquiries
              : 0;
          return (
          <button
            key={item.name}
            className={`sa-menu-item ${section === item.name ? "active" : ""}`}
            onClick={() => openSection(item.name)}
          >
            <span className="sa-menu-icon">{item.icon}</span>
            <span className="sa-menu-label">{item.name}</span>
            {badgeCount > 0 && <span className="sa-menu-badge">{badgeCount}</span>}
          </button>
          );
        })}
        <button className="sa-logout" onClick={logout}>↪ Logout</button>
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
              <strong>{admin.sa_name}</strong>
              <p>{admin.sa_role}</p>
            </div>
          </div>
        </header>

        {error && <p className="sa-error" role="alert">{error}</p>}

        {section === "Dashboard" && (
          <>
            <section className="sa-welcome">
              <div>
                <h2>Welcome back, {admin.sa_name}! 👋</h2>
                <p>Here&apos;s your platform management overview.</p>
              </div>
              <div className="sa-welcome-meta">
                <span>🌿 Homesteader Admin</span>
                <button className="sa-refresh sa-refresh-light" onClick={loadRequests} disabled={isLoading}>
                  {isLoading ? "Refreshing..." : "↻ Refresh data"}
                </button>
              </div>
            </section>

            <section className="sa-stats" aria-label="Platform overview">
              {statCards.map((stat) => (
                <button
                  type="button"
                  className={`sa-stat-card sa-stat-button sa-stat-${stat.tone}`}
                  key={stat.label}
                  onClick={() => {
                    setSection(stat.section);
                    setSearch("");
                    setStatusFilter(stat.filter || "ALL");
                  }}
                >
                  <span className="sa-stat-top">
                    <span className="sa-stat-icon">{stat.icon}</span>
                    <span className="sa-stat-arrow">↗</span>
                  </span>
                  <span className="sa-stat-label">{stat.label}</span>
                  <strong className="sa-stat-value">{isLoading ? "—" : stat.value}</strong>
                  <span className="sa-stat-detail">{stat.detail}</span>
                </button>
              ))}
            </section>

            <section className="sa-dashboard-lower">
              <article className="sa-panel sa-activity-panel">
                <div className="sa-panel-heading">
                  <div>
                    <h2>Recent activity</h2>
                    <p>Latest agency applications and enquiries</p>
                  </div>
                  <button className="sa-text-button" onClick={() => openSection("Agency Applications")}>View applications →</button>
                </div>
                {isLoading ? (
                  <div className="sa-state">Loading recent activity...</div>
                ) : applications.length + enquiries.length === 0 ? (
                  <div className="sa-state">No applications or enquiries have been received yet.</div>
                ) : (
                  <div className="sa-activity-list">
                    {[...applications.map((item) => ({ ...item, _type: "application" })),
                      ...enquiries.map((item) => ({ ...item, _type: "enquiry" }))]
                      .sort((a, b) => new Date(getField(b, "createdAt", "submittedAt", "date") || 0) -
                        new Date(getField(a, "createdAt", "submittedAt", "date") || 0))
                      .slice(0, 5)
                      .map((item) => (
                        <button
                          type="button"
                          className="sa-activity-item"
                          key={`${item._type}-${item.id}`}
                          onClick={() => openSection(item._type === "application" ? "Agency Applications" : "Enquiries")}
                        >
                          <span className={`sa-activity-icon ${item._type}`}>
                            {item._type === "application" ? "🏢" : "✉️"}
                          </span>
                          <span className="sa-activity-copy">
                            <strong>
                              {getField(item, "agencyName", "companyName", "name", "applicantName") ||
                                (item._type === "application" ? "Agency application" : "New enquiry")}
                            </strong>
                            <small>{item._type === "application" ? "Agency application" : "Customer enquiry"}</small>
                          </span>
                          <span className={`sa-status ${getStatus(item).toLowerCase()}`}>
                            {getStatus(item).replaceAll("_", " ")}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </article>

              <article className="sa-panel sa-admin-info">
                <div className="sa-panel-heading">
                  <div>
                    <h2>Admin profile</h2>
                    <p>Signed-in account</p>
                  </div>
                  <span className="sa-profile-badge">● Active</span>
                </div>
                <div className="sa-info-row"><span>Name</span><strong>{admin.sa_name}</strong></div>
                <div className="sa-info-row"><span>Email</span><strong>{admin.sa_email || "Not provided"}</strong></div>
                <div className="sa-info-row"><span>Role</span><strong>{admin.sa_role}</strong></div>
                <div className="sa-account-note">
                  The connected frontend does not provide platform-wide user or admin totals.
                </div>
                <button className="sa-profile-action" onClick={() => openSection("Sub Admin Registration")}>
                  + Register a sub admin
                </button>
              </article>
            </section>
          </>
        )}

        {section === "Sub Admin Registration" && <SubAdminRegister />}

        {(section === "Agency Applications" || section === "Enquiries") && (
          <section className="sa-request-section">
            <div className="sa-section-heading">
              <div>
                <h2>{section}</h2>
                <p>
                  {section === "Agency Applications"
                    ? `${applications.length} applications received`
                    : `${enquiries.length} enquiries received`}
                </p>
              </div>
              <button className="sa-refresh" onClick={loadRequests} disabled={isLoading}>
                {isLoading ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>
            <div className="sa-list-controls">
              <label className="sa-search">
                <span>⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${section.toLowerCase()}...`}
                  aria-label={`Search ${section.toLowerCase()}`}
                />
              </label>
              <label className="sa-filter">
                <span>Status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="ALL">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </label>
              <button className="sa-clear-filter" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
                Clear filters
              </button>
            </div>
            {isLoading ? (
              <div className="sa-state">Loading {section.toLowerCase()}...</div>
            ) : filteredItems(section === "Agency Applications" ? applications : enquiries).length === 0 ? (
              <div className="sa-state">
                {search || statusFilter !== "ALL" ? "No records match these filters." : `No ${section.toLowerCase()} found.`}
              </div>
            ) : (
              <div className="sa-request-list">
                {filteredItems(section === "Agency Applications" ? applications : enquiries).map((item) =>
                  renderRequestCard(item, section === "Agency Applications" ? "application" : "enquiry")
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
