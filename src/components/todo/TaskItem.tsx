import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Task } from "../../types";
import { cn } from "../../lib/utils";
import { format, parseISO, isPast, isToday } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItemSortable: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300",
        task.completed && "opacity-60 grayscale-[0.5]",
        isOverdue && "border-red-500/50 bg-red-50/30 dark:bg-red-950/10",
        isDragging && "shadow-2xl ring-2 ring-indigo-500 scale-[1.02] bg-white dark:bg-slate-800"
      )}
    >
      <button 
        {...attributes} 
        {...listeners} 
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-lg transition-all duration-300 flex items-center justify-center",
          task.completed 
            ? "bg-indigo-600 border-indigo-600 text-white" 
            : "border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500"
        )}
      >
        {task.completed && <CheckCircle2 className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0 pointer-events-auto" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-base font-semibold truncate transition-all duration-300",
            task.completed && "line-through text-slate-500"
          )}>
            {task.title}
          </h3>
          <span className={cn(
            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          {isOverdue && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 px-2 py-0.5 bg-red-100 dark:bg-red-950/30 rounded-full">
              <AlertTriangle className="w-3 h-3" /> Overdue
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {task.dueDate && (
            <div className={cn("flex items-center gap-1", isOverdue && "text-red-500 font-medium")}>
              <Calendar className="w-3 h-3" />
              <span>{format(parseISO(task.dueDate), "MMM d")}</span>
            </div>
          )}
          {(task.subTasks && task.subTasks.length > 0) && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>{task.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-slate-300 dark:text-slate-700">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
