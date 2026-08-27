import { useState } from "react";
import { apiFetch } from "../../utils/api";

const EMPTY_FORM = {
  category: "",
  question: "",
  answer: "",
  is_published: false,
};

export default function AddFaqPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiFetch("/api/faqs", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(
        form.is_published
          ? "FAQ created and published."
          : "FAQ created as a draft (not yet visible to staff)."
      );
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message || "Failed to create FAQ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Add FAQ</h2>
        <p className="admin-page-subtitle">
          Create a new question and answer for the staff knowledge base.
        </p>
      </div>

      <div className="admin-card">
        {error && <div className="login-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Leave, Dress Code, Payroll"
              value={form.category}
              onChange={setField("category")}
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Question</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="e.g. How many days of annual leave do I get?"
              value={form.question}
              onChange={setField("question")}
              maxLength={1000}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer</label>
            <textarea
              className="form-input"
              rows={6}
              placeholder="Write the full answer staff will see..."
              value={form.answer}
              onChange={setField("answer")}
              maxLength={5000}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_published: e.target.checked }))
                }
              />
              <span>Publish immediately (visible to staff)</span>
            </label>
          </div>

          <button type="submit" className="btn-submit btn-inline" disabled={submitting}>
            {submitting ? "Creating..." : "Create FAQ"}
          </button>
        </form>
      </div>
    </div>
  );
}
