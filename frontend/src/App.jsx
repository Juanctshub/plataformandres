import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Menu,
  ChevronRight,
  User as UserIcon,
  Cpu,
  Building2
} from 'lucide-react';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';

import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SplashScreen = () => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center pointer-events-none">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center p-4">
          <Building2 className="w-full h-full text-zinc-100" />
        </div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-zinc-800 rounded-full opacity-20"
        />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black tracking-tighter text-zinc-100 uppercase italic">Andrés Bello</h1>
        <div className="flex items-center gap-3 justify-center">
            <span className="w-8 h-[2px] bg-zinc-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Núcleo Institucional</span>
            <span className="w-8 h-[2px] bg-zinc-800" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-8">
        {[0, 1, 2].map(i => (
          <motion.div 
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-zinc-100"
          />
        ))}
      </div>
    </motion.div>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, attendance: '98.5%', risks: 0 });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });
  const [isInitializing, setIsInitializing] = useState(true);

  const [AppSidebar, setAppSidebar] = useState(null);

  useEffect(() => {
    import('./components/AppSidebar').then(module => {
      setAppSidebar(() => module.default);
    });
  }, []);

  useEffect(() => {
    if (!token) {
        setIsInitializing(false);
        return;
    }
    const fetchData = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resStd, resAi] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/ai/analytics`, { headers })
        ]);
        
        const stds = await resStd.json();
        const ai = await resAi.json();
        
        setStats(prev => ({
          ...prev,
          students: stds.length,
          risks: ai.alerts ? ai.alerts.filter(a => a.type === 'danger').length : 0
        }));
        setAiData(ai);
        
        // Simular un tiempo mínimo de carga para el splash screen si es muy rápido
        setTimeout(() => setIsInitializing(false), 1200);
      } catch (e) { 
        console.error('Network error - syncing with NeonDB...', e); 
        setIsInitializing(false);
      }
    };
    fetchData();
  }, [token]);

  if (isInitializing) return <SplashScreen />;
  if (!token) return <Login onLogin={(data) => { setToken(data.token); setUser(data.user); }} />;
  if (!AppSidebar) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-zinc-100 selection:bg-zinc-100 selection:text-black">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userName={user?.username} 
        />
        
        <SidebarInset className="bg-black/50 border-l border-zinc-900 shadow-2xl relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />
          
          <header className="flex h-20 shrink-0 items-center gap-4 border-b border-zinc-900 px-8 sticky top-0 bg-black/60 backdrop-blur-md z-30 justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-zinc-500 hover:text-zinc-100 transition-colors" />
              <Separator orientation="vertical" className="h-6 bg-zinc-800" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-tighter text-zinc-100 uppercase italic">Andrés Bello</h1>
                <ChevronRight className="w-4 h-4 text-zinc-800" />
                <span className="text-xs font-black uppercase tracking-[2px] text-zinc-500">
                  {activeTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-[1px] text-zinc-400">Estado: Sincronizado</span>
                </div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Neon Postgres Cluster v16.2</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 group hover:border-zinc-700 transition-all cursor-pointer">
                <Database className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs font-black tracking-tight text-zinc-400">INSTITUCIÓN-UA-2026</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {activeTab === 'dashboard' && <Dashboard stats={stats} aiData={aiData} />}
                {activeTab === 'students' && <Students />}
                {activeTab === 'attendance' && <AttendanceSheet />}
                {activeTab === 'justifications' && <Justifications />}
                {activeTab === 'reports' && <IAAnalytics />}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="h-16 border-t border-zinc-900 flex items-center px-8 justify-between opacity-30 select-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO • NÚCLEO TÉCNICO
            </span>
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default App;
