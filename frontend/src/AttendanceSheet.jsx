import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  ChevronRight,
  Filter,
  Users,
  Building2,
  ShieldCheck,
  AlertCircle,
  FileText,
  Save,
  Check,
  IdCard,
  Loader2,
  X,
  ArrowRight
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [justifications, setJustifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterSection, setFilterSection] = useState('Todas');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resStd, resJust] = await Promise.all([
        fetch(`${baseUrl}/api/estudiantes`, { headers }),
        fetch(`${baseUrl}/api/justificaciones`, { headers })
      ]);

      const stdData = await resStd.json();
      const justData = await resJust.json();
      
      const studentsArray = Array.isArray(stdData) ? stdData : [];
      const justArray = Array.isArray(justData) ? justData : [];
      
      setJustifications(justArray);

      const mappedStudents = studentsArray.map(s => {
        const hasJustification = justArray.find(j => 
          j.estudiante_id === s.id && 
          j.fecha.startsWith(date) && 
          j.estado === 'aprobado'
        );
        return { 
          ...s, 
          status: hasJustification ? 'justificado' : 'presente',
          isJustified: !!hasJustification
        };
      });

      setStudents(mappedStudents);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleStatusChange = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = async () => {
    setSaving(true);
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
          body: JSON.stringify({ 
            estudiante_id: s.id, 
            fecha: date, 
            estado: s.status,
            observacion: s.status === 'justificado' ? 'JUSTIFICACIÓN APROBADA' : ''
          })
        }));
      
      await Promise.all(promises);
      setMsg({ text: 'Asistencia sincronizada exitosamente', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    } catch (e) {
      setMsg({ text: 'Error al sincronizar con el núcleo', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const sections = ['Todas', ...new Set(students.map(s => s.seccion))];
  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion === filterSection);

  if (loading) return (
    <div className="space-y-12">
        <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 apple-glass rounded-2xl animate-pulse" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Selection Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
        <div className="flex flex-wrap items-center gap-6">
           <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-6 py-3 transition-all group hover:bg-white/10">
              <CalendarIcon className="w-4.5 h-4.5 text-[#86868b] group-hover:text-blue-500 transition-colors" />
              <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none text-white font-semibold text-xs tracking-wider focus:ring-0 cursor-pointer"
              />
           </div>

           <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    filterSection === sec 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec}
                </button>
              ))}
           </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs transition-all flex gap-3 shadow-2xl active:scale-95"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Consolidar Registro
        </Button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-red-400', bg: 'bg-red-500/10' },
           { label: 'Tardanzas', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
         ].map(stat => (
           <div key={stat.label} className="apple-card p-6 flex flex-row items-center justify-between border-white/[0.03] hover:translate-y-0 hover:border-white/10">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#86868b]">{stat.label}</span>
              <div className={`px-4 py-1.5 rounded-full ${stat.bg} ${stat.color} font-bold text-sm`}>
                {stat.count}
              </div>
           </div>
         ))}
      </div>

      {/* Modern Attendance List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s, idx) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="apple-card p-5 group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-y-0 border-white/[0.03]"
              >
                <div className="flex items-center gap-6 flex-1">
                   <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/[0.03] border border-white/5 ${
                      s.status === 'presente' ? 'text-emerald-400' : 
                      s.status === 'ausente' ? 'text-red-400' :
                      s.status === 'justificado' ? 'text-blue-400' :
                      'text-amber-400'
                   }`}>
                      {s.status === 'presente' ? <CheckCircle2 className="w-7 h-7" /> : 
                       s.status === 'ausente' ? <XCircle className="w-7 h-7" /> : 
                       s.status === 'justificado' ? <FileText className="w-7 h-7" /> :
                       <Clock className="w-7 h-7" />}
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <h4 className="text-lg font-semibold text-white tracking-tight">{s.nombre}</h4>
                         {s.isJustified && (
                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest italic">Pase Justificado</Badge>
                         )}
                      </div>
                      <p className="text-xs text-[#86868b] font-medium tracking-wide">CI {s.cedula} • Sección {s.seccion}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-full border border-white/5">
                   {[
                     { id: 'presente', label: 'Presente', color: 'hover:bg-emerald-500/10 hover:text-emerald-400' },
                     { id: 'ausente', label: 'Ausente', color: 'hover:bg-red-500/10 hover:text-red-400' },
                     { id: 'justificado', label: 'Justificado', color: 'hover:bg-blue-500/10 hover:text-blue-400' },
                     { id: 'retraso', label: 'Tarde', color: 'hover:bg-amber-500/10 hover:text-amber-400' }
                   ].map(opt => (
                     <button
                        key={opt.id}
                        disabled={s.status === 'justificado' && opt.id !== 'justificado'}
                        onClick={() => handleStatusChange(s.id, opt.id)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                           s.status === opt.id 
                             ? 'bg-white text-black shadow-lg' 
                             : `text-[#86868b] ${opt.color} ${s.status === 'justificado' && opt.id !== 'justificado' ? 'opacity-10 cursor-not-allowed' : ''}`
                        }`}
                     >
                        {opt.label}
                     </button>
                   ))}
                </div>
              </motion.div>
            ))
          ) : (
             <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 space-y-4">
                <ClipboardCheck className="w-16 h-16" />
                <p className="text-sm font-semibold tracking-widest uppercase">Sin registros para esta sesión</p>
             </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-32 right-12 z-[110]"
          >
             <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl border-white/10">
                <div className={`p-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                   {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Sincronización</span>
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

export default AttendanceSheet;
