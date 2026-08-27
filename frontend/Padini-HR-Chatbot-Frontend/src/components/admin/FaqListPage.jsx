import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function FaqListPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const refresh = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/faqs")
      .then((data) => {
        if (!cancelled) setFaqs(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load FAQs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const togglePublished = async (faq) => {
    setError("");
    setTogglingId(faq.faq_id);
    try {
      const updated = await apiFetch(`/api/faqs/${faq.faq_id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_published: !faq.is_published }),
      });
      setFaqs((prev) => prev.map((f) => (f.faq_id === updated.faq_id ? updated : f)));
    } catch (err) {
      setError(err.message || "Failed to update FAQ.");
    } finally {
      setTogglingId(null);
    }
  };

  const categories = [...new Set(faqs.map((f) => f.category))].sort();

  const query = search.trim().toLowerCase();
  const visibleFaqs = faqs.filter((faq) => {
    if (statusFilter === "published" && !faq.is_published) return false;
    if (statusFilter === "draft" && faq.is_published) return false;
    if (categoryFilter !== "all" && faq.category !== categoryFilter) return false;
    if (!query) return true;
    return (
      faq.question?.toLowerCase().includes(query) ||
      faq.answer?.toLowerCase().includes(query) ||
      faq.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">View All FAQ's</h2>
        <p className="admin-page-subtitle">
          Manage the knowledge base entries the chatbot and staff portal use.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            className="form-input admin-search"
            placeholder="Search questions, answers, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input admin-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="form-input admin-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
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
          <p className="admin-empty-state">Loading FAQs...</p>
        ) : visibleFaqs.length === 0 ? (
          <p className="admin-empty-state">No FAQs match the current filters.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Question</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleFaqs.map((faq) => {
                  const isExpanded = expandedId === faq.faq_id;
                  return (
                    <tr key={faq.faq_id}>
                      <td>{faq.category}</td>
                      <td className="cell-wrap">
                        {faq.question}
                        {isExpanded && <p className="faq-answer-preview">{faq.answer}</p>}
                      </td>
                      <td>
                        <span className={`status-badge ${faq.is_published ? "active" : "inactive"}`}>
                          {faq.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>{faq.created_at ? new Date(faq.created_at + "Z").toLocaleDateString() : "—"}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn-row-action"
                            onClick={() => setExpandedId(isExpanded ? null : faq.faq_id)}
                          >
                            {isExpanded ? "Hide Answer" : "Show Answer"}
                          </button>
                          <button
                            className={`btn-row-action ${faq.is_published ? "danger" : "success"}`}
                            disabled={togglingId === faq.faq_id}
                            onClick={() => togglePublished(faq)}
                          >
                            {togglingId === faq.faq_id
                              ? "..."
                              : faq.is_published
                                ? "Unpublish"
                                : "Publish"}
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
            Showing {visibleFaqs.length} of {faqs.length} FAQs
          </p>
        )}
      </div>
    </div>
  );
}
