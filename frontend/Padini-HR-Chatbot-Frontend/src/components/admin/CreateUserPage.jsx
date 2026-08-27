import { useState } from "react";
import { apiFetch } from "../../utils/api";

const EMPTY_FORM = {
  staff_id: "",
  email: "",
  role: "Staff",
  job_title: "",
  store_location: "",
  password: "",
  confirmPassword: "",
};

export default function CreateUserPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isAdminRole = form.role === "Admin";

  const handleRoleChange = (e) => {
    const role = e.target.value;
    // Clear any typed password when switching back to Staff so a stale
    // value is never submitted
    setForm((prev) => ({
      ...prev,
      role,
      ...(role !== "Admin" ? { password: "", confirmPassword: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isAdminRole) {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          staff_id: Number(form.staff_id),
          email: form.email,
          role: form.role,
          job_title: form.job_title,
          store_location: form.store_location,
          password: isAdminRole ? form.password : null,
        }),
      });
      setSuccess(`User created successfully (Staff ID ${form.staff_id}).`);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Create User</h2>
        <p className="admin-page-subtitle">Register a new staff member or administrator account.</p>
      </div>

      <div className="admin-card">
        {error && <div className="login-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Staff ID</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 1002"
                value={form.staff_id}
                onChange={setField("staff_id")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@padini.com"
                value={form.email}
                onChange={setField("email")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={handleRoleChange}>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Retail Associate"
                value={form.job_title}
                onChange={setField("job_title")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Store Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mid Valley Megamall"
                value={form.store_location}
                onChange={setField("store_location")}
                required
              />
            </div>

            {isAdminRole && (
              <>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={setField("password")}
                    minLength={8}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={setField("confirmPassword")}
                    minLength={8}
                    required
                  />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="btn-submit btn-inline" disabled={submitting}>
            {submitting ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
