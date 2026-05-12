import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Settings2 } from "lucide-react";
import { Button, Card } from "../ui/Base";
import { cn } from "../../lib/utils";

export const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    const nextMode = mode === "work" ? "break" : "work";
    setMode(nextMode);
    setTimeLeft(nextMode === "work" ? 25 * 60 : 5 * 60);
    setIsActive(false);
    if (mode === "work") setSessions(s => s + 1);
    
    // Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(nextMode === "work" ? "Back to work!" : "Take a break!");
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = mode === "work" 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-bold">Focus Zone</h1>
        <p className="text-slate-500">Master your time with deep work sessions</p>
      </div>

      <div className="relative w-80 h-80">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="150"
            cx="160"
            cy="160"
          />
          <circle
            className={cn(
              "transition-all duration-1000 ease-linear",
              mode === "work" ? "text-indigo-600" : "text-green-500"
            )}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="150"
            cx="160"
            cy="160"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
            {mode === "work" ? (
              <Brain className="w-4 h-4 text-indigo-600" />
            ) : (
              <Coffee className="w-4 h-4 text-green-500" />
            )}
            <span className={cn(
              "text-xs font-bold uppercase tracking-widest",
              mode === "work" ? "text-indigo-600" : "text-green-500"
            )}>
              {mode} session
            </span>
          </div>
          <span className="text-7xl font-display font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <div className="mt-4 flex items-center gap-2 text-slate-500">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{sessions} sessions today</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={resetTimer}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <button
          onClick={toggleTimer}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-90",
            isActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
          )}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="w-12 h-12 rounded-full"
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button 
          onClick={() => { setMode("work"); setTimeLeft(25 * 60); setIsActive(false); }}
          className={cn(
            "p-4 rounded-2xl border-2 transition-all",
            mode === "work" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20" : "border-transparent bg-slate-50 dark:bg-slate-800"
          )}
        >
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Work</p>
          <p className="font-bold">25:00</p>
        </button>
        <button 
          onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
          className={cn(
            "p-4 rounded-2xl border-2 transition-all",
            mode === "break" ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-transparent bg-slate-50 dark:bg-slate-800"
          )}
        >
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Break</p>
          <p className="font-bold">05:00</p>
        </button>
      </div>
    </div>
  );
};
