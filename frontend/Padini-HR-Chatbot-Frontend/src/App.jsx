import { useState, useEffect } from 'react';
import AuthOverlay from "./components/AuthOverlay";
import AdminAuthOverlay from "./components/AdminAuthOverlay";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProfileView from "./components/ProfileView";
import ChatBot from "./components/ChatBot";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginMode, setLoginMode] = useState('staff');
  const [employeeId, setEmployeeId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi Alex. Ready for SKU lookup or standard operating procedures checks.', timestamp: 'Just now' }
  ]);

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchCurrentUser = async (token) => {
    const res = await fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("access_token");
      setCurrentUser(null);
      setIsLoggedIn(false);
      throw new Error("Session expired. Please log in again.");
    }

    const user = await res.json();
    setCurrentUser(user);
    setIsLoggedIn(true);
    return user;
  };

  // Restore the session on page load if a token is still stored
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Session expired"))))
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => localStorage.removeItem("access_token"));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const isAdmin = loginMode === "admin";
    const endpoint = isAdmin
      ? "http://localhost:8000/api/auth/login/admin"
      : "http://localhost:8000/api/auth/login/staff";

    const body = isAdmin
      ? { email: adminEmail, password: adminPassword }
      : { staff_id: employeeId };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      await fetchCurrentUser(data.access_token);
    } catch (err) {
      console.error(err);
      setLoginError(err.message || "Login failed. Please try again.");
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("access_token");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setEmployeeId('');
    setAdminEmail('');
    setAdminPassword('');
    setLoginMode('staff');
    setActiveView('dashboard');
    setShowLogoutConfirm(false);
  };

  return (
    <div className="app-viewport">
      {!isLoggedIn && (
        loginMode === 'admin' ? (
          <AdminAuthOverlay
            adminEmail={adminEmail} setAdminEmail={setAdminEmail}
            adminPassword={adminPassword} setAdminPassword={setAdminPassword}
            handleLogin={handleLogin}
            loginError={loginError}
            switchToStaff={() => { setLoginError(''); setLoginMode('staff'); }}
          />
        ) : (
          <AuthOverlay
            employeeId={employeeId} setEmployeeId={setEmployeeId}
            handleLogin={handleLogin}
            loginError={loginError}
            switchToAdmin={() => { setLoginError(''); setLoginMode('admin'); }}
          />
        )
      )}

      {isLoggedIn && (
        <div className="workspace-layout">
          <Navbar currentUser={currentUser} setActiveView={setActiveView} setShowLogoutConfirm={setShowLogoutConfirm} />

          {activeView === 'admin' && currentUser?.role === 'Admin' ? (
            <AdminDashboard currentUser={currentUser} />
          ) : (
            <main className="main-container">
              {activeView === 'profile' ? (
                <ProfileView currentUser={currentUser} setActiveView={setActiveView} />
              ) : (
                <Dashboard
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  openFaqs={openFaqs} toggleFaq={toggleFaq}
                />
              )}
            </main>
          )}

          <ChatBot 
            isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
            chatInput={chatInput} setChatInput={setChatInput}
            messages={messages} setMessages={setMessages}
          />
        </div>
      )}

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Sign Out</h3>
            <p className="modal-text">Are you sure you want to exit the Padini Staff Portal workspace?</p>
            <div className="modal-actions">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-modal-cancel">Cancel</button>
              <button onClick={handleConfirmLogout} className="btn-modal-confirm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}