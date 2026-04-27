import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  History,
  CheckCircle2,
  Loader2,
  Clock
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
            const res = await fetch(`${baseUrl}/api/periodos`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setPeriods(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);

    const togglePeriod = async (lapso, currentStatus) => {
        const newStatus = currentStatus === 'abierto' ? 'cerrado' : 'abierto';
        if (!window.confirm(`¿Estás seguro de ${newStatus === 'cerrado' ? 'CERRAR' : 'REABRIR'} el Lapso ${lapso}? ${newStatus === 'cerrado' ? 'Esto bloqueará la edición de notas.' : ''}`)) return;
        
        setUpdating(lapso);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/periodos/toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ lapso, estado: newStatus })
            });
            if (res.ok) fetchPeriods();
        } catch (e) { console.error(e); }
        finally { setUpdating(null); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="p-4 rounded-3xl bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-2xl">
                    <Calendar className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Control de Ciclos Académicos</h2>
                    <p className="text-xs text-[#86868b] font-bold uppercase tracking-[0.3em] mt-2">Gestión de Lapsos y Bloqueo Institucional</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {periods.map((p, i) => (
                    <motion.div 
                        key={p.lapso}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`apple-card p-10 border transition-all duration-500 ${
                            p.estado === 'abierto' ? 'border-emerald-500/10 bg-emerald-500/[0.02]' : 'border-red-500/10 bg-red-500/[0.02]'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl ${
                                    p.estado === 'abierto' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {p.lapso}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-white uppercase italic">Lapso Académico</h3>
                                        <Badge className={`${p.estado === 'abierto' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'} border-none px-3 py-1 text-[8px] font-black uppercase`}>
                                            {p.estado}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-[#86868b] font-medium max-w-sm">
                                        {p.estado === 'abierto' 
                                            ? "El sistema permite la carga de notas y modificaciones por parte de los docentes." 
                                            : `Cerrado el ${new Date(p.fecha_cierre).toLocaleDateString()}. Los datos están protegidos contra edición.`}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => togglePeriod(p.lapso, p.estado)}
                                disabled={updating === p.lapso}
                                className={`h-16 px-10 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 transition-all active:scale-95 ${
                                    p.estado === 'abierto' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                            >
                                {updating === p.lapso ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {p.estado === 'abierto' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                        {p.estado === 'abierto' ? 'Cerrar Lapso' : 'Reabrir Lapso'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/10 flex items-start gap-6">
                <ShieldCheck className="w-10 h-10 text-blue-500 flex-shrink-0" />
                <div className="space-y-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocolo de Seguridad Institucional</h4>
                    <p className="text-xs text-blue-300/60 leading-relaxed">
                        El cierre de un lapso es una acción definitiva que congela el historial académico. Las modificaciones posteriores solo podrán ser realizadas mediante una solicitud de auditoría al Núcleo de Inteligencia Central.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LapseControl;
