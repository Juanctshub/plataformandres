import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarRange, 
  Clock, 
  User, 
  BookOpen, 
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";

const Schedules = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const [activeDay, setActiveDay] = useState('Lunes');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newSession, setNewSession] = useState({ seccion: '', dia: 'Lunes', materia: '', bloque: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/horarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSessions(data);
        } catch (e) {
            console.error('Error fetching schedules:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/horarios`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newSession)
            });
            if (res.ok) {
                setMsg({ text: 'Sesión programada correctamente', type: 'success' });
                setIsAddModalOpen(false);
                setNewSession({ seccion: '', dia: activeDay, materia: '', bloque: '' });
                fetchSchedules();
            }
        } catch (e) {
            setMsg({ text: 'Error al programar sesión', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        }
    };

    const filteredSessions = sessions.filter(s => s.dia === activeDay);

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Cronograma Académico</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Planificación semanal de bloques de instrucción institucional.</p>
                </div>
                
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
                            <Plus className="w-5 h-5" />
                            Nueva Sesión
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black/90 backdrop-blur-3xl border-white/10 text-white rounded-[2.5rem] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-semibold tracking-tight text-white">Programar Clase</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">Asignación de bloque horario y materia.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Día</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                                        value={newSession.dia}
                                        onChange={(e) => setNewSession({...newSession, dia: e.target.value})}
                                    >
                                        {days.map(d => <option key={d} value={d} className="bg-black">{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Sección</label>
                                    <Input 
                                        placeholder="Ej: 4to Año B"
                                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                        value={newSession.seccion}
                                        onChange={(e) => setNewSession({...newSession, seccion: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Materia</label>
                                <Input 
                                    placeholder="Ej: Física Cuántica"
                                    className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                    value={newSession.materia}
                                    onChange={(e) => setNewSession({...newSession, materia: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Bloque Horario</label>
                                <Input 
                                    placeholder="Ej: 08:00 AM - 09:30 AM"
                                    className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                    value={newSession.bloque}
                                    onChange={(e) => setNewSession({...newSession, bloque: e.target.value})}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold mt-4 transition-all active:scale-95 text-lg"
                            >
                                {submitting ? "Publicando..." : "Registrar en Cronograma"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-3xl border border-white/[0.03] rounded-[2.5rem] p-1.5 flex gap-2 mb-10 group overflow-x-auto shadow-2xl">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 min-w-[120px] px-6 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${
                            activeDay === day 
                                ? 'bg-white text-black shadow-xl' 
                                : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredSessions.length > 0 ? filteredSessions.map((s, i) => (
                        <motion.div 
                            key={s.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="apple-card p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 group transition-all duration-700 bg-zinc-900/40 border-white/[0.05] hover:bg-zinc-800/40"
                        >
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col gap-1 w-40">
                                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-none">Bloque Horario</span>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm mt-1">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        {s.bloque}
                                    </div>
                                </div>
                                
                                <div className="h-10 w-[1px] bg-white/5 hidden md:block" />

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-semibold text-white/90 uppercase italic tracking-tight group-hover:text-apple-gradient transition-all duration-700 leading-tight">
                                        {s.materia}
                                    </h3>
                                    <div className="flex items-center gap-6 mt-1">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                            <BookOpen className="w-3.5 h-3.5 text-zinc-700" />
                                            Núcleo Académico
                                        </div>
                                        <Badge className="bg-blue-500/10 text-blue-400 border-none rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest">
                                            {s.seccion}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Sincronizado</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">Activo</span>
                                </div>
                                <Button variant="ghost" className="text-zinc-500 hover:text-white group-hover:translate-x-1 transition-all p-3 rounded-2xl hover:bg-white/5">
                                    <ChevronRight className="w-6 h-6" strokeWidth={1} />
                                </Button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-32 text-zinc-800 space-y-4 opacity-30 select-none">
                            <CalendarRange className="w-16 h-16" strokeWidth={1} />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">
                                {loading ? "Sincronizando cronograma..." : `No hay clases programadas para el ${activeDay}`}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toasts / Feedback */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-6 rounded-[2rem] flex items-center gap-4 text-sm font-bold uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                                msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                        >
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {msg.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Schedules;
