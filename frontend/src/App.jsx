import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
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
  Bell,
  Cpu,
  LogOut,
  ChevronRight,
  User as UserIcon,
  X
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

// SplashScreen (Keeping the current one as requested)
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
           <p className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">Apple Glass v15.0 • Pro</p>
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

const FloatingNav = ({ activeTab, onTabChange, userName, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'students', icon: Users, label: 'Matrícula' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Asistencia' },
    { id: 'grades', icon: GraduationCap, label: 'Notas' },
    { id: 'schedules', icon: CalendarRange, label: 'Horarios' },
    { id: 'analytics', icon: Cpu, label: 'IA Analytics' },
    { id: 'settings', icon: SettingsIcon, label: 'Ajustes' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -track-x-1/2 -translate-x-1/2 z-[100] w-fit">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="apple-glass rounded-full px-4 py-2.5 flex items-center gap-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`p-3.5 rounded-full transition-all duration-300 relative group flex flex-col items-center ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-[#86868b] hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-[20px] h-[20px]" strokeWidth={2} />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 apple-glass px-4 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
               <span className="text-[10px] whitespace-nowrap font-semibold text-white/90">{item.label}</span>
            </div>
            {activeTab === item.id && (
              <motion.div layoutId="navGlow" className="absolute inset-0 bg-blue-400/20 blur-md rounded-full -z-10" />
            )}
          </button>
        ))}
        <div className="h-8 w-[1px] bg-white/10 mx-2" />
        <button 
          onClick={onLogout}
          className="p-3.5 rounded-full text-[#86868b] hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </motion.div>
    </div>
  );
};

const AndresBelloSuite = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [stats, setStats] = useState({ 
    students: 0, 
    attendance: '98.2%', 
    risks: 0, 
    justifications: 0,
    staffCount: 0,
    recentActivity: []
  });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });

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
            attendance: '98.5%',
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
    if (token) fetchData(token);
    else setTimeout(() => setIsInitializing(false), 1500);
  }, [token, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsInitializing(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isInitializing ? (
        <SplashScreen key="splash" isInitialized={!isInitializing} />
      ) : !token ? (
        <Login key="login" onLogin={handleLogin} />
      ) : (
        <div key="app-root" className="min-h-screen bg-[#000000] selection:bg-blue-500/30 selection:text-white apple-bg-mesh pb-32">
          {/* Top Bar Glass */}
          <header className="sticky top-0 z-[80] w-full border-b border-white/[0.05] bg-[#000000]/60 backdrop-blur-xl px-12 h-20 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <div className="flex flex-col">
                    <h2 className="text-sm font-bold tracking-tight text-white leading-none">Andrés Bello</h2>
                    <span className="text-[10px] font-medium text-[#86868b] tracking-wider uppercase mt-1">SaaS Suite v15.0</span>
                 </div>
              </div>
              <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
              <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-5 py-1.5 active:scale-95 cursor-pointer hover:bg-white/10 transition-all">
                 <Search className="w-3.5 h-3.5 text-[#86868b]" />
                 <span className="text-[11px] font-medium text-[#86868b]">Explorar sistema...</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <button className="relative p-2.5 rounded-full hover:bg-white/5 text-[#86868b] hover:text-white transition-all">
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-black" />
               </button>
               <div className="h-8 w-[1px] bg-white/10" />
               <div className="flex items-center gap-4 group cursor-pointer pr-2">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-white uppercase">{user?.username || 'Admin'}</span>
                    <span className="text-[9px] font-medium text-blue-500 tracking-widest uppercase mt-0.5">Control Maestro</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {user?.username?.substring(0, 1).toUpperCase() || 'A'}
                  </div>
               </div>
            </div>
          </header>

          <main className="max-w-[1400px] mx-auto px-8 py-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

          <FloatingNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            userName={user?.username} 
            onLogout={handleLogout}
          />

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAIChatOpen(true)}
            className="fixed bottom-24 right-10 w-16 h-16 apple-glass text-blue-400 rounded-3xl flex items-center justify-center z-[90] group shadow-2xl"
          >
             <Sparkles className="w-7 h-7" />
             <div className="absolute -top-12 right-0 apple-glass px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
               <span className="text-[11px] whitespace-nowrap font-semibold text-white/90">Asistente IA</span>
            </div>
          </motion.button>

          <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        </div>
      )}
    </AnimatePresence>
  );
};

export default AndresBelloSuite;
