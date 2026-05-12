import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  Target,
  ArrowUpRight,
  MoreVertical,
  Sun,
  Brain,
  Sparkles
} from "lucide-react";
import { Card, Button } from "../ui/Base";
import { cn } from "../../lib/utils";
import { Task, UserStats } from "../../types";

const data = [
  { day: "Mon", tasks: 4 },
  { day: "Tue", tasks: 3 },
  { day: "Wed", tasks: 6 },
  { day: "Thu", tasks: 8 },
  { day: "Fri", tasks: 5 },
  { day: "Sat", tasks: 2 },
  { day: "Sun", tasks: 4 },
];

interface DashboardViewProps {
  tasks: Task[];
  stats: UserStats;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ tasks, stats }) => {
  const completedCount = (tasks || []).filter(t => t.completed).length;
  const pendingCount = (tasks || []).filter(t => !t.completed).length;
  const completionRate = (tasks && tasks.length > 0) ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, Utsav
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          You've completed <span className="text-indigo-600 font-semibold">{stats.completedToday}</span> tasks today. Keep the momentum!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Completion Rate" 
          value={`${completionRate}%`} 
          trend="+12%" 
          icon={Target} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Total Completed" 
          value={stats.totalCompleted.toString()} 
          trend="+5 today" 
          icon={CheckCircle2} 
          color="bg-green-500" 
        />
        <StatCard 
          label="Deep Work Hours" 
          value="12.4h" 
          trend="+2.1h" 
          icon={Clock} 
          color="bg-purple-500" 
        />
        <StatCard 
          label="Current Streak" 
          value={`${stats.streak} Days`} 
          trend="Level 4" 
          icon={Zap} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-semibold text-lg">Productivity Analytics</h3>
              <p className="text-sm text-slate-500">Task completion trends for the week</p>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full">
            <h3 className="font-display font-semibold text-lg mb-4">Achievements</h3>
            <div className="space-y-4">
              <BadgeItem 
                title="Early Bird" 
                desc="Completed 5 tasks before 9 AM" 
                icon={Sun} 
                unlocked={stats.totalCompleted > 5} 
              />
              <BadgeItem 
                title="Strike Master" 
                desc="Reached a 3-day streak" 
                icon={Zap} 
                unlocked={stats.streak >= 3} 
              />
              <BadgeItem 
                title="Deep Work Ninja" 
                desc="Focus for 10 hours total" 
                icon={Brain} 
                unlocked={stats.totalCompleted > 20} 
              />
               <BadgeItem 
                title="AI Visionary" 
                desc="Used 5 AI suggestions" 
                icon={Sparkles} 
                unlocked={stats.aiSuggestionsUsed >= 5} 
              />
            </div>
            <Button variant="ghost" size="sm" className="mt-6 w-full">View All Badges</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const BadgeItem = ({ title, desc, icon: Icon, unlocked }: any) => (
  <div className={cn(
    "flex items-center gap-3 p-3 rounded-2xl border transition-all",
    unlocked ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30" : "bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-50 grayscale"
  )}>
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center",
      unlocked ? "bg-white dark:bg-slate-900 shadow-sm" : "bg-slate-200 dark:bg-slate-700"
    )}>
      <Icon className={cn("w-5 h-5", unlocked ? "text-indigo-600" : "text-slate-400")} />
    </div>
    <div>
      <p className="text-xs font-bold leading-none mb-1">{title}</p>
      <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
    </div>
  </div>
);

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <Card className="relative overflow-hidden group hover:-translate-y-1">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${color} opacity-10 rounded-full group-hover:scale-110 transition-transform`}></div>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-green-500 text-xs font-bold px-2 py-1 bg-green-50 dark:bg-green-950/20 rounded-lg">
        <ArrowUpRight className="w-3 h-3" /> {trend}
      </div>
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-display font-bold">{value}</h4>
    </div>
  </Card>
);
