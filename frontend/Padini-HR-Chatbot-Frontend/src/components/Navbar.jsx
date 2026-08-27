import { displayName, initials } from "../utils/user";

export default function Navbar({ currentUser, setActiveView, setShowLogoutConfirm }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActiveView("dashboard")}>
        <img
          src="src/assets/Padini_Short.png"
          alt="Padini"
          className="nav-logo"
          width="300"
          height="300"
        />
        <div className="nav-separator"></div>
        <span className="nav-title">Knowledge Hub</span>
      </div>

      <div className="nav-profile">
        {currentUser?.role === "Admin" && (
          <button
            className="btn-admin-nav"
            onClick={() => setActiveView("admin")}
            title="Open Admin Panel"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Admin Panel
          </button>
        )}
        <div
          className="profile-trigger"
          onClick={() => setActiveView("profile")}
          title="View Staff Profile"
        >
          <div className="profile-info">
            <p className="profile-name">{displayName(currentUser)}</p>
            <p className="profile-role">
              ID: {currentUser?.staff_id ?? "—"} | {currentUser?.store_location ?? "Unassigned"}
            </p>
          </div>
          <div className="profile-avatar-mini">{initials(currentUser)}</div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="btn-logout"
          title="Sign Out"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
}
