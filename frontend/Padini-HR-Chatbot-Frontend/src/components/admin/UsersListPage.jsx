import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { displayName } from "../../utils/user";
import EditUserModal from "./EditUserModal";

export default function UsersListPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const refresh = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/users")
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load users.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const patchLocalUser = (updated) =>
    setUsers((prev) => prev.map((u) => (u.user_id === updated.user_id ? updated : u)));

  const toggleActive = async (user) => {
    setError("");
    setTogglingId(user.user_id);
    try {
      const updated = await apiFetch(`/api/users/${user.user_id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      patchLocalUser(updated);
    } catch (err) {
      setError(err.message || "Failed to update user status.");
    } finally {
      setTogglingId(null);
      setConfirmTarget(null);
    }
  };

  const query = search.trim().toLowerCase();
  const visibleUsers = users.filter((user) => {
    if (statusFilter === "active" && !user.is_active) return false;
    if (statusFilter === "inactive" && user.is_active) return false;
    if (!query) return true;
    return (
      String(user.staff_id).includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      displayName(user).toLowerCase().includes(query) ||
      user.store_location?.toLowerCase().includes(query) ||
      user.job_title?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">View All Users</h2>
        <p className="admin-page-subtitle">Browse and search every registered account.</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            className="form-input admin-search"
            placeholder="Search by ID, name, email, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input admin-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
            <option value="all">All Users</option>
          </select>
          <button className="btn-back" onClick={refresh} title="Refresh list">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        {loading ? (
          <p className="admin-empty-state">Loading users...</p>
        ) : visibleUsers.length === 0 ? (
          <p className="admin-empty-state">No users match the current filters.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => {
                  const isSelf = user.user_id === currentUser?.user_id;
                  return (
                    <tr key={user.user_id}>
                      <td>{user.staff_id}</td>
                      <td>{displayName(user)}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.job_title ?? "—"}</td>
                      <td>{user.store_location ?? "—"}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                          {user.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn-row-action"
                            onClick={() => setEditingUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn-row-action ${user.is_active ? "danger" : "success"}`}
                            disabled={isSelf || togglingId === user.user_id}
                            title={isSelf ? "You cannot deactivate your own account" : undefined}
                            onClick={() =>
                              user.is_active ? setConfirmTarget(user) : toggleActive(user)
                            }
                          >
                            {togglingId === user.user_id
                              ? "..."
                              : user.is_active
                                ? "Deactivate"
                                : "Reactivate"}
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

        {!loading && !error && (
          <p className="admin-table-count">
            Showing {visibleUsers.length} of {users.length} users
          </p>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isSelf={editingUser.user_id === currentUser?.user_id}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            patchLocalUser(updated);
            setEditingUser(null);
          }}
        />
      )}

      {confirmTarget && (
        <div className="modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Deactivate User?</h3>
            <p className="modal-text">
              {displayName(confirmTarget)} (Staff ID {confirmTarget.staff_id}) will no
              longer be able to log in until reactivated.
            </p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmTarget(null)}>
                Cancel
              </button>
              <button
                className="btn-modal-confirm"
                disabled={togglingId === confirmTarget.user_id}
                onClick={() => toggleActive(confirmTarget)}
              >
                {togglingId === confirmTarget.user_id ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
