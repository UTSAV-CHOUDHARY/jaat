export type Priority = "low" | "medium" | "high";

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  subTasks: SubTask[];
  createdAt: string;
  tags: string[];
}

export interface UserStats {
  completedToday: number;
  totalCompleted: number;
  streak: number;
  lastCompletedDate?: string;
  productivityScore: number;
  focusMinutes: number;
  aiSuggestionsUsed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number; // number of tasks or streak days
  type: "tasks" | "streak" | "productivity";
}

export interface AppState {
  tasks: Task[];
  stats: UserStats;
  theme: "light" | "dark";
  searchQuery: string;
}
