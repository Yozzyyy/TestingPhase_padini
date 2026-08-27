import { displayName, initials } from '../utils/user';

export default function ProfileView({ currentUser, setActiveView }) {
  return (
    <div className="profile-layout">
      <div className="profile-nav-header">
        <button onClick={() => setActiveView('dashboard')} className="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Knowledge Hub
        </button>
      </div>

      <div className="profile-grid">
        <div className="profile-sidebar-card">
          <div className="profile-avatar-large">{initials(currentUser)}</div>
          <h2 className="profile-sidebar-name">{displayName(currentUser)}</h2>
          <p className="profile-sidebar-role">{currentUser?.job_title ?? currentUser?.role ?? ''}</p>
          <span className={`status-badge ${currentUser?.is_active ? 'active' : 'inactive'}`}>
            {currentUser?.is_active ? 'Active' : 'Deactivated'}
          </span>
        </div>

        <div className="profile-main-content">
          <div className="profile-detail-card">
            <h3 className="profile-card-title">Employee Details</h3>
            <div className="info-list">
              <div className="info-item"><span className="info-label">Employee ID</span><span className="info-value">{currentUser?.staff_id ?? '—'}</span></div>
              <div className="info-item"><span className="info-label">Assigned Location</span><span className="info-value">{currentUser?.store_location ?? 'Unassigned'}</span></div>
              <div className="info-item"><span className="info-label">Job Title</span><span className="info-value">{currentUser?.job_title ?? '—'}</span></div>
              <div className="info-item"><span className="info-label">Role</span><span className="info-value">{currentUser?.role ?? '—'}</span></div>
              <div className="info-item"><span className="info-label">Email Address</span><span className="info-value">{currentUser?.email ?? '—'}</span></div>
            </div>
          </div>

          <div className="profile-detail-card">
            <h3 className="profile-card-title">Current Weekly Schedule</h3>
            <div className="info-list">
              <div className="info-item"><span className="info-label">Monday</span><span className="info-value">10:00 AM - 07:00 PM</span></div>
              <div className="info-item"><span className="info-label">Tuesday</span><span className="info-value">10:00 AM - 07:00 PM</span></div>
              <div className="info-item"><span className="info-label">Wednesday</span><span className="info-value">OFF</span></div>
              <div className="info-item"><span className="info-label">Thursday</span><span className="info-value">01:00 PM - 10:00 PM</span></div>
              <div className="info-item"><span className="info-label">Friday</span><span className="info-value">10:00 AM - 07:00 PM</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}