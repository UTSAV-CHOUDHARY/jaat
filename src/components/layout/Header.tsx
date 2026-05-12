import React from "react";
import { Search, Bell, Sun, Moon, Sparkles, Menu } from "lucide-react";
import { Button } from "../ui/Base";
import { auth } from "../../services/firebase";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onShowAI: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onShowSettings: () => void;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  setTheme, 
  onShowAI, 
  searchQuery, 
  setSearchQuery,
  onShowSettings,
  onToggleMenu
}) => {
  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleMenu}
          className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>
      </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="glass" size="sm" onClick={onShowAI} className="gap-2 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" /> Ask AI
        </Button>
        
        <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          onClick={onShowSettings}
          className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:scale-110 transition-transform overflow-hidden"
        >
          {auth.currentUser?.photoURL ? (
            <img src={auth.currentUser.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            auth.currentUser?.displayName?.charAt(0) || "U"
          )}
        </button>
      </div>
    </header>
  );
};
