export default function AdminSidebar({
  menu,
  collapsed,
  setCollapsed,
  openGroups,
  toggleGroup,
  activePage,
  setActivePage,
}) {
  const handleGroupClick = (group) => {
    // Clicking a group icon while collapsed re-expands the sidebar
    if (collapsed) {
      setCollapsed(false);
      if (!openGroups[group.id]) toggleGroup(group.id);
    } else {
      toggleGroup(group.id);
    }
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-sidebar-header">
        {!collapsed && <span className="admin-sidebar-title">Admin Panel</span>}
        <button
          className="admin-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>
      </div>

      <nav className="admin-menu">
        {menu.map((group) => {
          const isOpen = !!openGroups[group.id];
          const hasActiveChild = group.children.some((c) => c.id === activePage);
          return (
            <div key={group.id} className="admin-menu-group">
              <button
                className={`admin-menu-group-btn ${hasActiveChild ? "has-active" : ""}`}
                onClick={() => handleGroupClick(group)}
                title={collapsed ? group.label : undefined}
              >
                <span className="admin-menu-icon">{group.icon}</span>
                {!collapsed && (
                  <>
                    <span className="admin-menu-label">{group.label}</span>
                    <svg
                      className={`admin-menu-chevron ${isOpen ? "open" : ""}`}
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="admin-submenu">
                  {group.children.map((child) => (
                    <button
                      key={child.id}
                      className={`admin-submenu-btn ${activePage === child.id ? "active" : ""}`}
                      onClick={() => setActivePage(child.id)}
                      title={child.pending ? "Backend endpoints not implemented yet" : undefined}
                    >
                      {child.label}
                      {child.pending && (
                        <span className="admin-submenu-badge">API pending</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
