import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Menu,
  ChevronRight,
  User as UserIcon,
  Cpu,
  Building2,
  Loader2
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

const SplashScreen = () => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-12"
    >
      <div className="relative w-24 h-24">
        <Building2 className="w-full h-full text-white" />
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white/20 blur-3xl rounded-full"
        />
      </div>
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white italic">Andrés Bello</h1>
        <div className="flex items-center justify-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-zinc-500 pl-2">Núcleo Institucional</p>
        </div>
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

  // Load Sidebar once
  useEffect(() => {
    import('./components/AppSidebar').then(module => {
      setAppSidebar(() => module.default);
    });
  }, []);

  // Fetch data on token change or initial mount
  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    const fetchData = async () => {
      setIsInitializing(true); // Always show splash when starting a fetch sequence (e.g. post-login)
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resStd, resAi] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/ai/analytics`, { headers })
        ]);
        
        if (resStd.ok && resAi.ok) {
            const stds = await resStd.json();
            const ai = await resAi.json();
            
            setStats(prev => ({
              ...prev,
              students: stds.length,
              risks: ai.alerts ? ai.alerts.filter(a => a.type === 'danger').length : 0
            }));
            setAiData(ai);
        }
        
        // Institutional Delay for "Processing" feel
        setTimeout(() => setIsInitializing(false), 1500);
      } catch (e) { 
        console.error('Error sincronizando datos...', e); 
        setIsInitializing(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    // fetchData useEffect will trigger because of setToken
  };

  if (isInitializing) return <SplashScreen />;
  if (!token) return <Login onLogin={handleLogin} />;
  
  // If we have token but sidebar isn't loaded yet, show a subtle loader instead of black screen
  if (!AppSidebar) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-800 animate-spin" />
    </div>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans antialiased overflow-hidden">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userName={user?.username} 
        />
        
        <SidebarInset className="bg-black relative overflow-hidden border-none shadow-none flex flex-col">
          {/* Global Ambient Glow */}
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/5 blur-[180px] pointer-events-none rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/5 blur-[180px] pointer-events-none rounded-full" />
          
          <header className="flex h-20 shrink-0 items-center justify-between px-10 sticky top-0 bg-black/60 backdrop-blur-xl z-30 border-b border-white/[0.05]">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-zinc-500 hover:text-white transition-all p-2.5 hover:bg-white/5 rounded-2xl active:scale-95" />
              <div className="h-6 w-[1px] bg-white/10 mx-2" />
              <div className="flex items-center gap-4">
                <span className="text-base font-semibold tracking-tight text-white/90 italic">Andrés Bello</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] apple-shadow-soft">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Core Secured</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-full"
              >
                {activeTab === 'dashboard' && <Dashboard stats={stats} aiData={aiData} />}
                {activeTab === 'students' && <Students />}
                {activeTab === 'attendance' && <AttendanceSheet />}
                {activeTab === 'justifications' && <Justifications />}
                {activeTab === 'reports' && <IAAnalytics />}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="h-20 flex items-center px-10 justify-between opacity-30 select-none">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO • SISTEMA DE CONTROL DE ASISTENCIA
                </span>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default App;
