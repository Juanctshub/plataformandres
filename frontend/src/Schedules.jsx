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
  Printer
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
            setLoading(false);
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
                setMsg({ text: 'Cronograma actualizado exitosamente', type: 'success' });
                setIsAddModalOpen(false);
                setNewSession({ seccion: activeYear + ' A', dia: activeDay, materia: '', bloque: '' });
                fetchSchedules();
            }
        } catch (e) {
            setMsg({ text: 'Error al registrar sesión', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const exportToPDF = () => {
        const doc = jsPDF('l'); // Landscape
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
            headStyles: { fillColor: '#18181b', textColor: '#ffffff' },
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

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                            <CalendarRange className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-blue-50 text-blue-600 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                            Planificación 2026
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Cronograma</h2>
                        <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
                            Administración de bloques horarios por nivel académico y sección pedagógica.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white border border-zinc-100 rounded-[2.2rem] p-2 flex gap-2 shadow-sm">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => setActiveYear(y)}
                                className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${
                                    activeYear === y 
                                        ? 'bg-zinc-100 text-zinc-900 shadow-sm' 
                                        : 'text-zinc-300 hover:text-zinc-900'
                                }`}
                            >
                                {y} Año
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={exportToPDF}
                            className="h-14 px-6 bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-2xl transition-all"
                        >
                            <Printer className="w-5 h-5" />
                        </Button>
                        <Button 
                            onClick={exportToExcel}
                            className="h-14 px-6 bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-2xl transition-all"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                        </Button>
                    </div>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10">
                                <Plus className="w-5 h-5" />
                                Programar Clase
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none text-zinc-900 rounded-[3rem] p-12 max-w-xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.15)]">
                            <DialogHeader className="mb-8">
                                <DialogTitle className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Carga Horaria</DialogTitle>
                                <DialogDescription className="text-zinc-400 font-bold text-sm mt-3">Planificación de bloque académico institucional</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Día Semanal</label>
                                        <select 
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none appearance-none"
                                            value={newSession.dia}
                                            onChange={(e) => setNewSession({...newSession, dia: e.target.value})}
                                        >
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Sección Detallada</label>
                                        <Input 
                                            placeholder="Ej: 5to Año B"
                                            className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold"
                                            value={newSession.seccion}
                                            onChange={(e) => setNewSession({...newSession, seccion: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Unidad Curricular</label>
                                    <Input 
                                        placeholder="Ej: Análisis Matemático"
                                        className="bg-zinc-50 border-zinc-100 h-16 rounded-2xl text-xl font-black uppercase tracking-tight"
                                        value={newSession.materia}
                                        onChange={(e) => setNewSession({...newSession, materia: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Rango Horario</label>
                                    <Input 
                                        placeholder="Ej: 07:00 AM - 08:30 AM"
                                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold"
                                        value={newSession.bloque}
                                        onChange={(e) => setNewSession({...newSession, bloque: e.target.value})}
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black mt-4 transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/10"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Horario"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Days Tabs (Professional UI) */}
            <div className="bg-zinc-100/50 border border-zinc-200/50 rounded-[2.5rem] p-2 flex gap-3 mb-10 overflow-x-auto shadow-inner">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 min-w-[140px] px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${
                            activeDay === day 
                                ? 'bg-white text-zinc-950 shadow-xl' 
                                : 'text-zinc-300 hover:text-zinc-600'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timeline View */}
            <div className="grid gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredSessions.length > 0 ? filteredSessions.sort((a,b) => a.bloque.localeCompare(b.bloque)).map((s, i) => (
                        <motion.div 
                            key={s.id || i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white border border-zinc-100 rounded-[3rem] p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10 group hover:shadow-2xl hover:border-zinc-200 transition-all duration-700"
                        >
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col gap-2 min-w-[180px]">
                                    <span className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.3em] leading-none mb-2">Bloque Cronometrado</span>
                                    <div className="flex items-center gap-4 text-zinc-900 font-black text-lg">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                                        </div>
                                        {s.bloque}
                                    </div>
                                </div>
                                
                                <div className="h-16 w-[1px] bg-zinc-100 hidden xl:block" />

                                <div className="flex flex-col gap-2">
                                    <h3 className="text-3xl font-black text-zinc-900 uppercase italic tracking-tighter group-hover:underline decoration-zinc-100 decoration-8 underline-offset-8 transition-all">
                                        {s.materia}
                                    </h3>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                            <BookOpen className="w-4 h-4 text-zinc-200" />
                                            Cátedra Institucional
                                        </div>
                                        <Badge className="bg-zinc-950 text-white border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-[0.3em] shadow-lg shadow-zinc-900/10">
                                            {s.seccion}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex flex-col items-end gap-1.5 translate-y-1">
                                    <span className="text-[9px] font-black text-zinc-200 uppercase tracking-widest">Estado de Aula</span>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">Sincronizado</Badge>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-zinc-50 flex items-center justify-center text-zinc-100 group-hover:text-zinc-950 group-hover:scale-110 transition-all duration-700">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-40 text-zinc-100 space-y-8 opacity-20 select-none">
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-zinc-100 flex items-center justify-center">
                                <CalendarRange className="w-10 h-10" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.6em] italic">
                                Planificación en curso para {activeDay}...
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toasts / Feedback */}
            <div className="fixed bottom-12 right-12 z-[100]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                            }`}
                        >
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {msg.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Núcleo de Planificación Académica</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocolo Andrés Bello Suite v10.0</span>
                </div>
            </div>
        </div>
    );
};

export default SchedulesModule;
