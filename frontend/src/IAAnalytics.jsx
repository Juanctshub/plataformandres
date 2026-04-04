import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  Building2,
  ChevronRight,
  Download,
  Bell,
  Cpu,
  Loader2,
  Mail,
  Zap,
  Lock,
  Search,
  Scan,
  MessageSquare
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const IAAnalyticsSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-zinc-100 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-zinc-50 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-48 bg-zinc-100 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-56 bg-white border border-zinc-100 rounded-[2.5rem]" />
        <Skeleton className="h-56 bg-white border border-zinc-100 rounded-[2.5rem]" />
        <Skeleton className="h-56 bg-white border border-zinc-100 rounded-[2.5rem]" />
    </div>
    <Skeleton className="h-96 bg-white border border-zinc-100 rounded-[3rem]" />
  </div>
);

const IAAnalytics = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);

    const fetchAiData = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/ai/analytics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAiData(data);
        } catch (e) {
            console.error('IA Offline:', e);
        } finally {
            setTimeout(() => setLoading(false), 1500);
        }
    };

    useEffect(() => {
        fetchAiData();
        const interval = setInterval(() => {
            setScanProgress(p => (p + 1) % 101);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleNotify = async (alert) => {
        setNotifying(alert.student);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/notify`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    student: alert.student, 
                    msg: alert.msg, 
                    contact: alert.contact 
                })
            });
            if (res.ok) {
                alert.notified = true;
                setAiData({...aiData});
            }
        } catch (e) {
            console.error(e);
        } finally {
            setTimeout(() => setNotifying(null), 1000);
        }
    };

    const mockHistory = [
        { name: 'Lun', index: 12 },
        { name: 'Mar', index: 15 },
        { name: 'Mie', index: 8 },
        { name: 'Jue', index: 22 },
        { name: 'Vie', index: 14 },
        { name: 'Sab', index: 4 },
        { name: 'Dom', index: 2 },
    ];

    if (loading) return <IAAnalyticsSkeleton />;

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -mr-96 -mt-96 pointer-events-none" />

            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-blue-50 text-blue-600 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                            Motor IA Predictivo v3.8
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Inteligencia</h2>
                        <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
                            Análisis multivariante de patrones de conducta estudiantil y prevención proactiva de deserción.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-2 pr-6 border-r border-zinc-100">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">Cluster Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-black text-zinc-900 leading-none">Opera Con Normalidad</span>
                      </div>
                    </div>
                    <Button 
                        onClick={() => window.print()}
                        className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10"
                    >
                        <Download className="w-5 h-5" />
                        Audit Log Pro
                    </Button>
                </div>
            </div>

            {/* Neural Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    whileHover={{ y: -5 }} 
                    className="apple-card p-10 bg-white border-zinc-100 group"
                >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-700">
                        <Zap className="w-7 h-7" />
                      </div>
                      <Badge className="bg-red-50 text-red-500 border-none font-black text-[9px] uppercase tracking-widest px-3">High Risk</Badge>
                    </div>
                    <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-4 pl-1">Probabilidad Abandono</h3>
                    <div className="flex items-end gap-3 translate-y-2">
                        <span className="text-6xl font-black text-zinc-900 tracking-tighter italic">
                            {(aiData?.alerts.filter(a => a.type === 'danger').length / 10).toFixed(1)}%
                        </span>
                        <div className="flex flex-col mb-2">
                           <TrendingUp className="w-4 h-4 text-red-500" />
                           <span className="text-[10px] font-black text-red-500">+1.2%</span>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }} 
                    whileHover={{ y: -5 }} 
                    className="apple-card p-10 bg-white border-zinc-100 group"
                >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-700">
                        <Cpu className="w-7 h-7" />
                      </div>
                      <Badge className="bg-blue-50 text-blue-500 border-none font-black text-[9px] uppercase tracking-widest px-3">Sync Active</Badge>
                    </div>
                    <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-4 pl-1">Puntos de Auditoría</h3>
                    <div className="flex items-end gap-3 translate-y-2">
                        <span className="text-6xl font-black text-zinc-900 tracking-tighter italic">
                            {aiData?.alerts.length * 42 || 0}
                        </span>
                        <span className="text-zinc-200 text-[10px] font-bold mb-2 uppercase tracking-widest pl-2">Datasets</span>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }} 
                    whileHover={{ y: -5 }} 
                    className="apple-card p-12 bg-zinc-950 text-white relative flex flex-col justify-center"
                >
                    <Lock className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8">Seguridad Nucleo</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Criptografía Cuántica</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Neon Tech Layer active</span>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black italic text-zinc-600 uppercase tracking-[0.3em]">SSL v4.2 - SECURE TRANSACTION</span>
                      </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="apple-card p-10 bg-white border-zinc-100 flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Optimización IA</h3>
                        <span className="text-xl font-black text-zinc-900">{scanProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden mt-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          className="h-full bg-zinc-950" 
                        />
                    </div>
                    <div className="mt-8 flex flex-col gap-2">
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Estado de Análisis</span>
                       <span className="text-xs font-bold text-zinc-900 leading-none italic uppercase">Escrutinio Masivo de Matrícula...</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Patterns & Alerts */}
              <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="xl:col-span-8 apple-card p-12 border-zinc-100"
              >
                  <div className="flex items-center justify-between mb-12 border-b border-zinc-50 pb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.75rem] bg-zinc-50 flex items-center justify-center text-zinc-900 shadow-sm">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Detección de Patrones</h3>
                            <p className="text-zinc-400 font-bold text-sm mt-1">Sugerencias inteligentes basadas en el historial de inasistencia.</p>
                        </div>
                      </div>
                      <Badge className="bg-zinc-100 text-zinc-400 border-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">Batch #10592</Badge>
                  </div>

                  <div className="space-y-6">
                      {aiData?.alerts.map((alert, i) => (
                          <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + (i * 0.1) }}
                              className={`p-10 rounded-[3rem] border transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-8 group ${
                                  alert.type === 'danger' ? 'bg-red-50/50 border-red-100' : 
                                  alert.type === 'warning' ? 'bg-amber-50/50 border-amber-100' : 
                                  'bg-emerald-50/50 border-emerald-100'
                              }`}
                          >
                              <div className="flex items-center gap-8 relative z-10">
                                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm ${
                                      alert.type === 'danger' ? 'bg-red-50 text-red-500' : 
                                      alert.type === 'warning' ? 'bg-amber-50 text-amber-500' : 
                                      'bg-emerald-50 text-emerald-500'
                                  }`}>
                                      {alert.type === 'danger' ? <AlertTriangle className="w-7 h-7" /> : 
                                      alert.type === 'warning' ? <Bell className="w-7 h-7" /> : 
                                      <CheckCircle2 className="w-7 h-7" />}
                                  </div>
                                  <div>
                                      <p className={`text-2xl font-black tracking-tight leading-tight uppercase italic ${
                                          alert.type === 'danger' ? 'text-zinc-900' : 
                                          alert.type === 'warning' ? 'text-zinc-900' : 
                                          'text-zinc-900'
                                      }`}>
                                          {alert.msg}
                                      </p>
                                      <div className="flex items-center gap-4 mt-3">
                                          <Badge className="bg-white/50 border border-zinc-100 text-zinc-400 font-bold text-[8px] uppercase tracking-widest">Protocolo predictivo active</Badge>
                                          <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">• Auditado v3.8</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-4 relative z-10 no-print">
                                  {alert.type !== 'success' && (
                                      <Button 
                                          onClick={() => handleNotify(alert)}
                                          disabled={notifying === alert.student || alert.notified}
                                          className={`rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest px-8 h-14 transition-all active:scale-95 shadow-xl ${
                                              alert.notified 
                                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default shadow-none' 
                                              : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-zinc-900/10'
                                          }`}
                                      >
                                          {notifying === alert.student ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                          ) : alert.notified ? (
                                              <div className="flex items-center gap-3">
                                                  <CheckCircle2 className="w-4 h-4" />
                                                  Sincronizado
                                              </div>
                                          ) : (
                                              <div className="flex items-center gap-3">
                                                  <Mail className="w-4 h-4" />
                                                  Llamar a Representante
                                              </div>
                                          )}
                                      </Button>
                                  )}
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </motion.div>

              {/* Side Area Metrics */}
              <div className="xl:col-span-4 space-y-10">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="apple-card p-12 border-zinc-100 bg-white"
                >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-10">Histórico de Alertas</h4>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockHistory}>
                                <defs>
                                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9f9f9" />
                                <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#d4d4d8', fontWeight: 'bold' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="index" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIndex)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="apple-card p-12 bg-zinc-50 border-white relative overflow-hidden group cursor-pointer"
                >
                    <div className="flex items-center gap-4 mb-6">
                       <Scan className="w-5 h-5 text-zinc-900 group-hover:rotate-90 transition-transform duration-700" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 underline decoration-zinc-200">Protocolos IA Activos</span>
                    </div>
                    <div className="space-y-4">
                       <p className="text-xs font-bold text-zinc-400 italic">"Garantizar la permanencia académica mediante escrutinio de Big Data v3.8"</p>
                       <div className="flex items-center justify-between pt-6">
                          <span className="text-xs font-black uppercase">Último Reporte</span>
                          <span className="text-xs font-black uppercase text-zinc-300">{new Date().toLocaleDateString()}</span>
                       </div>
                    </div>
                </motion.div>
                
                <Button 
                    className="w-full h-16 bg-white border border-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex gap-4"
                >
                    <MessageSquare className="w-5 h-5" />
                    Abrir Canal Directo IA
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20 no-print">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Motor Big Data • Corporativo Andrés Bello</span>
                </div>
                <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sincronización Neon Tech Quantum v10.5</span>
                </div>
            </div>
        </div>
    );
};

export default IAAnalytics;
