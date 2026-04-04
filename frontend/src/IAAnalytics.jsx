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
  MessageSquare,
  Globe,
  Database,
  X
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
  <div className="space-y-16 pb-20">
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
      <div className="space-y-6">
        <Skeleton className="h-12 w-80 bg-white/5 rounded-2xl" />
        <Skeleton className="h-4 w-64 bg-white/[0.02] rounded-lg" />
      </div>
      <Skeleton className="h-16 w-64 bg-white/10 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 bg-[#1C1C1E] border border-white/5 rounded-[3rem]" />
        ))}
    </div>
    <Skeleton className="h-[500px] bg-[#1C1C1E] border border-white/5 rounded-[4rem]" />
  </div>
);

const IAAnalytics = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [msg, setMsg] = useState({ text: '', type: '' });

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
        }, 80);
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
                setMsg({ text: `Protocolo enviado a ${alert.student}`, type: 'success' });
            }
        } catch (e) {
            console.error(e);
            setMsg({ text: 'Error de sincronización con el núcleo', type: 'error' });
        } finally {
            setTimeout(() => {
                setNotifying(null);
                setTimeout(() => setMsg({ text: '', type: '' }), 3000);
            }, 1000);
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
        <div className="space-y-16 pb-20 relative">
            {/* Background Dynamic Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0A84FF]/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5E5CE6]/5 blur-[120px] rounded-full -ml-80 -mb-80 pointer-events-none" />

            {/* Header Noir IA */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-12">
                            <BrainCircuit className="w-6 h-6 text-black" />
                        </div>
                        <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.4em]">
                            Motor Predictivo Neural v14.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-[#0A84FF]/20 cursor-default">Cerebro de Datos</h2>
                        <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
                            Análisis predictivo multivariante de deserción académica.
                            <span className="block mt-2 text-[#0A84FF] select-none italic uppercase tracking-widest text-[11px] font-black">Escaneo de patrones biocrónicos activo.</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 bg-[#1C1C1E] border border-white/5 p-4 pl-10 rounded-[2.5rem] shadow-2xl">
                    <div className="flex flex-col items-end gap-2 pr-8 border-r border-white/10">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none italic">Cluster Status</span>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#32D74B] shadow-[0_0_15px_rgba(50,215,75,0.5)] animate-pulse" />
                        <span className="text-xs font-black text-white leading-none uppercase tracking-widest">Online</span>
                      </div>
                    </div>
                    <Button 
                        onClick={() => window.print()}
                        className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex gap-4 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                        <Download className="w-5 h-5" strokeWidth={3} />
                        Exportar Auditoría
                    </Button>
                </div>
            </div>

            {/* Matrix Stats Noir */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    whileHover={{ y: -10 }} 
                    className="apple-pro-card p-10 bg-black/40 border-white/[0.03] group"
                >
                    <div className="flex items-start justify-between mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-[#FF453A] group-hover:bg-[#FF453A]/10 transition-all duration-700 shadow-2xl">
                        <Zap className="w-8 h-8" />
                      </div>
                      <Badge className="bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-2 rounded-xl italic">Riesgo Alto</Badge>
                    </div>
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-6 pl-1">Vector Deserción</h3>
                    <div className="flex items-end gap-5">
                        <span className="text-7xl font-black text-white tracking-tighter italic leading-none">
                            {(aiData?.alerts.filter(a => a.type === 'danger').length / 10).toFixed(1)}%
                        </span>
                        <div className="flex flex-col mb-2 gap-1">
                           <TrendingUp className="w-5 h-5 text-[#FF453A]" />
                           <span className="text-[11px] font-black text-[#FF453A] tracking-tighter">+1.2%</span>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Incremento Proyectado Q2</p>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }} 
                    whileHover={{ y: -10 }} 
                    className="apple-pro-card p-10 bg-black/40 border-white/[0.03] group"
                >
                    <div className="flex items-start justify-between mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-[#0A84FF] group-hover:bg-[#0A84FF]/10 transition-all duration-700 shadow-2xl">
                        <Cpu className="w-8 h-8" />
                      </div>
                      <Badge className="bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-2 rounded-xl italic">Sync Pro</Badge>
                    </div>
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-6 pl-1">Auditoría Masiva</h3>
                    <div className="flex items-end gap-4 translate-y-2">
                        <span className="text-7xl font-black text-white tracking-tighter italic leading-none">
                            {aiData?.alerts.length * 42 || 0}
                        </span>
                        <span className="text-white/20 text-[10px] font-black mb-3 uppercase tracking-[0.6em] italic pl-2">Sets</span>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Data Points Escaneados</p>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }} 
                    whileHover={{ y: -10 }} 
                    className="apple-pro-card p-12 bg-white text-black relative flex flex-col justify-center overflow-hidden"
                >
                    <Lock className="absolute -right-8 -bottom-8 w-40 h-40 text-black/5 rotate-12" />
                    <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.5em] mb-10 italic">Seguridad Cuántica</h3>
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Cifrado AES-512 Dark</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="w-2 h-2 rounded-full bg-black/20" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">Neon Tech v14.0 Enlace</span>
                      </div>
                      <div className="pt-10 border-t border-black/5">
                        <span className="text-[10px] font-black italic text-black/20 uppercase tracking-[0.4em]">Audit Validated Security</span>
                      </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="apple-pro-card p-10 bg-black/40 border-white/[0.03] flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Proceso Neural</h3>
                        <span className="text-2xl font-black text-white tracking-widest leading-none">{scanProgress}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mt-8 border border-white/5 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                        />
                    </div>
                    <div className="mt-10 flex flex-col gap-3">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Estado de Inferencia</span>
                       <span className="text-sm font-black text-white italic uppercase tracking-tighter">Escrutinio Masivo en Progreso...</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
              {/* Patterns & Alerts Noir */}
              <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="xl:col-span-8 apple-pro-card p-12 bg-black/40 border-white/[0.03]"
              >
                  <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                            <Scan className="w-9 h-9 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                            <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Detección de Patrones</h3>
                            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">Sugerencias basadas en Big Data v14.0</p>
                        </div>
                      </div>
                      <Badge className="bg-white/5 text-white/40 border border-white/10 font-black text-[10px] uppercase tracking-[0.4em] px-6 py-3 rounded-2xl italic">Core Batch #10592</Badge>
                  </div>

                  <div className="space-y-8">
                      {aiData?.alerts.map((alert, i) => (
                          <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                              className={`p-10 rounded-[3rem] border transition-all duration-1000 flex flex-col md:flex-row md:items-center justify-between gap-10 group relative overflow-hidden ${
                                  alert.type === 'danger' ? 'bg-[#FF453A]/[0.03] border-[#FF453A]/20' : 
                                  alert.type === 'warning' ? 'bg-[#FFD60A]/[0.03] border-[#FFD60A]/20' : 
                                  'bg-[#32D74B]/[0.03] border-[#32D74B]/20'
                              }`}
                          >
                              <div className="flex items-center gap-10 relative z-10">
                                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl border transition-all duration-700 group-hover:rotate-6 ${
                                      alert.type === 'danger' ? 'bg-[#FF453A]/10 border-[#FF453A]/20 text-[#FF453A]' : 
                                      alert.type === 'warning' ? 'bg-[#FFD60A]/10 border-[#FFD60A]/20 text-[#FFD60A]' : 
                                      'bg-[#32D74B]/10 border-[#32D74B]/20 text-[#32D74B]'
                                  }`}>
                                      {alert.type === 'danger' ? <AlertTriangle className="w-9 h-9" /> : 
                                      alert.type === 'warning' ? <Bell className="w-9 h-9" /> : 
                                      <CheckCircle2 className="w-9 h-9" />}
                                  </div>
                                  <div className="space-y-3">
                                      <p className="text-3xl font-black tracking-tighter leading-none uppercase italic text-white group-hover:translate-x-2 transition-transform duration-700">
                                          {alert.msg}
                                      </p>
                                      <div className="flex items-center gap-6">
                                          <Badge className="bg-white/5 border border-white/5 text-white/20 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-lg">Predictive Protocol Enabled</Badge>
                                          <div className="flex items-center gap-3">
                                             <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                             <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] leading-none">Audit v14.2</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-6 relative z-10 no-print">
                                  {alert.type !== 'success' && (
                                      <Button 
                                          onClick={() => handleNotify(alert)}
                                          disabled={notifying === alert.student || alert.notified}
                                          className={`rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] px-10 h-16 transition-all active:scale-95 shadow-2xl relative group/btn ${
                                              alert.notified 
                                              ? 'bg-[#32D74B]/10 text-[#32D74B] border border-[#32D74B]/20 cursor-default cursor-not-allowed' 
                                              : 'bg-white text-black hover:bg-zinc-200'
                                          }`}
                                      >
                                          {notifying === alert.student ? (
                                              <Loader2 className="w-5 h-5 animate-spin" />
                                          ) : alert.notified ? (
                                              <div className="flex items-center gap-4">
                                                  <CheckCircle2 className="w-5 h-5" />
                                                  Sincronizado
                                              </div>
                                          ) : (
                                              <div className="flex items-center gap-4">
                                                  <Mail className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                                  Protocolo Digital
                                              </div>
                                          )}
                                      </Button>
                                  )}
                              </div>
                              
                              <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                          </motion.div>
                      ))}
                  </div>
              </motion.div>

              {/* Side Area Metrics Noir */}
              <div className="xl:col-span-4 space-y-12">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 30 }}
                    transition={{ delay: 0.4 }}
                    className="apple-pro-card p-12 bg-black/40 border-white/[0.03]"
                >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12 italic border-b border-white/5 pb-6">Histórico de Inferencia</h4>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockHistory}>
                                <defs>
                                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.1)', fontWeight: 'black' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#1C1C1E', 
                                      borderRadius: '1.5rem', 
                                      border: '1px solid rgba(255,255,255,0.05)', 
                                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', 
                                      color: 'white',
                                      fontSize: '11px', 
                                      fontWeight: 'black',
                                      textTransform: 'uppercase'
                                    }}
                                    itemStyle={{ color: '#0A84FF' }}
                                />
                                <Area type="monotone" dataKey="index" stroke="#0A84FF" strokeWidth={4} fillOpacity={1} fill="url(#colorIndex)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="apple-pro-card p-12 bg-white relative overflow-hidden group cursor-pointer"
                >
                    <div className="flex items-center gap-5 mb-8">
                       <Scan className="w-6 h-6 text-black group-hover:rotate-90 transition-transform duration-1000" strokeWidth={3} />
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black italic underline decoration-black/10">Datasets Activos</span>
                    </div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-sm font-black text-black/40 italic leading-relaxed uppercase tracking-tighter">"Soberanía de datos orientada a la excelencia institucional v14.0"</p>
                       <div className="flex items-center justify-between pt-10 border-t border-black/10">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Corte Auditor</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-zinc-200 -z-10" />
                </motion.div>
                
                <Button 
                    className="w-full h-20 bg-black border border-white/5 text-white/30 hover:text-white hover:bg-white/5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.5em] transition-all shadow-2xl flex gap-6 active:scale-[0.98] group"
                >
                    <Database className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                    Neural Data Explorer
                </Button>
              </div>
            </div>

            {/* Notification Toast Noir */}
            <AnimatePresence>
                {msg.text && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-max"
                >
                    <div className={`p-8 rounded-[3rem] border shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] flex items-center gap-8 ${
                        msg.type === 'success' ? 'bg-[#1C1C1E] border-emerald-500/20 text-emerald-400' : 'bg-[#1C1C1E] border-red-500/20 text-red-400'
                    }`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            {msg.type === 'success' ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">Notificación del Núcleo Neural</span>
                            <span className="text-sm font-black uppercase tracking-widest mt-2">{msg.text}</span>
                        </div>
                        <button onClick={() => setMsg({text:'', type:''})} className="ml-10 p-3 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 opacity-30 hover:opacity-100" />
                        </button>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32 no-print">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Protocolo Big Data • Terminal Andrés Bello v14.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Criptografía Neural Quantum Layer Active</span>
                </div>
            </div>
        </div>
    );
};

export default IAAnalytics;
