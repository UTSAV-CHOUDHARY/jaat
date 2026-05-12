/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./services/firebase";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardView } from "./components/dashboard/DashboardView";
import { TaskListView } from "./components/todo/TaskListView";
import { TaskModal } from "./components/todo/TaskModal";
import { CalendarView } from "./components/todo/CalendarView";
import { PomodoroTimer } from "./components/pomodoro/PomodoroTimer";
import { AIPlannerView } from "./components/todo/AIPlannerView";
import { SettingsView } from "./components/layout/SettingsView";
import { LoginView } from "./components/auth/LoginView";
import { Toast, ToastType } from "./components/ui/Toast";
import { useTasks } from "./hooks/useTasks";
import { jsPDF } from "jspdf";
import { Task } from "./types";
import { aiService } from "./services/aiService";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { tasks, setTasks, stats, addTask, updateTask, deleteTask, toggleTask } = useTasks(user);
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return localStorage.getItem("zentask_theme") as "light" | "dark" || "light";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("zentask_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      showToast("Task updated successfully");
    } else {
      addTask(taskData);
      showToast("New task added to list");
    }
    setEditingTask(null);
  };

  const handleNotifyRequest = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showToast("Notifications enabled!");
        } else {
          showToast("Notification permission denied", "error");
        }
      });
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await auth.signOut();
      showToast("Logged out successfully");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ tasks, stats }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "zentask_pro_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("Data exported as JSON");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("ZenTask Pro - Report", 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`User Index: ${user?.email || 'Guest'} | Streak: ${stats.streak} days`, 20, 35);
    
    let y = 50;
    tasks.forEach((task, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(`${index + 1}. ${task.title}`, 20, y);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${task.priority.toUpperCase()} | ${task.category} | ${task.completed ? 'COMPLETED' : 'PENDING'}`, 25, y + 5);
      y += 15;
    });

    doc.save("ZenTask_Report.pdf");
    showToast("Report generated & downloaded");
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView tasks={tasks} stats={stats} />;
      case "tasks":
        return (
          <TaskListView 
            tasks={tasks} 
            setTasks={setTasks}
            onToggle={toggleTask} 
            onDelete={deleteTask}
            onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
            onAddTask={() => { setEditingTask(null); setIsModalOpen(true); }}
            search={searchQuery}
          />
        );
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "focus":
        return <PomodoroTimer />;
      case "ai":
        return <AIPlannerView tasks={tasks} onAddTask={(t) => { addTask(t, true); showToast("Added AI suggestion"); }} stats={stats} />;
      case "settings":
        return <SettingsView onNotify={handleNotifyRequest} onLogout={handleLogout} />;
      default:
        return <DashboardView tasks={tasks} stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        stats={stats}
        onAddTask={() => { setEditingTask(null); setIsModalOpen(true); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          theme={theme} 
          setTheme={setTheme} 
          onShowAI={() => setActiveView("ai")} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onShowSettings={() => setActiveView("settings")}
          onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>

        <footer className="px-4 md:px-8 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex gap-4">
            <button onClick={handleExportJSON} className="hover:text-indigo-600 transition-colors">Export JSON</button>
            <button onClick={handleExportPDF} className="hover:text-indigo-600 transition-colors">Export PDF</button>
            <button onClick={() => setActiveView("settings")} className="hover:text-indigo-600 transition-colors">Preferences</button>
          </div>
          <div>© 2026 ZenTask Pro — Elevate your focus.</div>
        </footer>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
        task={editingTask}
        onSave={handleSaveTask}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

