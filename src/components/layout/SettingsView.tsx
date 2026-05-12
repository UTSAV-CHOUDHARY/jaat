import React, { useState, useEffect } from "react";
import { User as UserIcon, Bell, Shield, Palette, Save, LogOut, ChevronRight } from "lucide-react";
import { Card, Button } from "../ui/Base";
import { auth } from "../../services/firebase";

interface SettingsViewProps {
  onNotify: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNotify, onLogout }) => {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dailyGoal, setDailyGoal] = useState(5);

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-500" /> Profile Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-600">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={name} className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                ) : (
                  name.charAt(0) || "U"
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{name || "User"}</p>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 opacity-60 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Daily Completion Goal</label>
              <input 
                type="number" 
                value={dailyGoal} 
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-32 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Notifications & Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div>
                <p className="font-bold">Desktop Notifications</p>
                <p className="text-sm text-slate-500">Get alerts for upcoming tasks and breaks</p>
              </div>
              <Button variant="secondary" onClick={onNotify}>Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div>
                <p className="font-bold">Smart Reminders</p>
                <p className="text-sm text-slate-500">AI-powered nudges when you're off track</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button className="flex-1 gap-2 py-4">
            <Save className="w-5 h-5" /> Save Changes
          </Button>
          <Button variant="danger" className="gap-2 py-4 px-8" onClick={onLogout}>
            <LogOut className="w-5 h-5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
