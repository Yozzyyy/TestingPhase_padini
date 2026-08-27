import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import CreateUserPage from "./CreateUserPage";
import UsersListPage from "./UsersListPage";
import AddFaqPage from "./AddFaqPage";
import FaqListPage from "./FaqListPage";
import AuditLogsPage from "./AuditLogsPage";
import AnalyticsPage from "./AnalyticsPage";

// To add a new admin feature: add a group here (with sub-pages) and map
// each page id to a component in PAGES below.
const MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    children: [
      { id: "dashboard-analytics", label: "Analytics" },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    children: [
      { id: "users-create", label: "Create User" },
      { id: "users-view", label: "View All Users" },
    ],
  },
  {
    id: "faq",
    label: "FAQ/Information",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    children: [
      // pending: backend endpoints (/api/faqs) not implemented yet
      { id: "faq-add", label: "Add FAQ's", pending: true },
      { id: "faq-view", label: "View all FAQ's", pending: true },
    ],
  },
    {
    id: "audit",
    label: "System/Audit Logs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    children: [
      { id: "audit-view", label: "View All Logs" },
    ],
  },
];

const PAGES = {
  "dashboard-analytics": AnalyticsPage,
  "users-create": CreateUserPage,
  "users-view": UsersListPage,
  "faq-add": AddFaqPage,
  "faq-view": FaqListPage,
  "audit-view": AuditLogsPage,
};

export default function AdminDashboard({ currentUser }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({ dashboard: true });
  const [activePage, setActivePage] = useState("dashboard-analytics");

  const toggleGroup = (id) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const ActivePage = PAGES[activePage] ?? AnalyticsPage;

  return (
    <div className="admin-layout">
      <AdminSidebar
        menu={MENU}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="admin-content">
        <ActivePage currentUser={currentUser} />
      </div>
    </div>
  );
}
