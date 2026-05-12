import React, { useState } from "react";
import { 
  Filter, 
  ArrowUpDown, 
  Grid2X2, 
  List as ListIcon,
  Search,
  Plus,
  CheckSquare
} from "lucide-react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "../ui/Base";
import { Task } from "../../types";
import { TaskItemSortable } from "./TaskItem";

interface TaskListViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAddTask: () => void;
  search: string;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ 
  tasks, 
  setTasks, 
  onToggle, 
  onDelete, 
  onEdit,
  onAddTask,
  search
}) => {
  const safeTasks = tasks || [];
  const [filter, setFilter] = useState<string>("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = safeTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "todo" && !task.completed) || 
                         (filter === "done" && task.completed);
    return matchesSearch && matchesFilter;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks(arrayMove(safeTasks, 
        safeTasks.findIndex(t => t.id === active.id), 
        safeTasks.findIndex(t => t.id === over.id)
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and organize your productivity workflow</p>
        </div>
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="w-5 h-5" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant={filter === "all" ? "primary" : "ghost"} 
            size="sm" 
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "todo" ? "primary" : "ghost"} 
            size="sm" 
            onClick={() => setFilter("todo")}
          >
            To Do
          </Button>
          <Button 
            variant={filter === "done" ? "primary" : "ghost"} 
            size="sm" 
            onClick={() => setFilter("done")}
          >
            Completed
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="secondary" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItemSortable 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggle} 
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-10 h-10 text-indigo-200 dark:text-indigo-800" />
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">No tasks found</h3>
                <p className="text-slate-500">Break your big goals into small, actionable tasks</p>
                <Button onClick={onAddTask} variant="secondary" className="mt-6">Create your first task</Button>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
