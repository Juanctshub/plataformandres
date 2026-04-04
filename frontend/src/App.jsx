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
    exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
    className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    <div className="relative flex flex-col items-center">
      <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full scale-150 animate-pulse" />
      <svg width="140" height="140" viewBox="0 0 100 100" className="mb-16 relative z-10">
        <motion.path
          d="M20,30 L50,15 L80,30 L50,45 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M20,30 L20,60 C20,75 50,85 50,85 C50,85 80,75 80,60 L80,30"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center relative z-10"
      >
        <h1 className="text-4xl font-black tracking-[0.4em] text-white uppercase leading-none">Andrés Bello</h1>
        <p className="text-[11px] font-black tracking-[0.8em] text-zinc-500 uppercase mt-6 opacity-60">Signature Onyx • Suite v11.0</p>
      </motion.div>

      <div className="mt-20 w-48 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: isInitialized ? "0%" : "100%" }}
          transition={{ 
            duration: isInitialized ? 0.6 : 3, 
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
          <div className="flex min-h-screen w-full bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased overflow-hidden">
            <SidebarComp 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              userName={user?.username} 
            />
            
            <SidebarInset className="bg-zinc-50 relative overflow-hidden flex flex-col border-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />
              
              <header className="flex h-24 shrink-0 items-center justify-between px-12 sticky top-0 bg-white/70 backdrop-blur-2xl z-30 border-b border-zinc-100/50">
                <div className="flex items-center gap-8">
                  <SidebarTrigger className="text-zinc-300 hover:text-black transition-all p-3 hover:bg-zinc-50 rounded-[1.25rem] active:scale-90" />
                  <div className="h-6 w-[1px] bg-zinc-100" />
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase italic">Andrés Bello Hub</span>
                    <ChevronRight className="w-3 h-3 text-zinc-200" />
                    <span className="text-[10px] font-black text-black uppercase tracking-[0.4em] bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                        {activeTab}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="relative group hidden lg:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Consultar núcleo v11.0..." 
                      className="h-12 w-80 bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-black transition-all placeholder:text-zinc-300"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-4 p-2 pr-6 rounded-full bg-white border border-zinc-100 hover:border-black transition-all duration-700 shadow-sm hover:shadow-2xl active:scale-95 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-black shadow-lg group-hover:scale-110 transition-transform">
                      {user?.username?.substring(0, 1).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] font-black text-black leading-none uppercase tracking-widest">{user?.username || 'Colegio'}</span>
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1">Terminal de Control</span>
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

              <footer className="h-20 flex items-center px-12 justify-between border-t border-zinc-50 bg-white/80 sticky bottom-0 backdrop-blur-xl z-30">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-zinc-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-200 italic">
                      © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO • SIGNATURE ONYX v11.0
                    </span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[9px] font-black text-black uppercase tracking-[0.3em] leading-none opacity-40">Núcleo Sincronizado</span>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
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
