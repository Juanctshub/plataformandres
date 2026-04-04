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
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from "./components/ui/button";
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

const IAAnalytics = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(null);
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
            setTimeout(() => setLoading(false), 1200);
        }
    };

    useEffect(() => {
        fetchAiData();
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
                body: JSON.stringify({ student: alert.student, msg: alert.msg, contact: alert.contact })
            });
            if (res.ok) {
                alert.notified = true;
                setAiData({...aiData});
                setMsg({ text: `Alerta enviada a ${alert.student}`, type: 'success' });
            }
        } catch (e) {
            setMsg({ text: 'Error al conectar con el servidor', type: 'error' });
        } finally {
            setTimeout(() => {
                setNotifying(null);
                setTimeout(() => setMsg({ text: '', type: '' }), 4000);
            }, 800);
        }
    };

    const mockHistory = [
        { name: 'Lun', index: 12 }, { name: 'Mar', index: 15 }, { name: 'Mie', index: 8 },
        { name: 'Jue', index: 22 }, { name: 'Vie', index: 14 }, { name: 'Sab', index: 4 }, { name: 'Dom', index: 2 },
    ];

    if (loading) return (
      <div className="space-y-12">
          <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 apple-glass rounded-[2rem] animate-pulse" />
              <div className="h-80 apple-glass rounded-[2rem] animate-pulse" />
          </div>
      </div>
    );

    return (
        <div className="space-y-12">
            {/* Predictions Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Riesgo Deserción', value: '4.2%', icon: Zap, color: 'text-amber-400', sub: 'Variación -0.8%' },
                  { label: 'Integridad Data', value: '99.9%', icon: ShieldCheck, color: 'text-emerald-400', sub: 'Protocolo AES-256' },
                  { label: 'Patrones IA', value: aiData?.alerts.length || 0, icon: Sparkles, color: 'text-blue-400', sub: 'Alertas Detectadas' },
                  { label: 'Análisis Batch', value: 'Active', icon: Cpu, color: 'text-indigo-400', sub: 'Kernel v15.0' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="apple-card p-6"
                  >
                     <div className="flex items-center gap-4 mb-4">
                        <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}>
                           <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{stat.label}</span>
                     </div>
                     <div className="text-3xl font-semibold text-white tracking-tight">{stat.value}</div>
                     <p className="text-[10px] font-medium text-[#86868b] mt-3 uppercase tracking-wider">{stat.sub}</p>
                  </motion.div>
                ))}
            </div>

            {/* Main Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="lg:col-span-8 apple-card"
               >
                  <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-lg">
                           <Scan className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white tracking-tight">Patrones de Conducta</h3>
                     </div>
                     <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-4 py-1.5 text-[10px] font-semibold">Motor Inferencia v15.0</Badge>
                  </div>

                  <div className="space-y-6">
                     {aiData?.alerts.map((alert, i) => (
                        <div key={i} className={`p-8 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group ${
                           alert.type === 'danger' ? 'bg-red-500/5 border-red-500/10' : 'bg-amber-500/5 border-amber-500/10'
                        }`}>
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-white/5 ${
                                 alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'
                              }`}>
                                 {alert.type === 'danger' ? <AlertTriangle className="w-7 h-7" /> : <Bell className="w-7 h-7" />}
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-lg font-semibold text-white tracking-tight group-hover:translate-x-1 transition-transform">{alert.msg}</h4>
                                 <p className="text-xs text-[#86868b] font-medium italic">Evaluación crítica del núcleo neural</p>
                              </div>
                           </div>
                           <Button 
                              onClick={() => handleNotify(alert)}
                              disabled={notifying === alert.student || alert.notified}
                              className={`h-12 px-8 rounded-full font-bold text-xs transition-all ${
                                 alert.notified ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'
                              }`}
                           >
                              {notifying === alert.student ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                               alert.notified ? 'Notificado' : 'Enviar Alerta'}
                           </Button>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-4 space-y-8"
               >
                  <div className="apple-card p-10">
                     <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Actividad Neural</h4>
                     <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={mockHistory}>
                              <defs>
                                 <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)' }} />
                              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '1rem', border: 'none', color: 'white' }} />
                              <Area type="monotone" dataKey="index" stroke="#007AFF" strokeWidth={3} fill="url(#areaGradient)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="apple-card p-10 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/10">
                     <div className="flex items-center gap-4 mb-6">
                        <Activity className="w-6 h-6 text-blue-400" />
                        <h4 className="text-lg font-semibold text-white tracking-tight">Estado Cluster</h4>
                     </div>
                     <p className="text-xs text-[#86868b] leading-relaxed font-medium">
                        El núcleo de inferencia está procesando 42 sets de datos secundarios. Estabilidad del sistema: 99.98%.
                     </p>
                     <div className="mt-8 flex items-center justify-between opacity-40">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Master Root</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     </div>
                  </div>
               </motion.div>
            </div>

            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-32 right-12 z-[110]"
               >
                  <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl border-white/5">
                     <div className={`p-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Notificación IA</span>
                        <span className="text-sm font-semibold text-white mt-0.5">{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-1.5 hover:bg-white/5 rounded-full transition-colors opacity-30">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default IAAnalytics;
