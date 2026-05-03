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

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterSection, setFilterSection] = useState('Todas');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item = { 
    hidden: { opacity: 0, y: 15 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } 
  };

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

      const mappedStudents = studentsArray.map(s => {
        const hasJustification = justArray.find(j => 
          j.estudiante_id === s.id && 
          (j.fecha || '').startsWith(date) && 
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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [date]);

  const handleStatusChange = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const promises = students
        .filter(s => filterSection === 'Todas' || (s.seccion || '').startsWith(filterSection))
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
      setMsg({ text: 'Asistencia Sincronizada', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    } catch (e) {
      setMsg({ text: 'Error de Sincronización', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion?.includes(filterSection));

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30">Cargando Protocolo...</p>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto py-8 sm:py-14 space-y-10 px-5 sm:px-10"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight italic leading-tight">Asistencia</h1>
              <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.3em] mt-3">Control de Presencia • {date}</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="ios-button-primary bg-white text-black h-12 px-8 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Guardando...' : 'Sincronizar'}
          </Button>
      </motion.div>

      {/* Controls */}
      <motion.div variants={item} className="flex flex-col gap-4">
         <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex items-center gap-4 bg-[#1c1c1e] rounded-3xl px-6 h-16 border border-white/5 shadow-md flex-1">
               <CalendarIcon className="w-5 h-5 text-blue-500" />
               <input 
                   type="date" 
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="bg-transparent border-none text-white text-[16px] font-bold focus:ring-0 cursor-pointer outline-none w-full italic"
               />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {['Todas', '1', '2', '3', '4', '5'].map((y) => (
                 <button
                   key={y}
                   onClick={() => setFilterSection(y)}
                   className={`px-8 py-4 rounded-3xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                     filterSection === y 
                       ? 'bg-white text-black shadow-2xl' 
                       : 'bg-white/5 text-[#86868b] hover:text-white'
                   }`}
                 >
                   {y === 'Todas' ? 'Todas' : `${y} Año`}
                 </button>
               ))}
            </div>
         </div>
         {filterSection !== 'Todas' && (
           <motion.div 
             initial={{ opacity: 0, y: -10 }} 
             animate={{ opacity: 1, y: 0 }}
             className="flex gap-3 justify-center md:justify-start"
           >
              {['A', 'B', 'C'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(`${filterSection}${sec}`)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterSection.endsWith(sec)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
           </motion.div>
         )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-emerald-400', icon: CheckCircle2 },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-red-400', icon: XCircle },
           { label: 'Tardanzas', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-amber-400', icon: Clock },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-blue-400', icon: FileText },
         ].map(stat => (
           <div key={stat.label} className="apple-card p-5 border-white/5 flex flex-col gap-2">
               <stat.icon className={`w-4 h-4 ${stat.color}`} />
               <p className="text-2xl font-bold text-white italic">{stat.count}</p>
               <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{stat.label}</p>
           </div>
         ))}
      </motion.div>

      {/* Student List */}
      <motion.div variants={item} className="ios-list-group space-y-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s, idx) => (
              <div key={s.id} className="ios-list-item flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 px-8">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                      s.status === 'presente' ? 'bg-emerald-500/10 text-emerald-400' : 
                      s.status === 'ausente' ? 'bg-red-500/10 text-red-400' :
                      s.status === 'justificado' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-amber-500/10 text-amber-400'
                   }`}>
                      {s.nombre.charAt(0)}
                   </div>
                   <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-[17px] font-bold text-white truncate leading-tight">{s.nombre}</h4>
                        {s.isJustified && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">AUTORIZADO</span>}
                      </div>
                      <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mt-1">CI: {s.cedula} • {s.seccion}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl self-stretch sm:self-auto justify-between sm:justify-start">
                    {[
                      { id: 'presente', label: 'P', color: 'text-emerald-400' },
                      { id: 'ausente', label: 'A', color: 'text-red-400' },
                      { id: 'justificado', label: 'J', color: 'text-blue-400' },
                      { id: 'retraso', label: 'T', color: 'text-amber-400' }
                    ].map(opt => (
                     <button
                        key={opt.id}
                        disabled={s.status === 'justificado' && opt.id !== 'justificado'}
                        onClick={() => handleStatusChange(s.id, opt.id)}
                        className={`h-12 w-12 rounded-xl text-[12px] font-black transition-all ${
                           s.status === opt.id 
                             ? 'bg-white text-black scale-105 shadow-xl' 
                             : `text-[#86868b] hover:text-white ${s.status === 'justificado' && opt.id !== 'justificado' ? 'opacity-10' : ''}`
                        }`}
                     >
                        {opt.label}
                     </button>
                    ))}
                </div>
              </div>
            ))
          ) : (
             <div className="py-20 flex flex-col items-center opacity-20">
                <ClipboardCheck className="w-12 h-12 mb-4" />
                <p className="text-[11px] font-black uppercase tracking-widest">Sin registros en sección</p>
             </div>
          )}
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-full backdrop-blur-2xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl ${
                msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AttendanceSheet;

