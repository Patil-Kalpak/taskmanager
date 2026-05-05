import React, { useState } from "react";
import { useTask } from "../context/TaskContext";

export default function TaskModal({ isOpen, onClose }) {
  const { addTask } = useTask();
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTask(form);
      setForm({ title: "", description: "", priority: "medium", dueDate: "" });
      onClose();
    } catch (error) {
      console.error("Error adding task", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create new task</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea 
              placeholder="Add some details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select 
                value={form.priority} 
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Due Date</label>
              <input 
                type="date" 
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !form.title.trim()}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}