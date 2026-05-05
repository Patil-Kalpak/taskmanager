import React, { useState } from "react";
import { format } from "date-fns";
import { useTask } from "../context/TaskContext";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";

export default function Dashboard() {
  const { tasks, loading, stats, toggleTask, deleteTask } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Here is what's happening with your projects today.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + New Task
            </button>
          </div>
        </header>

        <div className="page-body">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card complete">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card urgent">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{stats.highPriority}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-header">
              <div className="progress-title">Overall Progress</div>
              <div className="progress-pct">{completionPercentage}%</div>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <div className="progress-stats">
              <div className="progress-stat">
                <div className="progress-dot" style={{ background: "var(--success)" }}></div>
                {stats.completed} Completed
              </div>
              <div className="progress-stat">
                <div className="progress-dot" style={{ background: "var(--warning)" }}></div>
                {stats.pending} Remaining
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="tasks-section-header">
            <h2 className="tasks-section-title">Recent Tasks</h2>
            <div className="filter-row">
              <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
              <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>Pending</button>
              <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3 className="empty-title">You're all caught up!</h3>
              <p className="empty-sub">No tasks found. Enjoy your day or create a new task.</p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                  <button 
                    className={`task-checkbox ${task.completed ? "checked" : ""}`} 
                    onClick={() => toggleTask(task.id, task.completed)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <div className="task-body">
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                    <div className="task-meta">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="task-date">
                          📅 {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="icon-btn" onClick={() => deleteTask(task.id)} title="Delete task">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}