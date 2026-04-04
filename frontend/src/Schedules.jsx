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
  AlertCircle,
  Download,
  FileText,
  FileSpreadsheet,
  Layers,
  Search,
  Loader2,
  Printer,
  X,
  Target,
  ShieldCheck,
  Building2,
  Globe
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const SchedulesModule = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const years = ['1ro', '2do', '3ro', '4to', '5to'];
    
    const [activeDay, setActiveDay] = useState('Lunes');
    const [activeYear, setActiveYear] = useState('1ro');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newSession, setNewSession] = useState({ seccion: '1ro A', dia: 'Lunes', materia: '', bloque: '' });
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
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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
                setMsg({ text: 'Cronograma sincronizado con éxito', type: 'success' });
                setIsAddModalOpen(false);
                setNewSession({ seccion: activeYear + ' A', dia: activeDay, materia: '', bloque: '' });
                fetchSchedules();
            }
        } catch (e) {
            setMsg({ text: 'Error de inserción en el núcleo', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const exportToPDF = () => {
        const doc = jsPDF('l');
        doc.setFontSize(20);
        doc.text(`Cronograma Académico - ${activeYear} Año`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Unidad Educativa Andrés Bello • Generado el ${new Date().toLocaleDateString()}`, 14, 28);

        const tableData = days.map(day => {
            const daySessions = sessions
                .filter(s => s.dia === day && s.seccion.includes(activeYear))
                .sort((a,b) => a.bloque.localeCompare(b.bloque));
            
            return [
                day,
                daySessions.map(s => `${s.bloque}: ${s.materia}`).join('\n') || 'Sin actividades'
            ];
        });

        doc.autoTable({
            startY: 40,
            head: [['Día', 'Asignaturas / Bloques']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: '#000000', textColor: '#ffffff' },
            styles: { fontSize: 9, cellPadding: 6 }
        });

        doc.save(`Horario_${activeYear}_Año.pdf`);
    };

    const exportToExcel = () => {
        const filtered = sessions.filter(s => s.seccion.includes(activeYear));
        const ws = XLSX.utils.json_to_sheet(filtered);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Horario");
        XLSX.writeFile(wb, `Horario_${activeYear}_Año.xlsx`);
    };

    const filteredSessions = sessions.filter(s => s.dia === activeDay && s.seccion.includes(activeYear));

    if (loading) return (
      <div className="space-y-16 pb-20">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
            <div className="space-y-6">
                <div className="h-12 w-80 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-4 w-64 bg-white/[0.02] rounded-lg animate-pulse" />
            </div>
            <div className="h-16 w-[400px] bg-white/5 rounded-full animate-pulse" />
         </div>
         <div className="space-y-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#1C1C1E] border border-white/5 rounded-[3rem] animate-pulse" />
            ))}
         </div>
      </div>
    );

    return (
        <div className="space-y-16 pb-20 relative">
            {/* Header Pro */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-12">
                            <CalendarRange className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.4em]">
                            Planificación Estratégica v14.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Cronograma</h2>
                        <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
                            Organización síncrona de bloques académicos por nivel. 
                            <span className="block mt-2 text-[#0A84FF] select-none italic uppercase tracking-[0.2em] text-[11px] font-black underline underline-offset-4 decoration-[#0A84FF]/20">Sistema de optimización de aulas activo.</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                    <div className="bg-[#1C1C1E] border border-white/5 rounded-[2.25rem] p-2 flex gap-1 shadow-2xl">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => setActiveYear(y)}
                                className={`px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${
                                    activeYear === y 
                                        ? 'bg-white text-black shadow-2xl scale-105' 
                                        : 'text-white/20 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {y} Año
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={exportToPDF}
                            className="h-16 w-16 bg-[#1C1C1E] border border-white/5 text-white/20 hover:text-white rounded-2xl transition-all shadow-2xl flex items-center justify-center p-0"
                        >
                            <Printer className="w-6 h-6" strokeWidth={1.5} />
                        </Button>
                        <Button 
                            onClick={exportToExcel}
                            className="h-16 w-16 bg-[#1C1C1E] border border-white/5 text-white/20 hover:text-white rounded-2xl transition-all shadow-2xl flex items-center justify-center p-0"
                        >
                            <FileSpreadsheet className="w-6 h-6" strokeWidth={1.5} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Days Selector Noir */}
            <div className="bg-[#1C1C1E]/50 border border-white/[0.03] rounded-[3rem] p-3 flex gap-3 overflow-x-auto shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] no-scrollbar">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 min-w-[160px] px-10 py-6 rounded-[2.25rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 relative overflow-hidden group ${
                            activeDay === day 
                                ? 'bg-white text-black shadow-2xl scale-[1.02]' 
                                : 'text-white/10 hover:text-white/40 hover:bg-white/5'
                        }`}
                    >
                        {activeDay === day && (
                           <motion.div 
                              layoutId="activeDayGlow"
                              className="absolute inset-0 bg-white/10 blur-xl" 
                           />
                        )}
                        <span className="relative z-10">{day}</span>
                    </button>
                ))}
            </div>

            {/* Timeline Noir View */}
            <div className="grid gap-8 relative z-10">
                <AnimatePresence mode="popLayout">
                    {filteredSessions.length > 0 ? filteredSessions.sort((a,b) => a.bloque.localeCompare(b.bloque)).map((s, i) => (
                        <motion.div 
                            key={s.id || i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                            transition={{ delay: i * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="apple-pro-card p-12 flex flex-col xl:flex-row xl:items-center justify-between gap-12 group hover:border-white/20 hover:bg-white/[0.02] transition-all duration-700 cursor-default"
                        >
                            <div className="flex items-center gap-14">
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] leading-none mb-2 italic">Slot Temporal</span>
                                    <div className="flex items-center gap-5 text-white font-black text-2xl tracking-tighter italic">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                            <Clock className="w-6 h-6 text-white/20 group-hover:text-[#0A84FF] transition-colors" strokeWidth={1.5} />
                                        </div>
                                        {s.bloque}
                                    </div>
                                </div>
                                
                                <div className="h-20 w-[1px] bg-white/5 hidden xl:block" />

                                <div className="flex flex-col gap-4">
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter group-hover:translate-x-3 transition-transform duration-700 leading-none">
                                        {s.materia}
                                    </h3>
                                    <div className="flex items-center gap-8 mt-2">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                            <div className="p-2 rounded-lg bg-white/5">
                                               <BookOpen className="w-4 h-4" />
                                            </div>
                                            Unidad de Aprendizaje
                                        </div>
                                        <Badge className="bg-white text-black border-none rounded-2xl px-6 py-2 font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl italic">
                                            {s.seccion}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">Disponibilidad</span>
                                    <Badge className="bg-[#32D74B]/10 text-[#32D74B] border border-[#32D74B]/20 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Sincronizado</Badge>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:text-white group-hover:bg-white/10 transition-all duration-700">
                                    <ChevronRight className="w-8 h-8" strokeWidth={3} />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-64 apple-pro-card border-dashed border-white/5 bg-transparent space-y-12 select-none opacity-20">
                            <div className="w-40 h-40 rounded-[3.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <CalendarRange className="w-16 h-16 text-white" strokeWidth={1} />
                                <div className="absolute inset-0 bg-white/5 blur-3xl animate-pulse" />
                            </div>
                            <div className="text-center space-y-4">
                               <p className="text-[14px] font-black uppercase tracking-[0.8em] text-white italic">Cronograma Vacío</p>
                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Iniciando protocolo de planificación para {activeDay}...</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals & Feedback Noir */}
            <div className="fixed bottom-12 right-12 flex flex-col items-end gap-10 h-[80px]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-32 right-0"
                        >
                           <div className={`p-10 rounded-[3rem] border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-8 ${
                             msg.type === 'success' ? 'bg-[#1C1C1E] border-emerald-500/20 text-emerald-400' : 'bg-[#1C1C1E] border-red-500/20 text-red-400'
                           }`}>
                              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                {msg.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">Notificación del Núcleo</span>
                                <span className="text-md font-black uppercase tracking-tight mt-2">{msg.text}</span>
                              </div>
                              <button onClick={() => setMsg({text:'', type:''})} className="ml-10 p-3 hover:bg-white/10 rounded-full transition-colors">
                                 <X className="w-5 h-5 opacity-30 hover:opacity-100" />
                              </button>
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-20 px-16 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_30px_70px_rgba(255,255,255,0.1)] flex gap-8 group/main">
                                <Plus className="w-7 h-7 group-hover/main:rotate-90 transition-transform duration-700" strokeWidth={2.5} />
                                Nueva Sesión Pro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white rounded-[4rem] p-20 max-w-2xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]">
                            <DialogHeader className="mb-12">
                                <DialogTitle className="text-5xl font-black tracking-tighter text-white uppercase italic">Programación Pro</DialogTitle>
                                <DialogDescription className="text-white/20 font-black text-[11px] uppercase tracking-[0.5em] mt-4">Matriz de Horarios • Andrés Bello v14.0</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Día Operativo</label>
                                        <select 
                                            className="w-full bg-black border border-white/5 rounded-[1.75rem] h-18 px-8 text-xs font-black text-white outline-none appearance-none uppercase tracking-widest"
                                            value={newSession.dia}
                                            onChange={(e) => setNewSession({...newSession, dia: e.target.value})}
                                        >
                                            {days.map(d => <option key={d} value={d} className="bg-black">{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Sección Académica</label>
                                        <Input 
                                            className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black uppercase tracking-widest text-xs italic px-8"
                                            placeholder="EJ: 5TO AÑO B"
                                            value={newSession.seccion}
                                            onChange={(e) => setNewSession({...newSession, seccion: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Unidad Curricular / Materia</label>
                                    <Input 
                                        className="bg-black border-white/5 h-20 rounded-[2rem] text-white text-2xl font-black uppercase tracking-tighter italic px-10"
                                        placeholder="ALGORÍTMICA II"
                                        value={newSession.materia}
                                        onChange={(e) => setNewSession({...newSession, materia: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Bloque Cronometrado</label>
                                    <Input 
                                        className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black uppercase tracking-widest text-xs italic px-8"
                                        placeholder="EJ: 07:00 AM - 08:30 AM"
                                        value={newSession.bloque}
                                        onChange={(e) => setNewSession({...newSession, bloque: e.target.value})}
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black mt-10 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.4em] shadow-2xl shadow-white/5"
                                >
                                    {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : "Consolidar Sesión"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32 no-print">
                <div className="flex items-center gap-4">
                    <Layers className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Consolidación de Planificación de Activos Académicos</span>
                </div>
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Protocolo Andrés Bello Term v14.0</span>
                </div>
            </div>
        </div>
    );
};

export default SchedulesModule;
