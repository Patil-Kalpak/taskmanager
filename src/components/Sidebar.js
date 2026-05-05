import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { stats } = useTask();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">✦</div>
        <span className="sidebar-logo-text">TaskFlow</span>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-nav-label">Menu</div>
        <button className="nav-item active">
          <span className="nav-item-icon">📊</span>
          Dashboard
        </button>
        <button className="nav-item">
          <span className="nav-item-icon">✅</span>
          Tasks
          {stats.pending > 0 && <span className="nav-badge">{stats.pending}</span>}
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-card">
          <div className="user-avatar">
            {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{currentUser?.displayName || "User"}</div>
            <div className="user-email" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.email}
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span style={{ fontSize: "16px" }}>🚪</span> Log out
        </button>
      </div>
    </aside>
  );
}