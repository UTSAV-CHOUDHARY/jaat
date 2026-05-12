import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "border-green-100 bg-green-50 dark:bg-green-950/20",
    error: "border-red-100 bg-red-50 dark:bg-red-950/20",
    warning: "border-yellow-100 bg-yellow-50 dark:bg-yellow-950/20",
    info: "border-blue-100 bg-blue-50 dark:bg-blue-950/20",
  };

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 duration-300 backdrop-blur-md",
      bgColors[type]
    )}>
      {icons[type]}
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg ml-2">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};
