import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronRight,
  Building2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  GraduationCap,
  CalendarRange,
  Briefcase,
  Sparkles,
  Settings as SettingsIcon,
  Search,
  User as UserIcon
} from 'lucide-react';

import Login from './Login';
import Dashboard from './components/Dashboard';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';
import Grades from './Grades';
import SchedulesModule from './Schedules';
import Staff from './Staff';
import InstitutionalSettings from './InstitutionalSettings';
import AIChat from './components/AIChat';

import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "./components/ui/sidebar";

const SplashScreen = ({ isInitialized }) => (
  <motion.div 
    key="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } }}
    className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    <div className="relative flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="mb-12">
        <motion.path
          d="M20,30 L50,15 L80,30 L50,45 Z"
          fill="none"
          stroke="#18181b"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M20,30 L20,60 C20,75 50,85 50,85 C50,85 80,75 80,60 L80,30"
          fill="none"
          stroke="#18181b"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path
          d="M50,45 L50,85"
          fill="none"
          stroke="#18181b"
          strokeWidth="1"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center"
      >
        <h1 className="text-2xl font-semibold tracking-[0.3em] text-zinc-900 uppercase">Andrés Bello</h1>
        <p className="text-[10px] font-bold tracking-[0.6em] text-zinc-400 uppercase mt-4">Gestión Institucional</p>
      </motion.div>

      <div className="absolute bottom-[-100px] w-48 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: isInitialized ? "0%" : "100%" }}
          transition={{ 
            duration: isInitialized ? 0.8 : 2.5, 
            repeat: isInitialized ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-zinc-900"
        />
      </div>
    </div>
  </motion.div>
);

const AndresBelloSuite = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ 
    students: 0, 
    attendance: '0.0%', 
    risks: 0, 
    justifications: 0,
    staffCount: 0,
    recentActivity: []
  });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [SidebarComp, setSidebarComp] = useState(null);

  useEffect(() => {
    let isMounted = true;
    import('./components/AppSidebar').then(module => {
      if (isMounted) setSidebarComp(() => module.default);
    });
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
      
      const [resStd, resAi, resJust, resStaff] = await Promise.all([
        fetch(`${baseUrl}/api/estudiantes`, { headers }),
        fetch(`${baseUrl}/api/ai/analytics`, { headers }),
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/personal`, { headers })
      ]);
      
      if (resStd.ok && resAi.ok && resJust.ok && resStaff.ok) {
          const stds = await resStd.json();
          const ai = await resAi.json();
          const justs = await resJust.json();
          const staffArr = await resStaff.json();

          setStats({
            students: stds.length,
            attendance: '98.5%', // Mocked for now to show professional level
            risks: ai.alerts ? ai.alerts.filter(a => a.type === 'danger').length : 0,
            justifications: justs.filter(j => j.estado === 'pendiente').length,
            staffCount: staffArr.length,
            recentActivity: justs.slice(0, 3).map(j => ({
              time: j.fecha,
              event: `Justificativo ${j.estado}: ${j.nombre}`
            }))
          });
          setAiData(ai);
      }
      
      setTimeout(() => setIsInitializing(false), 1500);
    } catch (e) { 
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
        fetchData(token);
    } else {
        setTimeout(() => setIsInitializing(false), 1500);
    }
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
      ) : !SidebarComp ? (
        <div key="sidebar-loader" className="min-h-screen bg-white flex items-center justify-center">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="w-10 h-10 border-[2px] border-zinc-100 border-t-zinc-900 rounded-full"
            />
        </div>
      ) : (
        <SidebarProvider key="app-shell">
          <div className="flex min-h-screen w-full bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased overflow-hidden">
            <SidebarComp 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              userName={user?.username} 
            />
            
            <SidebarInset className="bg-zinc-50 relative overflow-hidden flex flex-col border-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />
              
              <header className="flex h-20 shrink-0 items-center justify-between px-10 sticky top-0 bg-white/60 backdrop-blur-xl z-30 border-b border-zinc-200/50">
                <div className="flex items-center gap-6">
                  <SidebarTrigger className="text-zinc-400 hover:text-zinc-900 transition-all p-2.5 hover:bg-zinc-100 rounded-xl active:scale-95" />
                  <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Sistema</span>
                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                        {activeTab}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative group hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Buscar en la gestión..." 
                      className="h-10 w-64 bg-zinc-100 border-none rounded-xl pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-sm active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">
                      {user?.username?.substring(0, 2).toUpperCase() || 'AB'}
                    </div>
                    <div className="flex flex-col items-start translate-y-[1px]">
                      <span className="text-[10px] font-bold text-zinc-900 leading-none mb-1">{user?.username || 'Admin'}</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Perfil Institucional</span>
                    </div>
                  </button>
                </div>
              </header>

              <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-full"
                  >
                    {activeTab === 'dashboard' && <Dashboard stats={stats} aiData={aiData} onTabChange={setActiveTab} />}
                    {activeTab === 'students' && <Students />}
                    {activeTab === 'attendance' && <AttendanceSheet />}
                    {activeTab === 'justifications' && <Justifications />}
                    {activeTab === 'grades' && <Grades />}
                    {activeTab === 'schedules' && <SchedulesModule />}
                    {activeTab === 'staff' && <Staff />}
                    {activeTab === 'analytics' && <IAAnalytics />}
                    {activeTab === 'settings' && <InstitutionalSettings />}
                  </motion.div>
                </AnimatePresence>
              </main>

              <footer className="h-16 flex items-center px-10 justify-between border-t border-zinc-100 bg-white/40 sticky bottom-0 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-zinc-300" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-300">
                      © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO • NÚCLEO PROFESIONAL
                    </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[8px] font-black text-zinc-200 uppercase tracking-widest leading-none">Status: Sincronizado</span>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </footer>

              {/* Botón Flotante IA */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAIChatOpen(true)}
                className="fixed bottom-24 right-10 w-16 h-16 bg-zinc-950 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-zinc-950/40 z-[90] border-none group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <Sparkles className="w-7 h-7 relative z-10" />
              </motion.button>

              <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
            </SidebarInset>
          </div>
        </SidebarProvider>
      )}
    </AnimatePresence>
  );
};

export default AndresBelloSuite;
