import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Calendar, Tag, AlertCircle } from "lucide-react";
import { Button } from "../ui/Base";
import { Task, Priority, SubTask } from "../../types";

interface TaskModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTask, setNewSubTask] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate || "");
      setSubTasks(task.subTasks);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("General");
      setDueDate("");
      setSubTasks([]);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, { id: crypto.randomUUID(), text: newSubTask, completed: false }]);
      setNewSubTask("");
    }
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const removeSubTask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      category,
      dueDate,
      subTasks,
      tags: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Title</label>
            <input
              autoFocus
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full text-lg font-medium px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Checklist</label>
            <div className="space-y-2">
              {subTasks.map((st) => (
                <div key={st.id} className="flex items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubTask(st.id)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`flex-1 text-sm ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {st.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSubTask(st.id)}
                    className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubTask())}
                placeholder="Add checklist item..."
                className="flex-1 text-sm px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSubTask}>
                Add
              </Button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
