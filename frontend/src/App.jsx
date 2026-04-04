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
  X,
  AlertCircle,
  CheckCircle2,
  Loader2
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
import AIChatView from './AIChatView';
import { Badge } from "./components/ui/badge";
import InstitutionalSettings from './InstitutionalSettings';


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

// Sub-componentes Maestros
const SplashScreen = ({ isInitialized }) => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
    </div>
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative flex flex-col items-center space-y-8"
    >
       <div className="w-24 h-24 rounded-[2.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
          <ShieldCheck className="w-12 h-12 text-white" />
       </div>
       <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-tighter text-white">Andrés Bello</h1>
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.4em] mt-2">Nodo Maestro v19.1</span>
       </div>
    </motion.div>
    <div className="absolute bottom-12 flex flex-col items-center space-y-2">
       <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: isInitialized ? '0%' : '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full h-full bg-blue-500"
          />
       </div>
       <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">Sincronizando registros estelares</span>
    </div>
  </motion.div>
);

const CriticalErrorScreen = ({ onRetry }) => (
  <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-8">
     <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-8">
        <AlertCircle className="w-10 h-10" />
     </div>
     <h2 className="text-3xl font-black text-white tracking-tighter text-center uppercase mb-4">Error Crítico de Núcleo</h2>
     <p className="text-sm text-[#86868b] font-medium text-center max-w-sm mb-12 leading-relaxed">
        El Nodo Maestro no ha respondido en el intervalo asignado. Verifique su red institucional o el estado del servidor.
     </p>
     <Button 
       onClick={onRetry}
       className="h-14 px-12 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-xs tracking-widest uppercase transition-all active:scale-95 shadow-xl"
     >
        REINTENTAR ACCESO
     </Button>
  </div>
);

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
  const [hasCriticalError, setHasCriticalError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const fetchData = useCallback(async (tokenValue) => {
    if (!tokenValue) {
      setIsInitializing(false);
      return;
    }
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${tokenValue}` };
      
      const responses = await Promise.allSettled([
        fetch(`${baseUrl}/api/estudiantes`, { headers }),
        fetch(`${baseUrl}/api/ai/analytics`, { headers }),
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/personal`, { headers })
      ]);

      const [resStd, resAi, resJust, resStaff] = responses.map(r => r.status === 'fulfilled' ? r.value : null);
      const aiDataRes = responses[1];

      // Prepare Notifications based on AI data
      if (aiDataRes.status === 'fulfilled' && aiDataRes.value.ok) {
        const aiJson = await aiDataRes.value.clone().json();
        if (aiJson && aiJson.alerts) {
          setNotifications(aiJson.alerts.map((a, i) => ({
            id: `ai-${i}`,
            title: a.type === 'danger' ? 'ALERTA NEURAL CRÍTICA' : 'NOTIFICACIÓN IA',
            msg: a.msg,
            time: 'Ahora'
          })));
        }
      }
      
      const stds = resStd && resStd.ok ? await resStd.json() : [];
      const ai = resAi && resAi.ok ? await resAi.json() : { title: '', security: '', alerts: [] };
      const justs = resJust && resJust.ok ? await resJust.json() : [];
      const staffArr = resStaff && resStaff.ok ? await resStaff.json() : [];

      setStats({
        students: Array.isArray(stds) ? stds.length : 0,
        attendance: '98.5%',
        risks: (ai.alerts && Array.isArray(ai.alerts)) ? ai.alerts.filter(a => a.type === 'danger').length : 0,
        justifications: Array.isArray(justs) ? justs.filter(j => j.estado === 'pendiente').length : 0,
        staffCount: Array.isArray(staffArr) ? staffArr.length : 0,
        recentActivity: Array.isArray(justs) ? justs.slice(0, 3).map(j => ({
          time: j.fecha,
          event: `Justificativo ${j.estado}: ${j.nombre}`
        })) : []
      });
      setAiData(ai);
      
      // Fetch Notifications
      const resNotif = await fetch(`${baseUrl}/api/notifications`, { headers });
      if (resNotif.ok) setNotifications(await resNotif.json());

      setTimeout(() => setIsInitializing(false), 800);
    } catch (e) { 
      console.error("Critical Fetch Error:", e);
      setHasCriticalError(true);
      setIsInitializing(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (token) fetchData(token);
    else setTimeout(() => setIsInitializing(false), 1500);
  }, [token, fetchData]);

  const handleLogin = (data) => {
    if (!data.token) {
        console.error("Error: Token no recibido del Nodo Maestro");
        return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsInitializing(true);
  };

  return (
    <AnimatePresence mode="wait">
      {hasCriticalError ? (
        <CriticalErrorScreen key="error" onRetry={() => {
           setHasCriticalError(false);
           setIsInitializing(true);
           fetchData(token);
        }} />
      ) : isInitializing ? (
        <SplashScreen key="splash" isInitialized={!isInitializing} />
      ) : !token ? (
        <Login key="login" onLogin={handleLogin} />
      ) : (
        <div key="app-root" className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30">
          
          <AnimatePresence>
            {activeTab !== 'aichat' && (
              <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-24 apple-glass border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-[80]"
              >
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                     <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-white" />
                     </div>
                     <div className="flex flex-col">
                        <h2 className="text-sm font-bold tracking-tight text-white leading-none">Andrés Bello</h2>
                        <span className="text-[10px] font-medium text-[#86868b] tracking-wider uppercase mt-1">SaaS Suite v15.0</span>
                     </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-5 py-2 active:scale-95 group focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                     <Search className="w-3.5 h-3.5 text-[#86868b] group-focus-within:text-blue-400" />
                     <input 
                       type="text" 
                       placeholder="Explorar sistema... (Enter para buscar)" 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           if (searchTerm.trim()) {
                             setActiveTab('aichat');
                           }
                         }
                       }}
                       className="bg-transparent border-none outline-none text-[11px] font-medium text-white placeholder:text-[#86868b] w-48"
                     />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="relative">
                      <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2.5 rounded-full hover:bg-white/5 transition-all ${isNotifOpen ? 'bg-white/10 text-white' : 'text-[#86868b]'}`}
                      >
                         <Bell className="w-5 h-5" />
                         {notifications.length > 0 && (
                            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-black" />
                         )}
                      </button>
                      
                      <AnimatePresence>
                        {isNotifOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 apple-glass border border-white/10 rounded-[1.75rem] shadow-2xl p-6 z-[100]"
                          >
                             <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Notificaciones</h4>
                                <Badge className="bg-blue-600/20 text-blue-400 border-none px-2 py-0.5 text-[8px]">{notifications.length}</Badge>
                             </div>
                             <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                                {notifications.map(n => (
                                  <div 
                                    key={n.id} 
                                    onClick={() => {
                                      setActiveTab('aichat');
                                      setIsNotifOpen(false);
                                    }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                                  >
                                     <div className="flex items-center gap-3 mb-1">
                                        <Sparkles className="w-3 h-3 text-blue-400" />
                                        <span className="text-[9px] font-bold text-white uppercase">{n.title}</span>
                                     </div>
                                     <p className="text-[11px] text-[#86868b] leading-tight group-hover:text-white/80 transition-colors">{n.msg}</p>
                                  </div>
                                ))}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
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
              </motion.header>
            )}
          </AnimatePresence>

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
                {activeTab === 'aichat' && <AIChatView searchTerm={searchTerm} user={user} onClose={() => setActiveTab('dashboard')} />}
              </motion.div>
            </AnimatePresence>
          </main>

          <AnimatePresence>
            {activeTab !== 'aichat' && (
              <>
                <FloatingNav 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                  userName={user?.username} 
                  onLogout={handleLogout}
                />

                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('aichat')}
                  className="fixed bottom-24 right-10 w-16 h-16 apple-glass rounded-3xl flex items-center justify-center z-[90] group shadow-2xl transition-all text-blue-400"
                >
                   <Sparkles className="w-7 h-7" />
                   <div className="absolute -top-12 right-0 apple-glass px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
                     <span className="text-[11px] whitespace-nowrap font-semibold text-white/90">Asistente IA</span>
                  </div>
                </motion.button>
              </>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};

export default AndresBelloSuite;
