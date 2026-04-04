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
    exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    <div className="relative flex flex-col items-center">
      <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full scale-150 animate-pulse" />
      <svg width="100" height="100" viewBox="0 0 100 100" className="mb-10 relative z-10">
        <motion.path
          d="M20,30 L50,15 L80,30 L50,45 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M20,30 L20,60 C20,75 50,85 50,85 C50,85 80,75 80,60 L80,30"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center relative z-10"
      >
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Andrés Bello</h1>
        <div className="flex items-center justify-center gap-3 mt-4">
           <div className="h-[1px] w-4 bg-white/10" />
           <p className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">Apple Pro v14.0 • Dark</p>
           <div className="h-[1px] w-4 bg-white/10" />
        </div>
      </motion.div>

      <div className="mt-12 w-32 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: isInitialized ? "0%" : "100%" }}
          transition={{ 
            duration: isInitialized ? 0.5 : 2.5, 
            repeat: isInitialized ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-white"
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
          <div className="flex min-h-screen w-full bg-black text-white selection:bg-white/20 selection:text-white font-sans antialiased overflow-hidden dark-mesh">
            <SidebarComp 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              userName={user?.username} 
            />
            
            <SidebarInset className="bg-black/20 relative overflow-hidden flex flex-col border-none">
              <header className="flex h-20 shrink-0 items-center justify-between px-10 sticky top-0 glass-dark z-30">
                <div className="flex items-center gap-6">
                  <SidebarTrigger className="text-white/40 hover:text-white transition-all p-2.5 hover:bg-white/5 rounded-xl active:scale-90" />
                  <div className="h-5 w-[1px] bg-white/10" />
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black tracking-widest text-white/30 uppercase italic">Nucleo Andrés Bello v14.0</span>
                    <ChevronRight className="w-3 h-3 text-white/10" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        {activeTab}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative group hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Consultar núcleo v14.0..." 
                      className="h-10 w-72 bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/20"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-3 p-1.5 pr-5 rounded-xl bg-[#1C1C1E] border border-white/5 hover:border-white/10 transition-all shadow-xl active:scale-95 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black text-[10px] font-black group-hover:scale-105 transition-transform">
                      {user?.username?.substring(0, 1).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col items-start translate-y-[1px]">
                      <span className="text-[10px] font-black text-white leading-none uppercase tracking-widest">{user?.username || 'Admin'}</span>
                      <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1 opacity-60">Control Maestro</span>
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

              <footer className="h-16 flex items-center px-10 justify-between border-t border-white/5 bg-black/60 sticky bottom-0 glass-dark z-30">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-4 h-4 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                      © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO • APPLE PRO v14.0
                    </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Núcleo Sincronizado</span>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
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
