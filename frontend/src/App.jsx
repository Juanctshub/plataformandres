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
  Loader2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  GraduationCap,
  CalendarRange,
  Briefcase,
  Sparkles,
  Settings
} from 'lucide-react';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';
import Grades from './Grades';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Estudiantes', icon: Users },
  { id: 'attendance', label: 'Asistencia', icon: ClipboardCheck },
  { id: 'justifications', label: 'Justificativos', icon: FileText },
  { id: 'grades', label: 'Calificaciones', icon: GraduationCap },
  { id: 'schedules', label: 'Horarios', icon: CalendarRange },
  { id: 'staff', label: 'Personal Docente', icon: Briefcase },
  { id: 'analytics', label: 'Inteligencia IA', icon: Sparkles },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "./components/ui/sidebar";

const SplashScreen = ({ isInitialized }) => (
  <motion.div 
    key="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-16"
    >
      {/* Apple Breathing Logo */}
      <motion.div 
        animate={{ 
          scale: [1, 1.04, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20"
      >
        <Building2 className="w-full h-full text-white" strokeWidth={1.5} />
      </motion.div>
      
      <div className="space-y-8 flex flex-col items-center">
        <div className="space-y-1">
            <h1 className="text-xl font-light tracking-[0.25em] text-white/90 uppercase text-center">Andrés Bello</h1>
            <p className="text-[8px] font-medium tracking-[0.5em] text-zinc-600 uppercase text-center pl-2">Núcleo Institucional</p>
        </div>

        {/* Minimalist Apple Progress Line (1px) */}
        <div className="w-40 h-[1px] bg-zinc-900 rounded-full overflow-hidden relative mt-4">
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: isInitialized ? "0%" : "200%" }}
             transition={{ 
               duration: isInitialized ? 1.2 : 3, 
               ease: isInitialized ? "circOut" : "linear",
               repeat: isInitialized ? 0 : Infinity 
             }}
             className="absolute inset-0 bg-white"
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
      
      setTimeout(() => setIsInitializing(false), 1200);
    } catch (e) { 
      console.error('Error de sincronización:', e); 
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(token);
  }, [token, fetchData]);

  const handleLogin = (data) => {
    setIsInitializing(true);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
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
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="w-8 h-8 border-[1.5px] border-white/5 border-t-white rounded-full"
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
            
            <SidebarInset className="bg-zinc-950 relative overflow-hidden border-none shadow-none flex flex-col">
              {/* Apple-style background depth */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#18181b,transparent)] pointer-events-none" />
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] blur-[150px] pointer-events-none rounded-full" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/[0.02] blur-[100px] pointer-events-none rounded-full" />
              
              <header className="flex h-20 shrink-0 items-center justify-between px-10 sticky top-0 bg-black/60 backdrop-blur-3xl z-30 border-b border-white/[0.05]">
                <div className="flex items-center gap-6">
                  <SidebarTrigger className="text-zinc-600 hover:text-white transition-all p-2.5 hover:bg-white/5 rounded-2xl active:scale-95" />
                  <div className="h-6 w-[1px] bg-white/10 mx-2" />
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium tracking-tight text-white/90 italic">Andrés Bello</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10 apple-shadow-soft">
                        {activeTab}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[9px] font-extrabold text-zinc-600 uppercase tracking-widest italic pt-0.5">Secure v9.0</span>
                  </div>
                </div>
              </header>

              <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.005 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-full"
                  >
                    {activeTab === 'dashboard' && <Dashboard stats={stats} aiData={aiData} />}
                    {activeTab === 'students' && <Students />}
                    {activeTab === 'attendance' && <AttendanceSheet />}
                    {activeTab === 'justifications' && <Justifications />}
                    {activeTab === 'grades' && <Grades />}
                    {activeTab === 'schedules' && <div className="flex items-center justify-center h-[60vh] text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Módulo de Horarios en Desarrollo...</div>}
                    {activeTab === 'staff' && <div className="flex items-center justify-center h-[60vh] text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Módulo de Personal Docente en Desarrollo...</div>}
                    {activeTab === 'analytics' && <IAAnalytics />}
                    {activeTab === 'settings' && <div className="flex items-center justify-center h-[60vh] text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Módulo de Configuración en Desarrollo...</div>}
                  </motion.div>
                </AnimatePresence>
              </main>

              <footer className="h-20 flex items-center px-10 justify-between opacity-30 select-none">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-zinc-700" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-700">
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
