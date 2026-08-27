import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

// Timestamps are stored as naive UTC; append "Z" so the browser
// converts them to the viewer's local time
const formatTime = (value) => {
  if (!value) return "—";
  const iso = /Z|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`;
  return new Date(iso).toLocaleString();
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/audit-logs")
      .then((data) => {
        if (!cancelled) setLogs(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load audit logs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Failed attempts against nonexistent accounts have no linked user,
  // only the identifier that was typed at the login screen
  const identifierFor = (log) =>
    log.staff_id ?? log.email ?? log.attempted_identifier ?? "Unknown";

  const query = search.trim().toLowerCase();
  const visibleLogs = logs.filter((log) => {
    if (statusFilter !== "all" && log.login_status !== statusFilter) return false;
    if (!query) return true;
    return (
      String(identifierFor(log)).toLowerCase().includes(query) ||
      log.email?.toLowerCase().includes(query) ||
      log.ip_address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">View All Logs</h2>
        <p className="admin-page-subtitle">
          Every login attempt recorded by the system, successful or failed.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            className="form-input admin-search"
            placeholder="Search by staff ID, email, IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input admin-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Attempts</option>
            <option value="Success">Successful Only</option>
            <option value="Failed">Failed Only</option>
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
          <p className="admin-empty-state">Loading audit logs...</p>
        ) : visibleLogs.length === 0 ? (
          <p className="admin-empty-state">No log entries match the current filters.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Staff ID / Identifier</th>
                  <th>Email</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.map((log) => (
                  <tr key={log.log_id}>
                    <td>{formatTime(log.login_time)}</td>
                    <td>{identifierFor(log)}</td>
                    <td>{log.email ?? "—"}</td>
                    <td>{log.ip_address ?? "—"}</td>
                    <td>
                      <span className={`status-badge ${log.login_status === "Success" ? "active" : "inactive"}`}>
                        {log.login_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <p className="admin-table-count">
            Showing {visibleLogs.length} of {logs.length} log entries
          </p>
        )}
      </div>
    </div>
  );
}
