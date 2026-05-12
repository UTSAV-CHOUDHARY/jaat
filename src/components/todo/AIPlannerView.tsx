import React, { useState } from "react";
import { Sparkles, Lightbulb, ListTodo, Calendar, Loader2, ArrowRight } from "lucide-react";
import { Button, Card } from "../ui/Base";
import { aiService } from "../../services/aiService";
import { Task } from "../../types";

interface AIPlannerViewProps {
  tasks: Task[];
  onAddTask: (task: any) => void;
  stats: any;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({ tasks, onAddTask, stats }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const getSuggestions = async () => {
    setLoading("suggestions");
    const suggestions = await aiService.getTaskSuggestions(tasks);
    setResult({ type: "suggestions", data: suggestions });
    setLoading(null);
  };

  const getPlanner = async () => {
    setLoading("planner");
    const plan = await aiService.getDailyPlanner(tasks);
    setResult({ type: "planner", data: plan });
    setLoading(null);
  };

  const getTips = async () => {
    setLoading("tips");
    const tips = await aiService.getProductivityTips(stats);
    setResult({ type: "tips", data: tips });
    setLoading(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Powered by Gemini
        </div>
        <h1 className="text-4xl font-display font-bold">AI Workspace</h1>
        <p className="text-slate-500">Your intelligent productivity partner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AIActionCard 
          title="Daily Planner" 
          desc="AI-crafted daily schedule" 
          icon={Calendar} 
          onClick={getPlanner}
          loading={loading === "planner"}
        />
        <AIActionCard 
          title="Smart Suggestions" 
          desc="Contextual task ideas" 
          icon={ListTodo} 
          onBetter={getSuggestions}
          onClick={getSuggestions}
          loading={loading === "suggestions"}
        />
        <AIActionCard 
          title="Deep Work Tips" 
          desc="Personalized focus hacks" 
          icon={Lightbulb} 
          onClick={getTips}
          loading={loading === "tips"}
        />
      </div>

      {result && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-500">
           {result.type === "suggestions" && (
             <div className="space-y-4">
               <h3 className="text-xl font-display font-bold flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-indigo-500" /> AI Suggested Tasks
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {result.data.map((s: any, i: number) => (
                   <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-300 transition-all">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{s.priority} priority</span>
                       <span className="text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">{s.category}</span>
                     </div>
                     <h4 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h4>
                     <p className="text-sm text-slate-500 mb-4 line-clamp-2">{s.description}</p>
                     <Button 
                       size="sm" 
                       variant="secondary" 
                       className="w-full gap-2 group-hover:bg-indigo-600 group-hover:text-white"
                       onClick={() => onAddTask(s)}
                     >
                       Add to list <ArrowRight className="w-4 h-4" />
                     </Button>
                   </div>
                 ))}
               </div>
             </div>
           )}
           {result.type === "planner" && (
             <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-display font-bold mb-4">Your Intelligence-Augmented Plan</h3>
                <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {result.data}
                </div>
             </div>
           )}
           {result.type === "tips" && (
             <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-display font-bold mb-4">Focus Optimization Tips</h3>
                <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {result.data}
                </div>
             </div>
           )}
        </Card>
      )}
    </div>
  );
};

const AIActionCard = ({ title, desc, icon: Icon, onClick, loading }: any) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="flex flex-col items-center p-8 bg-white dark:bg-slate-900 text-center rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group"
  >
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors">
      {loading ? <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /> : <Icon className="w-8 h-8 text-indigo-600" />}
    </div>
    <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </button>
);
