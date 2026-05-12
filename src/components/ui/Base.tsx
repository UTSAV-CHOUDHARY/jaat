import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
      danger: "bg-red-500 text-white hover:bg-red-600",
      glass: "glass hover:bg-white/20 transition-all duration-300",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-medium",
      md: "px-4 py-2 text-sm font-medium",
      lg: "px-6 py-3 text-base font-medium",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("glass rounded-2xl p-6 transition-all duration-300 hover:shadow-xl", className)}>
    {children}
  </div>
);
