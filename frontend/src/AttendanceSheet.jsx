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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion?.includes(filterSection));

  if (loading) return (
    <div className="space-y-12">
        <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 apple-glass rounded-2xl animate-pulse" />)}
        </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6"
    >
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 sm:gap-12">
          <div className="space-y-2">
              <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <span className="text-[11px] text-[#86868b] font-medium tracking-wide">Control de Presencia</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                Asistencia
              </h2>
              <p className="text-sm text-[#86868b] font-normal max-w-md leading-relaxed">
                Registro diario de presencialidad estudiantil.
              </p>
          </div>

            <Button 
              onClick={handleSave}
              disabled={saving}
              className="h-20 sm:h-24 px-12 sm:px-16 bg-white text-black hover:bg-zinc-200 rounded-[2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] transition-all flex gap-6 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] active:scale-95 w-full xl:w-auto border border-white/10"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              {saving ? 'Sincronizando...' : 'Consolidar Registro Maestro'}
            </Button>
      </div>

      {/* Control Bar: Glassmorphism Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden group">
        <div className="lg:col-span-4 flex flex-col gap-4 relative z-10">
           <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Fecha de Sesión</span>
           <div className="flex items-center gap-6 bg-white/5 border border-white/5 rounded-[2rem] px-8 py-5 transition-all focus-within:bg-white/10 focus-within:border-emerald-500/30">
              <CalendarIcon className="w-5 h-5 text-emerald-500" />
              <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none text-white font-black text-xs sm:text-sm uppercase tracking-widest focus:ring-0 cursor-pointer w-full outline-none"
              />
           </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4 relative z-10">
           <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Filtrado por Cohorte / Año</span>
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 bg-white/5 p-2 rounded-[2rem] sm:rounded-full border border-white/5">
              {['Todas', '1ro', '2do', '3ro', '4to', '5to'].map((y) => (
                <button
                  key={y}
                  onClick={() => setFilterSection(y)}
                  className={`flex-1 px-8 py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    filterSection === y 
                      ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30' 
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {y} {y !== 'Todas' && (isMobile ? '' : 'Año')}
                </button>
              ))}
           </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Snapshot Cards: Micro Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
           { label: 'Tardanzas', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: FileText },
         ].map(stat => (
           <motion.div 
             key={stat.label} 
             whileHover={{ y: -5 }}
             className="bg-white/[0.02] border border-white/5 p-8 sm:p-10 rounded-[3rem] flex items-center justify-between group hover:bg-white/[0.04] transition-all duration-500"
           >
              <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5 shadow-xl`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] block">{stat.label}</span>
              </div>
              <div className={`text-4xl sm:text-5xl font-black italic tracking-tighter ${stat.color}`}>
                {stat.count}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Modern Attendance List: Tactical Interface */}
      <div className="space-y-6 sm:space-y-10">
        <div className="flex items-center gap-4 ml-6">
            <Users className="w-5 h-5 text-white/20" />
            <h3 className="text-xl font-black text-white/40 uppercase tracking-[0.4em] italic">Listado de Nodo Maestro</h3>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s, idx) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group relative rounded-[3.5rem] sm:rounded-[4rem] p-8 sm:p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-10"
              >
                <div className="flex items-center gap-8 sm:gap-12 flex-1 overflow-hidden">
                   <div className={`w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-[2rem] sm:rounded-[2.8rem] flex items-center justify-center transition-all bg-white/[0.03] border border-white/5 shadow-2xl ${
                      s.status === 'presente' ? 'text-emerald-400 border-emerald-500/20' : 
                      s.status === 'ausente' ? 'text-red-400 border-red-500/20' :
                      s.status === 'justificado' ? 'text-blue-400 border-blue-500/20' :
                      'text-amber-400 border-amber-500/20'
                   }`}>
                      {s.status === 'presente' ? <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12" /> : 
                       s.status === 'ausente' ? <XCircle className="w-8 h-8 sm:w-12 sm:h-12" /> : 
                       s.status === 'justificado' ? <FileText className="w-8 h-8 sm:w-12 sm:h-12" /> :
                       <Clock className="w-8 h-8 sm:w-12 sm:h-12" />}
                   </div>
                   
                   <div className="space-y-2 sm:space-y-4 overflow-hidden">
                       <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic truncate">{s.nombre}</h4>
                          {s.isJustified && (
                             <Badge className="bg-blue-500 text-white border-none rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] italic shadow-lg shadow-blue-500/30">PASE AUTORIZADO</Badge>
                          )}
                       </div>
                       <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                             <IdCard className="w-3.5 h-3.5 text-[#86868b]" />
                             <p className="text-[10px] sm:text-[11px] text-[#86868b] font-black uppercase tracking-[0.2em]">CI: {s.cedula}</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">{s.seccion}</Badge>
                       </div>
                   </div>
                </div>

                {/* Tactical Status Selector */}
                <div className="flex items-center gap-2 sm:gap-3 bg-black/40 p-2.5 sm:p-3 rounded-[2.5rem] sm:rounded-full border border-white/5 self-end lg:self-auto shadow-2xl">
                    {[
                      { id: 'presente', label: 'P', full: 'PRESENTE', color: 'hover:bg-emerald-500/10 hover:text-emerald-400' },
                      { id: 'ausente', label: 'A', full: 'AUSENTE', color: 'hover:bg-red-500/10 hover:text-red-400' },
                      { id: 'justificado', label: 'J', full: 'JUSTIFICADO', color: 'hover:bg-blue-500/10 hover:text-blue-400' },
                      { id: 'retraso', label: 'T', full: 'RETRASO', color: 'hover:bg-amber-500/10 hover:text-amber-400' }
                    ].map(opt => (
                     <button
                        key={opt.id}
                        disabled={s.status === 'justificado' && opt.id !== 'justificado'}
                        onClick={() => handleStatusChange(s.id, opt.id)}
                        className={`h-14 sm:h-16 px-6 sm:px-10 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 min-w-[60px] sm:min-w-[80px] ${
                           s.status === opt.id 
                             ? 'bg-white text-black shadow-[0_15px_30px_-10px_rgba(255,255,255,0.4)] scale-105' 
                             : `text-[#86868b] ${opt.color} ${s.status === 'justificado' && opt.id !== 'justificado' ? 'opacity-10 cursor-not-allowed' : 'hover:scale-105'}`
                        }`}
                     >
                        <span className="hidden xl:inline">{opt.full}</span>
                        <span className="xl:hidden">{opt.label}</span>
                     </button>
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </motion.div>
            ))
          ) : (
             <div className="py-52 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-30 space-y-10 bg-white/[0.01]">
                <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center border border-white/5">
                   <ClipboardCheck className="w-16 h-16" />
                </div>
                <div className="text-center space-y-3">
                   <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Silencio Operativo</h4>
                   <p className="text-[11px] font-black tracking-[0.4em] uppercase">Sin registros detectados en esta sesión</p>
                </div>
             </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-32 sm:bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0 z-[2000] w-[calc(100%-2rem)] sm:w-auto"
          >
             <div className="apple-glass p-8 rounded-[2.5rem] flex items-center gap-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                   {msg.type === 'success' ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>
                <div className="flex flex-col flex-1">
                   <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] italic">Sincronización de Núcleo</span>
                   <span className="text-lg font-black text-white mt-1 italic uppercase tracking-tighter">{msg.text}</span>
                </div>
                <button onClick={() => setMsg({text:'', type:''})} className="p-3 hover:bg-white/5 rounded-full transition-colors opacity-30 group">
                   <X className="w-6 h-6 group-hover:text-white" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-6 text-[#86868b] select-none opacity-20 pt-10">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] italic">Protocolo de Asistencia v30.0 — Andrés Bello</span>
      </div>
    </motion.div>
  );
};

export default AttendanceSheet;
