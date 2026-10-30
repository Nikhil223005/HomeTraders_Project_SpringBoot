import React, { useCallback, useEffect, useState } from "react";
import { getSubAdmins, registerSubAdmin } from "./Api/api.js";
import "./SubAdminRegister.css";

const emptyForm = {
  sa_name: "",
  sa_email: "",
  sa_mobile: "",
  sa_pass: "",
  confirmPassword: "",
};

const getSubAdminId = (subAdmin) => subAdmin.sid || subAdmin.id;

export default function SubAdminRegister() {
  const [form, setForm] = useState(emptyForm);
  const [subAdmins, setSubAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");

  const loadSubAdmins = useCallback(async () => {
    setIsLoadingList(true);
    setListError("");
    try {
      const response = await getSubAdmins();
      if (!Array.isArray(response.data)) {
        throw new Error("The server returned an unexpected sub-admin list.");
      }
      setSubAdmins(response.data);
    } catch (requestError) {
      setListError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not load sub-admins."
      );
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadSubAdmins();
  }, [loadSubAdmins]);

  const clearForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (editingId) {
      setSubAdmins((current) =>
        current.map((subAdmin) =>
          getSubAdminId(subAdmin) === editingId
            ? {
                ...subAdmin,
                sname: form.sa_name.trim(),
                semail: form.sa_email.trim(),
                smobile: form.sa_mobile.trim(),
              }
            : subAdmin
        )
      );
      clearForm();
      setMessage("Sub-admin details updated in this screen only; the server does not support editing yet.");
      return;
    }

    if (form.sa_pass !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.sa_pass.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerSubAdmin({
        sname: form.sa_name.trim(),
        semail: form.sa_email.trim(),
        smobile: form.sa_mobile.trim(),
        spass: form.sa_pass,
        scpass: form.confirmPassword,
        srole: "SUB_ADMIN",
      });

      setMessage(typeof response.data === "string" ? response.data : "Sub Admin registered successfully!");
      setForm(emptyForm);
      await loadSubAdmins();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (typeof requestError.response?.data === "string" ? requestError.response.data : "") ||
          requestError.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const beginEdit = (subAdmin) => {
    setEditingId(getSubAdminId(subAdmin));
    setForm({
      sa_name: subAdmin.sname || "",
      sa_email: subAdmin.semail || "",
      sa_mobile: subAdmin.smobile || "",
      sa_pass: "",
      confirmPassword: "",
    });
    setError("");
    setMessage("");
    document.querySelector(".subadmin-register-page")?.scrollIntoView({ behavior: "smooth" });
  };

  const removeFromCurrentView = (subAdmin) => {
    const name = subAdmin.sname || "this sub-admin";
    if (!window.confirm(`Remove ${name} from the current list? This will not delete the server record.`)) {
      return;
    }

    const id = getSubAdminId(subAdmin);
    setSubAdmins((current) => current.filter((entry) => getSubAdminId(entry) !== id));
    setMessage(`${name} was removed from this screen only; the server does not support deletion yet.`);
    setError("");
  };

  const filteredSubAdmins = subAdmins.filter((subAdmin) =>
    [subAdmin.sname, subAdmin.semail, subAdmin.smobile, subAdmin.srole]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="subadmin-register-page">
      <div className="subadmin-register-heading">
        <div>
          <span className="subadmin-eyebrow">USER MANAGEMENT</span>
          <h2>Sub Admins</h2>
          <p>Register and manage administrator accounts for Homesteader.</p>
        </div>
        <div className="subadmin-heading-icon">👥</div>
      </div>

      <form className="subadmin-register-card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Sub Admin" : "Register Sub Admin"}</h3>
        <p className="subadmin-form-description">
          {editingId
            ? "Update the account details below. This edit is temporary until the server provides an update endpoint."
            : "Enter the details below to create a Sub Admin account."}
        </p>

        <div className="subadmin-form-grid">
          <div className="subadmin-field">
            <label htmlFor="sa_name">Full Name</label>
            <input
              id="sa_name"
              type="text"
              name="sa_name"
              placeholder="Enter full name"
              value={form.sa_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="subadmin-field">
            <label htmlFor="sa_email">Email Address</label>
            <input
              id="sa_email"
              type="email"
              name="sa_email"
              placeholder="admin@example.com"
              value={form.sa_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="subadmin-field">
            <label htmlFor="sa_mobile">Mobile Number</label>
            <input
              id="sa_mobile"
              type="tel"
              name="sa_mobile"
              placeholder="Enter mobile number"
              value={form.sa_mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div className="subadmin-field">
            <label htmlFor="sa_role">Admin Role</label>
            <input id="sa_role" type="text" value="SUB_ADMIN" readOnly />
          </div>

          {!editingId && (
            <>
              <div className="subadmin-field">
                <label htmlFor="sa_pass">Password</label>
                <input
                  id="sa_pass"
                  type="password"
                  name="sa_pass"
                  placeholder="Minimum 8 characters"
                  value={form.sa_pass}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <div className="subadmin-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
        </div>

        {error && <div className="subadmin-message error" role="alert">{error}</div>}
        {message && <div className="subadmin-message success" role="status">{message}</div>}

        <div className="subadmin-form-actions">
          <button type="button" className="subadmin-reset-btn" onClick={clearForm}>
            {editingId ? "Cancel edit" : "Clear Form"}
          </button>
          <button type="submit" className="subadmin-submit-btn" disabled={loading}>
            {loading ? "Registering..." : editingId ? "Save edit on screen" : "Create Sub Admin"}
          </button>
        </div>
      </form>

      <section className="subadmin-list-section" aria-labelledby="subadmin-list-title">
        <div className="subadmin-list-heading">
          <div>
            <span className="subadmin-eyebrow">ACCOUNT DIRECTORY</span>
            <h3 id="subadmin-list-title">Registered Sub Admins</h3>
            <p>{isLoadingList ? "Loading accounts..." : `${subAdmins.length} account${subAdmins.length === 1 ? "" : "s"}`}</p>
          </div>
          <button
            type="button"
            className="subadmin-refresh-btn"
            onClick={loadSubAdmins}
            disabled={isLoadingList}
          >
            {isLoadingList ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        <div className="subadmin-local-notice">
          <span aria-hidden="true">ℹ️</span>
          <p>
            The list is loaded from the server. Edit and delete are screen-only for now;
            your server currently has no update or delete API.
          </p>
        </div>

        <label className="subadmin-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or mobile..."
            aria-label="Search sub-admin accounts"
          />
        </label>

        {listError && <div className="subadmin-message error" role="alert">{listError}</div>}

        {isLoadingList ? (
          <div className="subadmin-list-state">Loading registered accounts...</div>
        ) : filteredSubAdmins.length === 0 ? (
          <div className="subadmin-list-state">
            {search ? "No accounts match your search." : "No sub-admin accounts found yet."}
          </div>
        ) : (
          <div className="subadmin-table-wrap">
            <table className="subadmin-table">
              <thead>
                <tr>
                  <th scope="col">Sub Admin</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubAdmins.map((subAdmin, index) => {
                  const id = getSubAdminId(subAdmin) || `${subAdmin.semail}-${index}`;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="subadmin-table-person">
                          <span className="subadmin-table-avatar">
                            {(subAdmin.sname || "S").trim().charAt(0).toUpperCase()}
                          </span>
                          <strong>{subAdmin.sname || "Unnamed account"}</strong>
                        </div>
                      </td>
                      <td>{subAdmin.semail || "—"}</td>
                      <td>{subAdmin.smobile || "—"}</td>
                      <td><span className="subadmin-role-pill">{subAdmin.srole || "SUB_ADMIN"}</span></td>
                      <td>
                        <div className="subadmin-row-actions">
                          <button
                            type="button"
                            className="subadmin-edit-btn"
                            onClick={() => beginEdit(subAdmin)}
                            disabled={!getSubAdminId(subAdmin)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="subadmin-delete-btn"
                            onClick={() => removeFromCurrentView(subAdmin)}
                            disabled={!getSubAdminId(subAdmin)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
