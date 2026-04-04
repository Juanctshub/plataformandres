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
  X
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";

const AttendanceSkeleton = () => (
  <div className="space-y-16 pb-20">
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
      <div className="space-y-6">
        <Skeleton className="h-12 w-80 bg-white/5 rounded-2xl" />
        <Skeleton className="h-4 w-64 bg-white/[0.02] rounded-lg" />
      </div>
      <div className="flex items-center gap-6">
        <Skeleton className="h-16 w-64 bg-white/5 rounded-2xl" />
        <Skeleton className="h-16 w-96 bg-white/5 rounded-full" />
      </div>
    </div>
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} className="h-28 w-full bg-[#1C1C1E] border border-white/5 rounded-[2.5rem]" />
      ))}
    </div>
  </div>
);

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

      setJustifications(justData);

      const mappedStudents = stdData.map(s => {
        const hasJustification = justData.find(j => 
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
      setTimeout(() => setLoading(false), 800);
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
      setMsg({ text: 'Sincronización de asistencia exitosa', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    } catch (e) {
      setMsg({ text: 'Fallo crítico en el enlace de datos', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const sections = ['Todas', ...new Set(students.map(s => s.seccion))];
  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion === filterSection);

  if (loading) return <AttendanceSkeleton />;

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-6">
                <ClipboardCheck className="w-6 h-6 text-black" />
             </div>
             <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Protocolo de Asistencia v14.0
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Pase de Lista</h2>
            <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
              Consolidación técnica de presencia académica • Enlace directo con el Núcleo de Justificativos.
              <span className="block mt-2 text-[#32D74B] select-none italic">Sincronización en tiempo real habilitada.</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-5 bg-[#1C1C1E] border border-white/5 rounded-[1.75rem] p-3 pl-8 shadow-2xl group transition-all hover:border-white/20">
                <CalendarIcon className="w-4.5 h-4.5 text-white/20 group-hover:text-[#0A84FF] transition-colors" />
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none text-white font-black uppercase text-[11px] tracking-[0.2em] focus:ring-0 p-1 cursor-pointer"
                />
            </div>
            
            <div className="bg-[#1C1C1E] border border-white/5 rounded-[2rem] p-2 flex gap-1 shadow-2xl overflow-hidden">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 flex items-center gap-2 ${
                            filterSection === sec 
                                ? 'bg-white text-black shadow-2xl scale-105' 
                                : 'text-white/20 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {filterSection === sec && <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                        {sec}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Analytics Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]/10', border: 'border-[#32D74B]/20' },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-[#FF453A]', bg: 'bg-[#FF453A]/10', border: 'border-[#FF453A]/20' },
           { label: 'Tarde', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]/10', border: 'border-[#FFD60A]/20' },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-[#0A84FF]', bg: 'bg-[#0A84FF]/10', border: 'border-[#0A84FF]/20' },
         ].map(stat => (
           <div key={stat.label} className="bg-[#1C1C1E] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between shadow-xl group hover:border-white/10 transition-all cursor-default">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.label}</span>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} ${stat.border} border flex items-center justify-center font-black text-lg shadow-2xl transition-transform group-hover:scale-110`}>
                {stat.count}
              </div>
           </div>
         ))}
      </div>

      {/* Attendance Table Pro */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="apple-pro-card p-8 group flex flex-col xl:flex-row xl:items-center justify-between gap-12 hover:border-white/20"
            >
              <div className="flex items-center gap-12">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden bg-black/40 border border-white/5 group-hover:scale-105 ${
                  s.status === 'presente' ? 'text-[#32D74B]' : 
                  s.status === 'ausente' ? 'text-[#FF453A]' :
                  s.status === 'justificado' ? 'text-[#0A84FF]' :
                  'text-[#FFD60A]'
                }`}>
                  {s.status === 'presente' ? <CheckCircle2 className="w-10 h-10" /> : 
                   s.status === 'ausente' ? <XCircle className="w-10 h-10" /> : 
                   s.status === 'justificado' ? <FileText className="w-10 h-10" /> :
                   <Clock className="w-10 h-10" />}
                   
                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sección {s.seccion}</p>
                     {s.isJustified && (
                        <Badge className="bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 rounded-full px-5 py-1 font-black text-[8px] uppercase tracking-widest italic animate-pulse">Justificado Pro</Badge>
                     )}
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-2 transition-transform duration-500">{s.nombre}</h3>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                      <IdCard className="w-4 h-4 text-white/10" />
                      <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">{s.cedula}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-white/10" />
                        <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Registro Digital</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 bg-black/40 p-2.5 rounded-[2.25rem] border border-white/5 shadow-inner">
                {[
                  { id: 'presente', icon: CheckCircle2, label: 'Si', color: 'text-[#32D74B]' },
                  { id: 'ausente', icon: XCircle, label: 'No', color: 'text-[#FF453A]' },
                  { id: 'justificado', icon: FileText, label: 'Exento', color: 'text-[#0A84FF]' },
                  { id: 'retraso', icon: Clock, label: 'Tarde', color: 'text-[#FFD60A]' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    disabled={s.status === 'justificado' && opt.id !== 'justificado'}
                    onClick={() => handleStatusChange(s.id, opt.id)}
                    className={`h-16 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-700 flex items-center gap-4 relative group/btn ${
                      s.status === opt.id 
                        ? `bg-white text-black shadow-2xl scale-105 border-none` 
                        : 'bg-transparent text-white/20 hover:text-white hover:bg-white/5'
                    } ${s.status === 'justificado' && opt.id !== 'justificado' ? 'opacity-10 cursor-not-allowed' : ''}`}
                  >
                    <opt.icon className={`w-5 h-5 ${s.status === opt.id ? 'text-black' : opt.color}`} strokeWidth={2.5} />
                    {opt.label}
                    {s.status === opt.id && (
                        <motion.div layoutId={`btn-active-${s.id}`} className="absolute inset-0 bg-white rounded-2xl -z-10 shadow-[0_10px_20px_rgba(255,255,255,0.15)]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center py-56 border-2 border-dashed border-white/5 rounded-[5rem] space-y-12 opacity-10 select-none bg-transparent">
               <ClipboardCheck className="w-24 h-24 text-white" strokeWidth={1} />
               <div className="text-center space-y-3">
                  <p className="text-[12px] font-black uppercase tracking-[0.8em] text-white italic">Núcleo Escaneado</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">No hay registros activos en la sesión actual</p>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button Noir */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-8 h-[80px]">
        <AnimatePresence>
          {msg.text && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-32 right-0"
            >
               <div className={`p-8 rounded-[2.5rem] border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex items-center gap-6 ${
                 msg.type === 'success' ? 'bg-[#1C1C1E] border-emerald-500/20 text-emerald-400' : 'bg-[#1C1C1E] border-red-500/20 text-red-400'
               }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {msg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Notificación del Núcleo</span>
                    <span className="text-sm font-black uppercase tracking-tight mt-1">{msg.text}</span>
                  </div>
                  <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                     <X className="w-4 h-4 opacity-30 hover:opacity-100" />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-20 px-16 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_30px_70px_rgba(255,255,255,0.1)] flex gap-8 group"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-125 transition-transform" />}
          Consolidar Registro del Día
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32">
        <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Protocolo de Integridad Pro Dark</span>
        </div>
        <div className="flex items-center gap-4">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Andrés Bello • Terminal v14.0</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
