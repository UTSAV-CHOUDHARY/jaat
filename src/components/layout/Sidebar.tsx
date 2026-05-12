import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Timer, 
  Settings, 
  Plus, 
  LogOut,
  Flame,
  Trophy,
  Sparkles
} from "lucide-react";
import { Button } from "../ui/Base";
import { UserStats } from "../../types";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  stats: UserStats;
  onAddTask: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  stats, 
  onAddTask,
  isOpen,
  onClose
}) => {
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "tasks", icon: CheckSquare, label: "My Tasks" },
    { id: "calendar", icon: CalendarIcon, label: "Schedule" },
    { id: "focus", icon: Timer, label: "Focus Zone" },
    { id: "ai", icon: Sparkles, label: "AI Planner" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 z-[70] transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          ZenTask Pro
        </span>
      </div>

      <Button onClick={onAddTask} className="w-full mb-6 gap-2 py-6 text-base shadow-lg shadow-indigo-500/20">
        <Plus className="w-5 h-5" /> New Task
      </Button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
              activeView === item.id
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Streak</span>
          </div>
          <span className="text-sm font-bold">{stats.streak}d</span>
        </div>
        
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">XP</span>
          </div>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalCompleted * 10}
          </span>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};
