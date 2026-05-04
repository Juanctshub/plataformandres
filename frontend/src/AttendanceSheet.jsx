import React, { useState, useEffect, useCallback } from 'react';
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
  ArrowRight,
  RotateCcw,
  History
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [existingAttendance, setExistingAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterSection, setFilterSection] = useState('Todas');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('sync'); // 'sync' or 'history'

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item = { 
    hidden: { opacity: 0, y: 15 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } 
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel fetch students, justifications AND current attendance for this date
      const [resStd, resJust, resAtt] = await Promise.all([
        fetch(`${baseUrl}/api/estudiantes`, { headers }),
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/asistencia`, { headers }) // We'll filter by date in JS for simplicity or add a param
      ]);

      const stdData = await resStd.json();
      const justData = await resJust.json();
      const attData = await resAtt.json();
      
      const studentsArray = Array.isArray(stdData) ? stdData : [];
      const justArray = Array.isArray(justData) ? justData : [];
      const attendanceArray = Array.isArray(attData) ? attData : [];

      // Map existing attendance for this specific date
      const dailyAttendance = {};
      attendanceArray.forEach(record => {
          if (record.fecha.startsWith(date)) {
              dailyAttendance[record.estudiante_id || record.id] = record.estado;
          }
      });
      setExistingAttendance(dailyAttendance);

      const mappedStudents = studentsArray.map(s => {
        // AI/System Logic: Justifications take priority IF not already manually set
        const hasJustification = justArray.find(j => 
          j.estudiante_id === s.id && 
          (j.fecha || '').startsWith(date) && 
          j.estado === 'aprobado'
        );
        
        // If there's already a record in the DB, use it. Otherwise, use justification or default to present.
        const currentStatus = dailyAttendance[s.id] || (hasJustification ? 'justificado' : 'presente');

        return { 
          ...s, 
          status: currentStatus,
          isJustified: !!hasJustification,
          isModified: !!dailyAttendance[s.id]
        };
      });

      setStudents(mappedStudents);
    } catch (e) {
      console.error(e);
      setMsg({ text: 'Error de comunicación con el Nodo Maestro', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status, isModified: true } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg({ text: 'Sincronizando protocolos...', type: 'info' });
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const token = localStorage.getItem('token');
      
      // Only save students that are either modified or in the current filtered view
      const studentsToSave = students.filter(s => 
        filterSection === 'Todas' || (s.seccion || '').includes(filterSection)
      );

      const promises = studentsToSave.map(s => fetch(`${baseUrl}/api/asistencia`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            estudiante_id: s.id, 
            fecha: date, 
            estado: s.status,
            observacion: s.status === 'justificado' ? 'SISTEMA: JUSTIFICACIÓN VINCULADA' : (s.isModified ? 'ACTUALIZACIÓN MANUAL' : '')
          })
        }));
      
      await Promise.all(promises);
      setMsg({ text: 'Base de datos actualizada con éxito', type: 'success' });
      
      // Refresh to get latest state
      fetchData();
      
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (e) {
      setMsg({ text: 'Error en protocolo de escritura', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion?.includes(filterSection));

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto py-6 md:py-14 space-y-8 md:space-y-12 px-4 md:px-10"
    >
      {/* Dynamic Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-blue-500" />
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter italic leading-none">Asistencia</h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[#86868b] px-3 py-1 font-bold tracking-widest text-[9px] uppercase">
                  Protocolo v4.2
                </Badge>
                <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Corte: {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => fetchData()}
                className="h-12 w-12 rounded-2xl bg-white/5 text-white/40 hover:text-white border border-white/5 active:scale-90"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving || loading}
                className="ios-button-blue h-12 px-10 active:scale-95 flex-1 md:flex-none"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                {saving ? 'Sincronizando...' : 'Guardar Cambios'}
              </Button>
          </div>
      </motion.div>

      {/* Responsive Controls */}
      <motion.div variants={item} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 flex items-center gap-2 group">
               <div className="relative flex-1">
                 <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <CalendarIcon className="w-4 h-4 text-blue-500/60 group-focus-within:text-blue-500 transition-colors" />
                 </div>
                 <input 
                     type="date" 
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full bg-[#1c1c1e] rounded-[1.5rem] pl-14 pr-6 h-16 border border-white/5 text-white text-[15px] font-bold focus:ring-1 focus:ring-blue-500/30 outline-none transition-all italic"
                 />
               </div>
               <div className="flex flex-col gap-1">
                 <button 
                   onClick={() => {
                     const d = new Date(date);
                     d.setDate(d.getDate() + 1);
                     setDate(d.toISOString().split('T')[0]);
                   }}
                   className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                 >
                   <ChevronRight className="w-4 h-4 -rotate-90" />
                 </button>
                 <button 
                   onClick={() => {
                     const d = new Date(date);
                     d.setDate(d.getDate() - 1);
                     setDate(d.toISOString().split('T')[0]);
                   }}
                   className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                 >
                   <ChevronRight className="w-4 h-4 rotate-90" />
                 </button>
               </div>
            </div>
            <div className="md:col-span-8 flex gap-2 overflow-x-auto no-scrollbar py-1">
               {['Todas', '1', '2', '3', '4', '5'].map((y) => (
                 <button
                   key={y}
                   onClick={() => setFilterSection(y)}
                   className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                     filterSection.startsWith(y) 
                       ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)] scale-105' 
                       : 'bg-white/5 text-[#86868b] hover:text-white hover:bg-white/10'
                   }`}
                 >
                   {y === 'Todas' ? 'Toda la Matrícula' : `${y} Año`}
                 </button>
               ))}
            </div>
         </div>

         {filterSection !== 'Todas' && (
           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }}
             className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit"
           >
              {['A', 'B', 'C'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(`${filterSection[0]}${sec}`)}
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    filterSection.endsWith(sec)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-white/20 hover:text-white/60'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
           </motion.div>
         )}
      </motion.div>

      {/* Metrics - Better on mobile */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-emerald-400', icon: CheckCircle2, bg: 'bg-emerald-500/5' },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/5' },
           { label: 'Tardanzas', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-amber-400', icon: Clock, bg: 'bg-amber-500/5' },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-blue-400', icon: FileText, bg: 'bg-blue-500/5' },
         ].map(stat => (
           <div key={stat.label} className={`ios-card p-5 border-white/5 flex flex-col gap-2 ${stat.bg}`}>
               <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
               <p className="text-2xl md:text-3xl font-bold text-white italic tracking-tighter">{stat.count}</p>
               <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{stat.label}</p>
           </div>
         ))}
      </motion.div>

      {/* Student List - Optimized for Mobile Overlaps */}
      <motion.div variants={item} className="space-y-4 pb-20">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Listado de Auditores</h3>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{filteredStudents.length} registros</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/5 border-dashed">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500/20" />
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <div key={s.id} className="ios-card group hover:bg-white/[0.04] transition-all border-white/5 relative overflow-hidden">
                {/* Background sync indicator */}
                {existingAttendance[s.id] && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                     <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl relative shadow-2xl ${
                        s.status === 'presente' ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5' : 
                        s.status === 'ausente' ? 'bg-red-500/10 text-red-400 shadow-red-500/5' :
                        s.status === 'justificado' ? 'bg-blue-500/10 text-blue-400 shadow-blue-500/5' :
                        'bg-amber-500/10 text-amber-400 shadow-amber-500/5'
                     }`}>
                        {s.nombre.charAt(0)}
                        {s.isModified && (
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#1c1c1e] flex items-center justify-center"
                          >
                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          </motion.div>
                        )}
                     </div>
                     <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                           <h4 className="text-[16px] md:text-[18px] font-bold text-white truncate leading-tight tracking-tight">{s.nombre}</h4>
                           {existingAttendance[s.id] && (
                             <Badge className="bg-emerald-500/10 text-emerald-400 text-[7px] md:text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5">Sincronizado</Badge>
                           )}
                           {s.isJustified && (
                             <Badge className="bg-blue-500/20 text-blue-400 text-[7px] md:text-[8px] font-black uppercase tracking-tighter border-none px-2 py-0.5">Justificado</Badge>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest leading-none">CI: {s.cedula}</span>
                           <div className="h-3 w-[1px] bg-white/10" />
                           <span className="text-[9px] font-black text-blue-500/60 uppercase leading-none">{s.seccion}</span>
                        </div>
                     </div>
                  </div>

                  {/* Selector de Estado - Responsive Grid */}
                  <div className="grid grid-cols-4 gap-2 bg-black/40 p-1.5 rounded-[1.25rem] w-full lg:w-80 shadow-inner">
                      {[
                        { id: 'presente', label: 'P', color: 'text-emerald-400', desc: 'Presente' },
                        { id: 'ausente', label: 'A', color: 'text-red-400', desc: 'Ausente' },
                        { id: 'justificado', label: 'J', color: 'text-blue-400', desc: 'Justificado' },
                        { id: 'retraso', label: 'T', color: 'text-amber-400', desc: 'Tardanza' }
                      ].map(opt => (
                       <button
                          key={opt.id}
                          disabled={(s.status === 'justificado' && opt.id !== 'justificado' && s.isJustified) || saving}
                          onClick={() => handleStatusChange(s.id, opt.id)}
                          className={`h-12 flex flex-col items-center justify-center rounded-xl transition-all relative ${
                             s.status === opt.id 
                               ? 'bg-white text-black shadow-xl scale-[1.03] z-10' 
                               : `text-[#86868b] hover:text-white/60 active:scale-95 ${s.status === 'justificado' && opt.id !== 'justificado' && s.isJustified ? 'opacity-20 cursor-not-allowed' : ''}`
                          }`}
                       >
                          <span className="text-[14px] font-black">{opt.label}</span>
                          <span className={`text-[7px] font-black uppercase tracking-tighter ${s.status === opt.id ? 'text-black/30' : 'text-white/5'}`}>{opt.desc}</span>
                       </button>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center shadow-xl">
                  <Search className="w-8 h-8 text-white/5" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 italic">Matrícula No Localizada</p>
                  <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Ajuste los filtros de búsqueda o verifique la base de datos</p>
                </div>
             </div>
           </div>
        </motion.div>

        {/* Persistent Notification */}
      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 md:bottom-10 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[200] px-8 py-5 rounded-[2rem] apple-glass border text-[11px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl ${
                msg.type === 'success' ? 'border-emerald-500/20 text-emerald-400' : 
                msg.type === 'error' ? 'border-red-500/20 text-red-400' :
                'border-blue-500/20 text-blue-400'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
             msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : 
             <Loader2 className="w-5 h-5 animate-spin" />}
            {msg.text}
            <button onClick={() => setMsg({ text: '', type: '' })} className="ml-auto p-2 hover:bg-white/5 rounded-full">
              <X className="w-4 h-4 opacity-40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AttendanceSheet;
