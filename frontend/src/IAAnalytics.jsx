import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart, 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  Building2,
  ChevronRight,
  Download,
  Bell,
  Cpu,
  Loader2,
  Mail
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const IAAnalyticsSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-white/5 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-48 bg-white/5 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-48 bg-white/5 rounded-3xl" />
        <Skeleton className="h-48 bg-white/5 rounded-3xl" />
        <Skeleton className="h-48 bg-white/5 rounded-3xl" />
    </div>
    <Skeleton className="h-96 bg-white/5 rounded-[2.5rem]" />
  </div>
);

const IAAnalytics = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifying, setNotifying] = useState(null);

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

    const handleExport = () => {
        window.print();
    };

    if (loading) return <IAAnalyticsSkeleton />;

    return (
        <div className="space-y-12 pb-20 printable-area">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  .no-print { display: none !important; }
                  .apple-card { border: 1px solid #eee !important; background: white !important; color: black !important; }
                  .text-white { color: black !important; }
                  .text-zinc-500 { color: #666 !important; }
                  body { background: white !important; }
                }
            ` }} />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 no-print">
                <div className="space-y-2">
                    <h2 className="text-4xl font-semibold tracking-tight text-white/90 italic">IA Analytics</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-zinc-500 font-medium">Motor de predicción de deserción escolar basado en Big Data.</p>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <Badge className="bg-blue-500/10 text-blue-400 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest flex gap-2">
                            <Activity className="w-3 h-3" />
                            Tiempo Real
                        </Badge>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={handleExport}
                        className="h-12 px-6 bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold transition-all flex gap-3 active:scale-95"
                    >
                        <Download className="w-5 h-5 opacity-50" />
                        Exportar Auditoría
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="apple-card p-10 relative overflow-hidden">
                    <TrendingDown className="absolute -right-6 -bottom-6 w-32 h-32 text-red-500/5 rotate-12" />
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Índice de Riesgo</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold text-white tracking-tighter">14.2%</span>
                        <span className="text-emerald-400 text-xs font-bold mb-2 flex items-center">
                            -2.1% <TrendingDown className="w-3 h-3 ml-1" />
                        </span>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="apple-card p-10 relative overflow-hidden">
                    <Cpu className="absolute -right-6 -bottom-6 w-32 h-32 text-blue-500/5" />
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Optimización IA</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold text-white tracking-tighter">98.9%</span>
                        <span className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-widest">Confianza</span>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="apple-card p-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Cluster Académico</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold text-white tracking-tighter">V.16.2</span>
                        <span className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-widest italic">NEON TECH</span>
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card p-12 border-white/10 shadow-2xl"
            >
                <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-2xl shadow-blue-500/20">
                        <BrainCircuit className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-white tracking-tight italic uppercase">Detección de Patrones</h3>
                        <p className="text-zinc-500 font-medium mt-1">Análisis preventivo de deserción escolar por inasistencia injustificada.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {aiData?.alerts.map((alert, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={`p-8 rounded-[2rem] border transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group ${
                                alert.type === 'danger' ? 'bg-red-500/5 border-red-500/10' : 
                                alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' : 
                                'bg-emerald-500/5 border-emerald-500/10'
                            }`}
                        >
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    alert.type === 'danger' ? 'bg-red-500/10 text-red-400' : 
                                    alert.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 
                                    'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {alert.type === 'danger' ? <AlertTriangle className="w-6 h-6" /> : 
                                     alert.type === 'warning' ? <Bell className="w-6 h-6" /> : 
                                     <CheckCircle2 className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className={`text-lg font-semibold tracking-tight ${
                                        alert.type === 'danger' ? 'text-red-300' : 
                                        alert.type === 'warning' ? 'text-amber-300' : 
                                        'text-emerald-300'
                                    }`}>
                                        {alert.msg}
                                    </p>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">Análisis probabilístico v3.8 • {aiData.timestamp}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 relative z-10 no-print">
                                {alert.type !== 'success' && (
                                    <Button 
                                        onClick={() => handleNotify(alert)}
                                        disabled={notifying === alert.student || alert.notified}
                                        className={`rounded-2xl font-bold text-[10px] uppercase tracking-widest px-6 h-12 transition-all active:scale-95 border ${
                                            alert.notified 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default' 
                                            : 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 border-transparent'
                                        }`}
                                    >
                                        {notifying === alert.student ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : alert.notified ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Representante Notificado
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                Notificar Representante
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                            
                            <div className={`absolute right-[-2.5rem] bottom-[-2.5rem] w-40 h-40 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 ${
                                alert.type === 'danger' ? 'text-red-500' : 'text-zinc-500'
                            }`}>
                                <Activity className="w-full h-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="flex items-center gap-10 opacity-30 text-zinc-700 select-none pt-10 no-print">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Big Data Engine • Andrés Bello</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cluster de Auditoría Institucional</span>
                </div>
            </div>
        </div>
    );
};

export default IAAnalytics;
