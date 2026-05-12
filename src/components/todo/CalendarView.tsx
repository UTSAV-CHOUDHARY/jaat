import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay, parseISO } from "date-fns";
import { Task } from "../../types";
import { Card } from "../ui/Base";
import "./CalendarStyles.css";

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const safeTasks = tasks || [];
  const getTasksForDate = (date: Date) => {
    return safeTasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(parseISO(task.dueDate), date);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold">Schedule</h1>
        <p className="text-slate-500">Plan your weeks and months ahead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-4">
          <Calendar 
            className="w-full border-none shadow-none font-sans"
            tileContent={({ date }) => {
              const dayTasks = getTasksForDate(date);
              if (dayTasks.length === 0) return null;
              return (
                <div className="flex justify-center mt-1 gap-1">
                  {dayTasks.slice(0, 3).map((t, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                    />
                  ))}
                  {dayTasks.length > 3 && <span className="text-[8px] text-slate-400 font-bold">+{dayTasks.length - 3}</span>}
                </div>
              );
            }}
          />
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-lg mb-4">Agenda</h3>
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              <span className="text-xs font-bold text-indigo-600 block mb-1">TODAY — {format(new Date(), "MMMM d")}</span>
              <div className="space-y-2">
                {getTasksForDate(new Date()).length > 0 ? (
                  getTasksForDate(new Date()).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-slate-300' : 'bg-indigo-500'}`} />
                      <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>{task.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No tasks scheduled for today</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming</span>
               {safeTasks
                 .filter(t => t.dueDate && !isSameDay(parseISO(t.dueDate), new Date()) && parseISO(t.dueDate) > new Date())
                 .sort((a, b) => parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime())
                 .slice(0, 5)
                 .map(task => (
                   <div key={task.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                     <span className="font-medium truncate mr-2">{task.title}</span>
                     <span className="text-xs text-slate-400 shrink-0">{format(parseISO(task.dueDate!), "MMM d")}</span>
                   </div>
                 ))
               }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
