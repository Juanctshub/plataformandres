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
  Globe,
  ArrowRight,
  Calendar
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
                setMsg({ text: 'Sesión programada con éxito', type: 'success' });
                setIsAddModalOpen(false);
                setNewSession({ seccion: activeYear + ' A', dia: activeDay, materia: '', bloque: '' });
                fetchSchedules();
            }
        } catch (e) {
            setMsg({ text: 'Error al sincronizar con el núcleo', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF('l');
        doc.setFontSize(20);
        doc.text(`Cronograma Académico - ${activeYear} Año`, 14, 20);
        doc.autoTable({
            startY: 30,
            head: [['Día', 'Asignaturas']],
            body: days.map(day => [
              day, 
              sessions.filter(s => s.dia === day && s.seccion.includes(activeYear))
                .sort((a,b) => a.bloque.localeCompare(b.bloque))
                .map(s => `${s.bloque}: ${s.materia}`).join('\n') || 'N/A'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [0, 122, 255] }
        });
        doc.save(`Horario_${activeYear}.pdf`);
    };

    const filteredSessions = sessions.filter(s => s.dia === activeDay && s.seccion.includes(activeYear));

    if (loading) return (
      <div className="space-y-12">
          <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
          <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-24 apple-glass rounded-[2rem] animate-pulse" />)}
          </div>
      </div>
    );

    return (
        <div className="space-y-12">
            {/* Search & Tabs */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
               <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                     {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => setActiveYear(y)}
                          className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                            activeYear === y 
                              ? 'bg-white text-black shadow-lg' 
                              : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {y} Año
                        </button>
                     ))}
                  </div>
                  <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                  <div className="flex items-center gap-4">
                     <Button 
                        onClick={exportToPDF}
                        className="h-12 w-12 apple-glass border border-white/5 text-white/40 hover:text-white rounded-2xl flex items-center justify-center p-0"
                     >
                        <Printer className="w-5 h-5" />
                     </Button>
                  </div>
               </div>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-xs flex gap-3 shadow-2xl active:scale-95 transition-all">
                      <Plus className="w-5 h-5" />
                      Nueva Programación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="apple-glass border-white/10 p-16 rounded-[3rem] max-w-xl">
                     <DialogHeader className="mb-10">
                        <DialogTitle className="text-3xl font-semibold text-white tracking-tight">Planificación Semanal</DialogTitle>
                        <DialogDescription className="text-[#86868b] font-medium mt-3">Gestión de tiempos v15.0</DialogDescription>
                     </DialogHeader>
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Día</label>
                              <select 
                                 className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none appearance-none"
                                 value={newSession.dia}
                                 onChange={(e) => setNewSession({...newSession, dia: e.target.value})}
                              >
                                 {days.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Grado/Sección</label>
                              <Input 
                                 placeholder="Ej: 5A"
                                 className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                                 value={newSession.seccion}
                                 onChange={(e) => setNewSession({...newSession, seccion: e.target.value})}
                                 required
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Materia</label>
                           <Input 
                              placeholder="Ej: Matemáticas"
                              className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                              value={newSession.materia}
                              onChange={(e) => setNewSession({...newSession, materia: e.target.value})}
                              required
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Bloque de Horario</label>
                           <Input 
                              placeholder="07:00 AM - 08:30 AM"
                              className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                              value={newSession.bloque}
                              onChange={(e) => setNewSession({...newSession, bloque: e.target.value})}
                              required
                           />
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full h-16 bg-blue-600 text-white hover:bg-blue-500 rounded-full font-bold transition-all shadow-xl">
                           {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Fijar Programación"}
                        </Button>
                     </form>
                  </DialogContent>
               </Dialog>
            </div>

            {/* Days Horizontal Filter */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
               {days.map((day) => (
                  <button
                     key={day}
                     onClick={() => setActiveDay(day)}
                     className={`px-10 py-5 rounded-[2rem] text-sm font-semibold transition-all whitespace-nowrap ${
                        activeDay === day 
                           ? 'bg-white/10 text-white border border-white/20' 
                           : 'text-[#86868b] hover:text-white/80 hover:bg-white/5'
                     }`}
                  >
                     {day}
                  </button>
               ))}
            </div>

            {/* Schedule List */}
            <div className="space-y-6">
               <AnimatePresence mode="popLayout">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.sort((a,b) => a.bloque.localeCompare(b.bloque)).map((s, i) => (
                      <motion.div
                        key={s.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="apple-card group p-8 flex items-center justify-between hover:translate-y-0"
                      >
                         <div className="flex items-center gap-10">
                            <div className="flex flex-col min-w-[140px]">
                               <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest mb-1 italic">Cronología</span>
                               <div className="flex items-center gap-4 text-xl font-semibold text-white tracking-tight">
                                  <Clock className="w-5 h-5 text-blue-400" />
                                  {s.bloque}
                               </div>
                            </div>
                            
                            <div className="h-12 w-[1px] bg-white/10" />

                            <div className="space-y-1">
                               <h4 className="text-2xl font-semibold text-white tracking-tight group-hover:translate-x-1 transition-transform italic">{s.materia}</h4>
                               <div className="flex items-center gap-3">
                                  <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-3 py-0.5 text-[9px] font-bold">SECCIÓN {s.seccion}</Badge>
                                  <div className="w-1 h-1 rounded-full bg-white/10" />
                                  <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Planificado v15.0</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end opacity-40">
                               <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                            <button className="p-3 rounded-full bg-white/5 text-white/10 group-hover:text-white transition-all">
                               <ArrowRight className="w-5 h-5" />
                            </button>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-40 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-30">
                       <CalendarRange className="w-16 h-16" />
                       <p className="text-sm font-semibold tracking-widest uppercase">Sin actividades para {activeDay}</p>
                    </div>
                  )}
               </AnimatePresence>
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
                        <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Schedule System</span>
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

export default SchedulesModule;
