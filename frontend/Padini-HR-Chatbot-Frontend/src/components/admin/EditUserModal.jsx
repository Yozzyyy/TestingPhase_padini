import { useState } from "react";
import { apiFetch } from "../../utils/api";
import { displayName } from "../../utils/user";

export default function EditUserModal({ user, isSelf, onClose, onSaved }) {
  const [form, setForm] = useState({
    email: user.email,
    role: user.role,
    job_title: user.job_title ?? "",
    store_location: user.store_location ?? "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const promotingToAdmin = form.role === "Admin" && user.role !== "Admin";

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

    if (form.role === "Admin" && form.password) {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    if (promotingToAdmin && !form.password) {
      setError("A password is required when promoting a user to Admin.");
      return;
    }

    setSubmitting(true);

    try {
      const updated = await apiFetch(`/api/users/${user.user_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          email: form.email,
          role: form.role,
          job_title: form.job_title,
          store_location: form.store_location,
          password: form.role === "Admin" && form.password ? form.password : null,
        }),
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message || "Failed to update user.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-form" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Edit User</h3>
        <p className="modal-text">
          {displayName(user)} — Staff ID {user.staff_id}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={setField("email")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={form.role}
                onChange={handleRoleChange}
                disabled={isSelf}
                title={isSelf ? "You cannot change your own role" : undefined}
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
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
                value={form.store_location}
                onChange={setField("store_location")}
                required
              />
            </div>

            {form.role === "Admin" && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    {promotingToAdmin ? "Password" : "New Password (optional)"}
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder={promotingToAdmin ? "Min. 8 characters" : "Leave blank to keep current"}
                    value={form.password}
                    onChange={setField("password")}
                    minLength={8}
                    required={promotingToAdmin}
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
                    required={promotingToAdmin || !!form.password}
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit btn-inline" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
