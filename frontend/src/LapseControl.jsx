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
        <div className="max-w-7xl mx-auto space-y-20 py-10">
            {/* Mission Control Header */}
            <div className="flex flex-col items-center text-center space-y-8 mb-20">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className="p-8 rounded-[3rem] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 relative group"
                >
                    <Calendar className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="space-y-4">
                    <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">Mission Control</h2>
                    <p className="text-[12px] text-blue-400 font-black uppercase tracking-[0.6em] italic">Centro de Sincronización Académica v30.0</p>
                    
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                            <Unlock className="w-4 h-4 text-emerald-400" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Modo Operativo</span>
                                <span className="text-[10px] font-bold text-emerald-400/80 mt-1 uppercase italic">Edición Habilitada</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                            <Lock className="w-4 h-4 text-red-400" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Modo Blindado</span>
                                <span className="text-[10px] font-bold text-red-400/80 mt-1 uppercase italic">Datos Congelados</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual de Operación IA (Clarifies purpose) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Protocolo Maestro</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Fase de Registro', desc: 'Periodo de carga de notas y asistencias.', icon: Plus },
                                { title: 'Consolidación', desc: 'La IA valida promedios y detecta anomalías.', icon: Sparkles },
                                { title: 'Blindaje Total', desc: 'El cierre genera un registro histórico inmutable.', icon: Lock },
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{step.title}</h4>
                                        <p className="text-[10px] text-[#86868b] font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10">
                        <div className="flex items-center gap-4 mb-6">
                            <AlertCircle className="w-6 h-6 text-indigo-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Aviso de Integridad</h4>
                        </div>
                        <p className="text-[11px] text-[#86868b] font-medium leading-relaxed italic">
                            "Al finalizar un ciclo, el sistema genera un sello digital que garantiza que las notas no fueron alteradas tras la evaluación final."
                        </p>
                    </div>
                </div>

                {/* RoadMap Center */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] apple-glass shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <History className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 space-y-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Hoja de Ruta Institucional</h3>
                                    <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] mt-4">Simulación de Progreso Académico 2026</p>
                                </div>
                                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                   <Clock className="w-5 h-5 text-blue-500" />
                                   <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1.5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(periods.filter(p => p.estado === 'cerrado').length / 3) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                                />
                                {/* Glow points */}
                                <div className="absolute inset-0 flex justify-between px-12 items-center pointer-events-none">
                                    <div className="w-2 h-2 bg-white/40 rounded-full shadow-lg" />
                                    <div className="w-2 h-2 bg-white/40 rounded-full shadow-lg" />
                                    <div className="w-2 h-2 bg-white/40 rounded-full shadow-lg" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
                                {['Planificación', 'Evaluación', 'Auditoría Final'].map((step, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                                                (periods.filter(p => p.estado === 'cerrado').length > idx) ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white/5 text-[#86868b]'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{step}</span>
                                        </div>
                                        <p className="text-[9px] text-[#86868b] font-bold leading-relaxed uppercase">
                                            {idx === 0 ? 'Registro de objetivos' : idx === 1 ? 'Carga masiva de notas' : 'Cierre de actas finales'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lapse Mini Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Array.isArray(periods) && periods.map((p, i) => (
                            <motion.div 
                                key={p.lapso}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative group overflow-hidden rounded-[3rem] p-8 border transition-all duration-700 ${
                                    p.estado === 'abierto' 
                                    ? 'bg-blue-600/5 border-blue-500/30 shadow-2xl' 
                                    : 'bg-white/[0.02] border-white/5 opacity-60'
                                }`}
                            >
                                <div className="flex flex-col h-full justify-between gap-10">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className={`p-4 rounded-2xl ${p.estado === 'abierto' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-[#86868b]'}`}>
                                                {p.estado === 'abierto' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            </div>
                                            <Badge className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest ${
                                                p.estado === 'abierto' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/10 text-[#86868b]'
                                            }`}>
                                                {p.estado === 'abierto' ? 'ACTIVO' : 'BLINDADO'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ciclo {p.lapso}</h3>
                                            <p className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.3em] mt-2">Lapso Académico</p>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => togglePeriod(p.lapso, p.estado)}
                                        disabled={updating === p.lapso}
                                        className={`w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl ${
                                            p.estado === 'abierto' 
                                            ? 'bg-white text-black hover:bg-zinc-200' 
                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                        }`}
                                    >
                                        {updating === p.lapso ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                            <span>{p.estado === 'abierto' ? 'Cerrar Ciclo' : 'Habilitar'}</span>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Integrity Protocol Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-12 rounded-[4rem] bg-gradient-to-tr from-blue-600/5 to-transparent border border-blue-500/10 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto backdrop-blur-xl"
            >
                <div className="w-24 h-24 rounded-[2.2rem] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/20 shrink-0">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                    <h4 className="text-lg font-black text-white uppercase tracking-widest italic">Protocolo de Integridad de Datos v30.0</h4>
                    <p className="text-xs text-[#86868b] font-bold leading-relaxed uppercase tracking-wider">
                        El cierre de un lapso congela los registros de asistencia y calificaciones en el NÚCLEO DE DATOS MAESTRO. Cualquier modificación posterior requiere un TOKEN DE AUDITORÍA NIVEL 5 generado por la Dirección.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LapseControl;
