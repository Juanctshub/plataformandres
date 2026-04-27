import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Clock,
  History
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const LapseControl = () => {
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchPeriods = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/lapsos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPeriods(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error('Error fetching periods:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);

    const togglePeriod = async (lapso, currentStatus) => {
        const newStatus = currentStatus === 'abierto' ? 'cerrado' : 'abierto';
        setUpdating(lapso);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/lapsos/${lapso}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ lapso, estado: newStatus })
            });
            if (res.ok) fetchPeriods();
        } catch (e) { 
            console.error(e); 
        } finally { 
            setUpdating(null); 
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">Sincronizando Ciclos...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-10">
            {/* Institutional Header */}
            <div className="flex flex-col items-center text-center space-y-6 mb-16">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-[2.5rem] bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-2xl shadow-blue-500/10"
                >
                    <Calendar className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Control de Ciclos Académicos</h2>
                    <p className="text-[11px] text-[#86868b] font-black uppercase tracking-[0.4em]">Núcleo de Gestión Institucional v26.6</p>
                </div>
            </div>

            {/* Lapse Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {Array.isArray(periods) && periods.map((p, i) => (
                    <motion.div 
                        key={p.lapso}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative group overflow-hidden rounded-[3.5rem] p-10 border transition-all duration-700 ${
                            p.estado === 'abierto' 
                            ? 'bg-blue-600/5 border-blue-500/30 shadow-[0_40px_80px_-20px_rgba(59,130,246,0.2)]' 
                            : 'bg-white/[0.02] border-white/5 opacity-80'
                        }`}
                    >
                        {/* Status Icon */}
                        <div className="absolute top-10 right-10">
                            <div className={`p-3 rounded-2xl ${p.estado === 'abierto' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-[#86868b]'}`}>
                                {p.estado === 'abierto' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="space-y-4">
                                <Badge className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${
                                    p.estado === 'abierto' ? 'bg-blue-500 text-white' : 'bg-white/10 text-[#86868b]'
                                }`}>
                                    {p.estado === 'abierto' ? 'Ciclo Activo' : 'Ciclo Protegido'}
                                </Badge>
                                <div>
                                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Lapso {p.lapso}</h3>
                                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] mt-2">Sincronización Académica</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#86868b]">Permisos de Edición</span>
                                    <span className={p.estado === 'abierto' ? 'text-emerald-400' : 'text-red-400'}>
                                        {p.estado === 'abierto' ? 'CONCEDIDO' : 'DENEGADO'}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: p.estado === 'abierto' ? '100%' : '0%' }}
                                        className={`h-full ${p.estado === 'abierto' ? 'bg-blue-500' : 'bg-red-500'}`}
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={() => togglePeriod(p.lapso, p.estado)}
                                disabled={updating === p.lapso}
                                className={`w-full h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl ${
                                    p.estado === 'abierto' 
                                    ? 'bg-white text-black hover:bg-zinc-200' 
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {updating === p.lapso ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <span>{p.estado === 'abierto' ? 'Finalizar Ciclo' : 'Habilitar Edición'}</span>
                                )}
                            </Button>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700">
                            <Clock className="w-64 h-64 rotate-12" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Security Protocol Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/10 flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto"
            >
                <div className="w-20 h-20 rounded-[1.8rem] bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-3 text-center md:text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Protocolo de Integridad de Datos</h4>
                    <p className="text-xs text-[#86868b] font-medium leading-relaxed">
                        El cierre de un lapso congela los registros de asistencia y calificaciones en la base de datos maestra. Cualquier modificación posterior requiere una llave de auditoría de Nivel Administrativo.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LapseControl;
