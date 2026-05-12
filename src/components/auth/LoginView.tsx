import React from "react";
import { motion } from "motion/react";
import { CheckSquare, Sparkles, Shield, Zap, Globe, ArrowRight } from "lucide-react";
import { Button } from "../ui/Base";
import { signInWithGoogle } from "../../services/firebase";

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (error) {
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8 transform hover:scale-110 transition-transform cursor-pointer">
            <CheckSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-slate-900 mb-6">
            ZenTask <span className="text-indigo-600">Pro</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Productivity Reimagined. Elevate your focus with AI-powered task management and seamless multi-device sync.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <FeatureCard 
            icon={Sparkles} 
            title="AI Insights" 
            desc="Smart suggestions to optimize your daily workflow and goal setting."
          />
          <FeatureCard 
            icon={Globe} 
            title="Cloud Sync" 
            desc="Access your data anywhere, anytime with instant secure cloud synchronization."
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure Data" 
            desc="Your privacy is priority. Enterprise-grade encryption for all your data."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <Button 
            onClick={handleLogin}
            className="px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl shadow-indigo-600/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Continue with Google <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          <p className="text-slate-400 text-sm">Join 50,000+ high-achievers today.</p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <FloatingIcon icon={Zap} delay={0} className="top-20 left-[10%]" />
      <FloatingIcon icon={Sparkles} delay={2} className="top-40 right-[15%]" />
      <FloatingIcon icon={CheckSquare} delay={1} className="bottom-20 left-[20%]" />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all hover:-translate-y-1 hover:shadow-xl group">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 transition-colors">
      <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const FloatingIcon = ({ icon: Icon, delay, className }: any) => (
  <motion.div
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className={`absolute hidden lg:block opacity-10 ${className}`}
  >
    <Icon className="w-16 h-16 text-indigo-600" />
  </motion.div>
);
