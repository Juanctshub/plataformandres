import React, { useState, useEffect, useCallback } from 'react';
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

const SplashScreen = ({ isInitialized }) => (
  <motion.div 
    key="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    {/* Ambient Glow */}
    <motion.div 
       animate={{ 
         scale: [1, 1.2, 1],
         opacity: [0.1, 0.2, 0.1]
       }}
       transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"
    />

    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-10"
    >
      <div className="relative w-28 h-28">
        <Building2 className="w-full h-full text-white/90" />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white/10 blur-3xl rounded-full"
        />
      </div>
      
      <div className="space-y-6 text-center">
        <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white italic">Andrés Bello</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500 pl-2">Núcleo Institucional</p>
        </div>

        {/* Apple Style Progress Bar */}
        <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mx-auto relative">
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: isInitialized ? "0%" : "200%" }}
             transition={{ 
               duration: isInitialized ? 0.8 : 2.5, 
               ease: isInitialized ? "easeOut" : "linear",
               repeat: isInitialized ? 0 : Infinity 
             }}
             className="absolute inset-0 bg-white/40"
           />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, attendance: '98.5%', risks: 0 });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });
  const [isInitializing, setIsInitializing] = useState(true);
  const [AppSidebar, setAppSidebar] = useState(null);

  // Pre-load Sidebar component immediately on mount
  useEffect(() => {
    let isMounted = true;
    import('./components/AppSidebar').then(module => {
      if (isMounted) setAppSidebar(() => module.default);
    }).catch(err => console.error("Error cargando Sidebar:", err));
    return () => { isMounted = false; };
  }, []);

  const fetchData = useCallback(async (tokenValue) => {
    if (!tokenValue) {
      setIsInitializing(false);
      return;
    }

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${tokenValue}` };
      
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
      
      // Institutional Finish Delay
      setTimeout(() => setIsInitializing(false), 800);
    } catch (e) { 
      console.error('Error de sincronización:', e); 
      setIsInitializing(false);
    }
  }, []);

  // Initial Sync
  useEffect(() => {
    fetchData(token);
  }, [token, fetchData]);

  const handleLogin = (data) => {
    setIsInitializing(true); // Immediate splash feedback on login click
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    // fetchData will be triggered by token change
  };

  return (
    <AnimatePresence mode="wait">
      {isInitializing ? (
        <SplashScreen key="splash" isInitialized={!isInitializing} />
      ) : !token ? (
        <Login key="login" onLogin={handleLogin} />
      ) : !AppSidebar ? (
        <div key="sidebar-loader" className="min-h-screen bg-black flex items-center justify-center">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            />
        </div>
      ) : (
        <SidebarProvider key="app-shell">
          <div className="flex min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans antialiased overflow-hidden">
            <AppSidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              userName={user?.username} 
            />
            
            <SidebarInset className="bg-black relative overflow-hidden border-none shadow-none flex flex-col">
              {/* Background Ambient Layers */}
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] blur-[200px] pointer-events-none rounded-full" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/[0.03] blur-[200px] pointer-events-none rounded-full" />
              
              <header className="flex h-20 shrink-0 items-center justify-between px-10 sticky top-0 bg-black/60 backdrop-blur-3xl z-30 border-b border-white/[0.05]">
                <div className="flex items-center gap-6">
                  <SidebarTrigger className="text-zinc-500 hover:text-white transition-all p-2.5 hover:bg-white/5 rounded-2xl active:scale-95" />
                  <div className="h-6 w-[1px] bg-white/10 mx-2" />
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold tracking-tight text-white/90 italic">Andrés Bello</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/10 apple-shadow-soft">
                        {activeTab}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest italic pt-0.5">Core Secured</span>
                  </div>
                </div>
              </header>

              <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
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
      )}
    </AnimatePresence>
  );
};

export default App;
