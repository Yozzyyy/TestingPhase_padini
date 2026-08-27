
export default function AdminAuthOverlay({
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  handleLogin,
  loginError,
  switchToStaff,
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
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-subtitle">Administrator Access Only</p>

        {loginError && <p className="login-error">{loginError}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              required
              autoComplete="email"
              placeholder="admin@padini.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              autoComplete="current-password"
              placeholder="Enter Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <p className="login-switch">
          Staff member?{" "}
          <button type="button" className="login-switch-link" onClick={switchToStaff}>
            Sign in here
          </button>
        </p>
      </div>
    </section>
  );
}
