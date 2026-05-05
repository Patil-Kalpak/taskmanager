import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within TaskProvider");
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    // 1. We removed the 'orderBy' from the Firebase query to avoid the index error
    const q = query(
      collection(db, "tasks"),
      where("uid", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 2. We sort the tasks here in the browser instead!
      taskList.sort((a, b) => {
        // If createdAt is missing (like right after adding a task), fallback to Date.now()
        const timeA = a.createdAt?.toMillis() || Date.now();
        const timeB = b.createdAt?.toMillis() || Date.now();
        return timeB - timeA; // Sorts newest to oldest
      });

      setTasks(taskList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addTask = async ({ title, description, priority, dueDate }) => {
    if (!currentUser) throw new Error("Not authenticated");
    await addDoc(collection(db, "tasks"), {
      uid: currentUser.uid,
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const toggleTask = async (taskId, completed) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: !completed,
      completedAt: !completed ? serverTimestamp() : null,
    });
  };

  const updateTask = async (taskId, updates) => {
    await updateDoc(doc(db, "tasks", taskId), updates);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.completed).length,
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, deleteTask, toggleTask, updateTask, stats }}
    >
      {children}
    </TaskContext.Provider>
  );
};