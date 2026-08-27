
export default function AuthOverlay({
  employeeId,
  setEmployeeId,
  handleLogin,
  loginError,
  switchToAdmin,
}) {
  return (
    <section className="auth-overlay">
      <div className="login-card">
        <div className="login-logo-container">
          <img
            src="src/assets/Padini_Short.png"
            alt="Padini Logo"
            className="login-logo"
            width="300"
            height="300"
          />
        </div>
        <h1 className="login-title">Staff Portal</h1>
        <p className="login-subtitle">Management &amp; Inventory Access</p>

        {loginError && <p className="login-error">{loginError}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-input"
              required
              autoComplete="username"
              placeholder="P-XXXX"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <p className="login-switch">
          Administrator?{" "}
          <button type="button" className="login-switch-link" onClick={switchToAdmin}>
            Sign in here
          </button>
        </p>
      </div>
    </section>
  );
}
