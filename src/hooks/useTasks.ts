import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";
import { Task, UserStats } from "../types";
import { isToday, parseISO, differenceInDays } from "date-fns";

const STORAGE_KEY_TASKS = "zentask_pro_tasks";
const STORAGE_KEY_STATS = "zentask_pro_stats";

export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({ 
    completedToday: 0, 
    totalCompleted: 0, 
    streak: 0, 
    productivityScore: 0, 
    focusMinutes: 0,
    aiSuggestionsUsed: 0
  });

  // Firestore Sync
  useEffect(() => {
    if (!user) {
      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedStats) setStats(JSON.parse(savedStats));
      return;
    }

    // Sync Tasks
    const tasksQuery = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        taskList.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        } as Task);
      });
      setTasks(taskList);
    });

    // Sync Stats
    const statsDocRef = doc(db, "users", user.uid, "stats", "main");
    const unsubscribeStats = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        setStats(doc.data() as UserStats);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeStats();
    };
  }, [user]);

  const saveStats = async (newStats: UserStats) => {
    setStats(newStats);
    if (user) {
      const statsDocRef = doc(db, "users", user.uid, "stats", "main");
      await setDoc(statsDocRef, newStats);
    } else {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(newStats));
    }
  };

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "completed">, isAI = false) => {
    const id = crypto.randomUUID();
    const newTask: any = {
      title: task.title,
      description: task.description || "",
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate || null,
      subTasks: (task as any).subTasks || [],
      tags: (task as any).tags || [],
      id,
      createdAt: user ? serverTimestamp() : new Date().toISOString(),
      completed: false,
    };

    if (user) {
      const taskDocRef = doc(db, "users", user.uid, "tasks", id);
      await setDoc(taskDocRef, newTask);
    } else {
      const t = { ...newTask, createdAt: new Date().toISOString() };
      setTasks((prev) => [t, ...prev]);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify([t, ...tasks]));
    }

    if (isAI) {
      saveStats({ ...stats, aiSuggestionsUsed: stats.aiSuggestionsUsed + 1 });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (user) {
      const taskDocRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskDocRef, updates);
    } else {
      const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      setTasks(updated);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
    }
  };

  const deleteTask = async (id: string) => {
    if (user) {
      const taskDocRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskDocRef);
    } else {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    await updateTask(id, { completed: newCompleted });

    if (newCompleted) {
      handleTaskCompletion();
    } else {
      handleTaskIncompletion();
    }
  };

  const handleTaskCompletion = () => {
    const newTotal = stats.totalCompleted + 1;
    const today = new Date().toISOString();
    const lastDate = stats.lastCompletedDate ? parseISO(stats.lastCompletedDate) : null;
    
    let newStreak = stats.streak;
    if (!lastDate || differenceInDays(new Date(), lastDate) === 1) {
      newStreak += 1;
    } else if (differenceInDays(new Date(), lastDate) > 1) {
      newStreak = 1;
    }

    saveStats({
      ...stats,
      totalCompleted: newTotal,
      completedToday: stats.completedToday + 1,
      streak: newStreak,
      lastCompletedDate: today,
    });
  };

  const handleTaskIncompletion = () => {
    saveStats({
      ...stats,
      totalCompleted: Math.max(0, stats.totalCompleted - 1),
      completedToday: Math.max(0, stats.completedToday - 1),
    });
  };

  // Reset completedToday if it's a new day
  useEffect(() => {
    if (stats.lastCompletedDate && !isToday(parseISO(stats.lastCompletedDate))) {
      saveStats({ ...stats, completedToday: 0 });
    }
  }, [stats.lastCompletedDate]);

  return {
    tasks,
    setTasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
