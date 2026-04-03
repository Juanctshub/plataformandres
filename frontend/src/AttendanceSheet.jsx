import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  ChevronRight,
  Filter,
  Users,
  Building2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";

const AttendanceSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-white/5 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-48 bg-white/5 rounded-2xl" />
        <Skeleton className="h-12 w-48 bg-white/5 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} className="h-20 w-full bg-white/5 rounded-[2rem]" />
      ))}
    </div>
  </div>
);

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterSection, setFilterSection] = useState('Todas');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/estudiantes`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setStudents(data.map(s => ({ ...s, status: 'presente' })));
      } catch (e) {
        console.error('Error fetching students:', e);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const promises = students
        .filter(s => filterSection === 'Todas' || s.seccion === filterSection)
        .map(s => fetch(`${baseUrl}/api/asistencia`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ estudiante_id: s.id, fecha: date, estado: s.status })
        }));
      
      await Promise.all(promises);
      setMsg({ text: 'Sincronización de asistencia completada', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (e) {
      setMsg({ text: 'Error al sincronizar con el servidor', type: 'error' });
    }
  };

  const sections = ['Todas', ...new Set(students.map(s => s.seccion))];
  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion === filterSection);

  if (loading) return <AttendanceSkeleton />;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
            <h2 className="text-4xl font-semibold tracking-tight text-white/90 italic">Pase de Lista</h2>
            <div className="flex items-center gap-3">
                <p className="text-zinc-500 font-medium">Control de asistencia diaria por sección académica.</p>
                <div className="h-4 w-[1px] bg-white/10" />
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest">En Vivo</Badge>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 pl-4">
                <Calendar className="w-4 h-4 text-zinc-600" />
                <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none text-white font-medium focus:ring-0 p-1"
                />
            </div>
            
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 flex gap-2">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                            filterSection === sec 
                                ? 'bg-white text-black' 
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                    >
                        {sec}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredStudents.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="apple-card group p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  s.status === 'presente' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                  s.status === 'ausente' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
                  'bg-amber-500/5 border-amber-500/20 text-amber-400'
                }`}>
                  {s.status === 'presente' ? <CheckCircle2 className="w-6 h-6" /> : 
                   s.status === 'ausente' ? <XCircle className="w-6 h-6" /> : 
                   <Clock className="w-6 h-6" />}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors tracking-tight uppercase italic">{s.nombre}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">C.I. {s.cedula}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sección {s.seccion}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {[
                  { id: 'presente', icon: CheckCircle2, label: 'Presente', color: 'emerald' },
                  { id: 'ausente', icon: XCircle, label: 'Ausente', color: 'red' },
                  { id: 'retraso', icon: Clock, label: 'Retraso', color: 'amber' }
                ].map(opt => (
                  <Button
                    key={opt.id}
                    onClick={() => handleStatusChange(s.id, opt.id)}
                    className={`h-11 px-5 rounded-2xl font-bold uppercase tracking-widest text-[9px] transition-all duration-300 border ${
                      s.status === opt.id 
                        ? `bg-${opt.color}-500/10 border-${opt.color}-500/30 text-${opt.color}-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]` 
                        : 'bg-transparent border-white/5 text-zinc-600 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5 mr-2" />
                    {opt.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-6 overflow-hidden">
        <AnimatePresence>
          {msg.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-6 rounded-[2rem] flex items-center gap-4 text-sm font-bold uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          onClick={handleSave}
          className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-bold text-lg uppercase tracking-[-0.02em] active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex gap-4"
        >
          Sincronizar Pase de Lista
          <ChevronRight className="w-6 h-6 opacity-30" />
        </Button>
      </div>

      <div className="flex items-center gap-10 opacity-30 text-zinc-700 select-none pt-10">
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Protocolo de Asistencia v2.2</span>
        </div>
        <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Andrés Bello • Nucleo Académico</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
