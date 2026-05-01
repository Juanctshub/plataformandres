import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Loader2,
  Bot,
  Check,
  XCircle,
  Send,
  Zap,
  MessageSquare,
  Scan,
  TrendingUp
} from 'lucide-react';

import Login from './Login';
import Dashboard from './components/Dashboard';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';
import Staff from './Staff';
import Grades from './Grades';
import AIChatView from './AIChatView';
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import InstitutionalSettings from './InstitutionalSettings';
import Finance from './Finance';
import LapseControl from './LapseControl';
import VisionAttendance from './VisionAttendance';
import RepresentativeView from './RepresentativeView';
import logo from './assets/logo.png';


// Centinela de Errores (Previene Pantalla Negra)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) { 
    return { hasError: true, errorMsg: error?.message || 'Error desconocido' }; 
  }
  componentDidCatch(error, errorInfo) { 
    console.error("🔴 Centinela — Error capturado:", error?.message, "\n", errorInfo?.componentStack); 
  }
  componentDidUpdate(prevProps) {
    // Auto-reset when navigating between tabs (key changes)
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMsg: '' });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 px-6">
           <div className="w-24 h-24 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-blue-500" />
           </div>
           <div className="space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Módulo en Pausa</h3>
              <p className="text-sm text-[#86868b] font-medium max-w-md mx-auto leading-relaxed">
                Este apartado tuvo un problema al renderizar. Puedes regresar al inicio o recargar la vista.
              </p>
              {this.state.errorMsg && (
                <p className="text-[10px] text-red-400/60 font-mono bg-white/[0.03] p-3 rounded-xl border border-white/5 max-w-sm mx-auto mt-4 break-all">
                  {this.state.errorMsg}
                </p>
              )}
           </div>
           <div className="flex gap-4">
             <Button 
               onClick={() => this.setState({ hasError: false, errorMsg: '' })} 
               className="h-14 px-10 bg-white/5 text-white hover:bg-white/10 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all active:scale-95"
             >
                Reintentar
             </Button>
             <Button 
               onClick={() => window.location.reload()} 
               className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95"
             >
                Recargar Página
             </Button>
           </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const FloatingNav = ({ activeTab, onTabChange, userName, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSafeRole = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored)?.role;
    } catch (e) { return null; }
  };
  const userRole = getSafeRole();
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Lista' },
    { id: 'students', icon: Users, label: 'Alumnos' },
    { id: 'grades', icon: GraduationCap, label: 'Notas' },
    ...(userName === 'admin' || userRole === 'admin' ? [
      { id: 'finance', icon: TrendingUp, label: 'Finanzas' },
      { id: 'staff', icon: Users, label: 'Personal' },
      { id: 'lapses', icon: CalendarRange, label: 'Lapsos' },
      { id: 'settings', icon: SettingsIcon, label: 'Ajustes' }
    ] : [])
  ];

  // Most important items for mobile bottom bar
  const primaryItems = menuItems.slice(0, isMobile ? 4 : menuItems.length);
  const secondaryItems = isMobile ? menuItems.slice(4) : [];

  return (
    <>
      <div className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'bottom-8 left-1/2 -translate-x-1/2'} z-[100] w-full md:w-fit px-4 pb-4 md:pb-0`}>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`apple-glass ${isMobile ? 'rounded-[2.5rem] py-2' : 'rounded-full py-2.5'} px-4 flex items-center justify-around md:justify-center gap-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]`}
        >
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3.5 rounded-full transition-all duration-300 relative group flex flex-col items-center ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' 
                  : 'text-[#86868b] hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={isMobile ? "w-[22px] h-[22px]" : "w-[20px] h-[20px]"} strokeWidth={2} />
              {!isMobile && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 apple-glass px-4 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
                   <span className="text-[10px] whitespace-nowrap font-semibold text-white/90">{item.label}</span>
                </div>
              )}
              {activeTab === item.id && (
                <motion.div layoutId="navGlow" className="absolute inset-0 bg-blue-400/20 blur-md rounded-full -z-10" />
              )}
            </button>
          ))}
          
          {isMobile && secondaryItems.length > 0 && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-3.5 rounded-full text-[#86868b] transition-all ${showMenu ? 'bg-white/10 text-white' : ''}`}
            >
              <SettingsIcon className="w-[22px] h-[22px]" />
            </button>
          )}

          {!isMobile && <div className="h-8 w-[1px] bg-white/10 mx-2" />}
          {!isMobile && (
            <button 
              onClick={onLogout}
              className="p-3.5 rounded-full text-[#86868b] hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Mobile Secondary Menu */}
      <AnimatePresence>
        {isMobile && showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl p-10 flex flex-col justify-end pb-32"
          >
            <div className="space-y-6">
               <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-10">Opciones Maestras</h3>
               <div className="grid grid-cols-2 gap-4">
                  {secondaryItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { onTabChange(item.id); setShowMenu(false); }}
                      className="apple-card flex flex-col items-center gap-4 py-8 border-white/5"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400">
                          <item.icon className="w-6 h-6" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={onLogout}
                    className="apple-card flex flex-col items-center gap-4 py-8 border-red-500/10 bg-red-500/5 col-span-2"
                  >
                     <LogOut className="w-6 h-6 text-red-500" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">Cerrar Sesión Institucional</span>
                  </button>
               </div>
               <Button 
                 onClick={() => setShowMenu(false)}
                 className="w-full h-16 rounded-[2rem] bg-white text-black font-bold uppercase text-xs tracking-widest mt-10"
               >
                 Volver al Control
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Sub-componentes Maestros
const SplashScreen = ({ isInitialized }) => (
  <motion.div 
    key="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center select-none overflow-hidden"
  >
    <div className="relative flex flex-col items-center">
      <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full scale-150 animate-pulse" />
      <img 
        src={logo} 
        alt="Logo Andrés Bello" 
        className="w-28 h-28 rounded-full mb-10 relative z-10 shadow-2xl shadow-blue-500/20 border border-white/10 object-cover" 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center relative z-10"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase leading-none">Andrés Bello</h1>
        <div className="flex items-center justify-center gap-3 mt-4">
           <div className="h-[1px] w-4 bg-white/10" />
           <p className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Apple Glass Edition</p>
           <div className="h-[1px] w-4 bg-white/10" />
        </div>
      </motion.div>

      <div className="mt-12 w-32 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: isInitialized ? "0%" : "100%" }}
          transition={{ 
            duration: isInitialized ? 0.5 : 2.5, 
            repeat: isInitialized ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        />
      </div>
    </div>
  </motion.div>
);

const CriticalErrorScreen = ({ onRetry }) => (
  <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-8">
     <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-8">
        <AlertCircle className="w-10 h-10" />
     </div>
     <h2 className="text-3xl font-bold text-white tracking-tight text-center uppercase mb-4">Error Crítico de Núcleo</h2>
     <p className="text-sm text-[#86868b] font-medium text-center max-w-sm mb-12 leading-relaxed">
        El Nodo Maestro no ha respondido en el intervalo asignado. Verifique su red institucional o el estado del servidor.
     </p>
     <Button 
       onClick={onRetry}
       className="h-14 px-12 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all active:scale-95 shadow-xl"
     >
        REINTENTAR ACCESO
     </Button>
  </div>
);

const AndresBelloSuite = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const getSafeUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(getSafeUser());
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ═══ AI PROPOSALS STATE ═══
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalResponse, setProposalResponse] = useState('');
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalResult, setProposalResult] = useState(null);
  const pollRef = useRef(null);

  // Poll for proposals every 15 seconds
  useEffect(() => {
    if (!token) return;
    const fetchProposals = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/ai/proposals?status=pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProposals(data);
        }
      } catch (e) { /* silent */ }
    };
    fetchProposals();
    pollRef.current = setInterval(fetchProposals, 15000);
    return () => clearInterval(pollRef.current);
  }, [token]);

  const handleProposalDecision = async (proposalId, decision, customMsg) => {
    setProposalLoading(true);
    setProposalResult(null);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/ai/proposals/${proposalId}/respond`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision, customMessage: customMsg })
      });
      const data = await res.json();
      setProposalResult(data);
      // Remove from list
      setProposals(prev => prev.filter(p => p.id !== proposalId));
      // Refresh notifications  
      setTimeout(() => {
        setSelectedProposal(null);
        setProposalResult(null);
        setProposalResponse('');
        fetchData(token);
      }, 2000);
    } catch (e) {
      setProposalResult({ success: false, message: 'Error de conexión' });
    } finally {
      setProposalLoading(false);
    }
  };

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
        fetch(`${baseUrl}/api/personal`, { headers }),
        fetch(`${baseUrl}/api/asistencia/stats`, { headers })
      ]);

      const [resStd, resAi, resJust, resStaff, resAtt] = responses.map(r => r.status === 'fulfilled' ? r.value : null);
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
        attendance: '0',
        risks: (ai.alerts && Array.isArray(ai.alerts)) ? ai.alerts.filter(a => a.type === 'danger' || a.type === 'warning').length : 0,
        justifications: Array.isArray(justs) ? justs.filter(j => j.estado === 'pendiente').length : 0,
        staffCount: Array.isArray(staffArr) ? staffArr.length : 0,
        recentActivity: Array.isArray(justs) ? justs.slice(0, 3).map(j => ({
          time: j.fecha,
          event: `Justificativo ${j.estado}: ${j.nombre}`
        })) : []
      });
      setAiData(ai);
      
      if (resAtt && resAtt.ok) {
        const attData = await resAtt.json();
        setStats(prev => ({ 
          ...prev, 
          attendance: attData.stats?.globalAttendance || '0%' 
        }));
      }

      // Fetch Dashboard Activity
      const resActivity = await fetch(`${baseUrl}/api/dashboard/activity`, { headers });
      if (resActivity.ok) {
        const actData = await resActivity.json();
        setStats(prev => ({ ...prev, recentActivity: actData }));
      }
      
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
    if (token) {
      fetchData(token);
      
      const handleRefresh = () => {
        console.log("Evento refresh-dashboard detectado. Sincronizando datos...");
        fetchData(token);
      };
      
      window.addEventListener('refresh-dashboard', handleRefresh);
      return () => window.removeEventListener('refresh-dashboard', handleRefresh);
    }
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

  if (window.location.search.includes('portal=representative')) {
    return <RepresentativeView />;
  }

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
                className="h-20 md:h-24 apple-glass border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[80]"
              >
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                     <img src={logo} className="w-9 h-9 md:w-11 md:h-11 rounded-full shadow-lg border border-white/10 group-hover:scale-105 transition-transform object-cover" alt="Logo" />
                     <div className="flex flex-col">
                        <h2 className="text-xs md:text-sm font-bold tracking-tight text-white leading-none uppercase">Andrés Bello</h2>
                        <span className="hidden md:inline text-[9px] font-bold tracking-[0.1em] text-[#86868b] uppercase mt-1">Platinum Edition</span>
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

                <div className="flex items-center gap-3 md:gap-6">
                   <div className="relative">
                      <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2.5 rounded-full hover:bg-white/5 transition-all ${isNotifOpen ? 'bg-white/10 text-white' : 'text-[#86868b]'}`}
                      >
                         <Bell className="w-5 h-5" />
                         {(notifications.length > 0 || proposals.length > 0) && (
                            <div className="absolute top-1 right-1 flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-[7px] font-black text-white">{proposals.length + notifications.length}</span>
                              </div>
                            </div>
                         )}
                      </button>
                      
                      <AnimatePresence>
                        {isNotifOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-96 apple-glass border border-white/10 rounded-[1.75rem] shadow-2xl p-6 z-[100]"
                          >
                             <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Centro de Comandos</h4>
                                <div className="flex gap-2">
                                  {proposals.length > 0 && (
                                    <Badge className="bg-blue-600 text-white border-none px-2.5 py-0.5 text-[8px] font-black animate-pulse">
                                      {proposals.length} IA
                                    </Badge>
                                  )}
                                  <Badge className="bg-white/10 text-white/60 border-none px-2 py-0.5 text-[8px]">{notifications.length}</Badge>
                                </div>
                             </div>
                             <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                                {/* AI Proposals - Priority */}
                                {proposals.map(p => (
                                  <div 
                                    key={`prop-${p.id}`}
                                    onClick={() => {
                                      setSelectedProposal(p);
                                      setIsNotifOpen(false);
                                    }}
                                    className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all cursor-pointer group"
                                  >
                                     <div className="flex items-center gap-3 mb-2">
                                        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                                          <Bot className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">PROPUESTA IA</span>
                                        <span className="text-[8px] text-blue-400/50 font-bold ml-auto">{p.type}</span>
                                     </div>
                                     <h5 className="text-xs font-bold text-white mb-1">{p.title}</h5>
                                     <p className="text-[10px] text-blue-300/60 leading-tight">{(p.description || '').slice(0, 80)}...</p>
                                     <div className="flex items-center gap-2 mt-3">
                                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-wider">Click para revisar →</span>
                                     </div>
                                  </div>
                                ))}

                                {proposals.length > 0 && notifications.length > 0 && (
                                  <div className="border-t border-white/5 my-2" />
                                )}

                                {/* Regular notifications */}
                                {notifications.filter(n => n.type !== 'ai_proposal').map(n => (
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
                   <div className="h-6 md:h-8 w-[1px] bg-white/10" />
                   <div className="flex items-center gap-2 md:gap-4 group cursor-pointer pr-1 md:pr-2">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[11px] font-bold text-white uppercase">{user?.username || 'Admin'}</span>
                        <span className="text-[9px] font-medium text-blue-500 tracking-widest uppercase mt-0.5">Control Maestro</span>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs md:text-sm">
                        {user?.username?.substring(0, 1).toUpperCase() || 'A'}
                      </div>
                   </div>
                </div>
              </motion.header>
            )}
          </AnimatePresence>

          <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-14 pb-32 md:pb-14">
            <ErrorBoundary key={activeTab} resetKey={activeTab}>
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
                  {(activeTab === 'finance' && user?.role === 'admin') && <Finance />}
                  {(activeTab === 'vision' && user?.role === 'admin') && <VisionAttendance onComplete={() => setActiveTab('attendance')} />}
                  {(activeTab === 'lapses' && user?.role === 'admin') && <LapseControl />}
                  {(activeTab === 'staff' && user?.role === 'admin') && <Staff />}
                  {(activeTab === 'settings' && user?.role === 'admin') && <InstitutionalSettings />}
                  {activeTab === 'aianalytics' && <IAAnalytics />}
                  
                  {/* Fallback for unauthorized or missing content */}
                  {(['finance', 'vision', 'lapses', 'staff', 'settings'].includes(activeTab) && user?.role !== 'admin') && (
                    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest italic">Acceso de Seguridad Nivel 2</h2>
                        <p className="text-sm text-[#86868b] font-medium max-w-sm mx-auto">Esta sección requiere credenciales de Administrador Maestro. Su intento ha sido registrado.</p>
                      </div>
                      <Button onClick={() => setActiveTab('dashboard')} variant="ghost" className="text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                        Volver al Inicio Segura →
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>

          <AnimatePresence>
            {activeTab === 'aichat' && (
              <motion.div
                key="aichat-immersive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-black overflow-hidden"
              >
                <AIChatView searchTerm={searchTerm} user={user} onClose={() => setActiveTab('dashboard')} onRefresh={() => fetchData(token)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ AI PROPOSAL MODAL ═══ */}
          <AnimatePresence>
            {selectedProposal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                onClick={() => { if (!proposalLoading) { setSelectedProposal(null); setProposalResult(null); setProposalResponse(''); }}}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-lg apple-glass border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-600/30">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Propuesta del Núcleo IA</h3>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{selectedProposal.type}</span>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedProposal(null); setProposalResult(null); }} className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white leading-snug">{selectedProposal.title}</h4>
                    <p className="text-sm text-[#86868b] leading-relaxed">{selectedProposal.description}</p>
                    
                    {selectedProposal.ai_reasoning && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-3 h-3 text-blue-400" />
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Razonamiento IA</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{(selectedProposal.ai_reasoning || '').slice(0, 300)}</p>
                      </div>
                    )}

                    {selectedProposal.payload && Object.keys(selectedProposal.payload).length > 0 && (
                      <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Datos de la acción</span>
                        <div className="mt-2 space-y-1">
                          {Object.entries(selectedProposal.payload).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-xs">
                              <span className="text-white/40 font-medium">{k}:</span>
                              <span className="text-white/80 font-semibold">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Result Banner */}
                  {proposalResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl flex items-center gap-3 ${proposalResult.success ? 'bg-emerald-600/10 border border-emerald-500/20' : 'bg-red-600/10 border border-red-500/20'}`}
                    >
                      {proposalResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <span className={`text-sm font-semibold ${proposalResult.success ? 'text-emerald-300' : 'text-red-300'}`}>{proposalResult.message}</span>
                    </motion.div>
                  )}

                  {/* Actions */}
                  {!proposalResult && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleProposalDecision(selectedProposal.id, 'approved')}
                          disabled={proposalLoading}
                          className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs tracking-wider shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {proposalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                          APROBAR Y EJECUTAR
                        </Button>
                        <Button
                          onClick={() => handleProposalDecision(selectedProposal.id, 'rejected')}
                          disabled={proposalLoading}
                          variant="ghost"
                          className="h-14 px-6 text-red-400 hover:bg-red-400/10 rounded-2xl font-bold text-xs tracking-wider disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          RECHAZAR
                        </Button>
                      </div>

                      {/* Custom response */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={proposalResponse}
                          onChange={e => setProposalResponse(e.target.value)}
                          placeholder="Respuesta personalizada..."
                          className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50 font-medium"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && proposalResponse.trim()) {
                              handleProposalDecision(selectedProposal.id, 'custom', proposalResponse);
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (proposalResponse.trim()) {
                              handleProposalDecision(selectedProposal.id, 'custom', proposalResponse);
                            }
                          }}
                          disabled={!proposalResponse.trim() || proposalLoading}
                          className="h-12 w-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-0 flex items-center justify-center disabled:opacity-30"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[9px] text-white/20 text-center font-medium tracking-wider uppercase">Escribe una respuesta personalizada o usa los botones de arriba</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  className="fixed bottom-28 md:bottom-24 right-6 md:right-10 w-14 h-14 md:w-16 md:h-16 apple-glass rounded-3xl flex items-center justify-center z-[90] group shadow-2xl transition-all text-blue-400"
                >
                   <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                   {!isMobile && (
                     <div className="absolute -top-12 right-0 apple-glass px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
                       <span className="text-[11px] whitespace-nowrap font-semibold text-white/90">Asistente IA</span>
                     </div>
                   )}
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
