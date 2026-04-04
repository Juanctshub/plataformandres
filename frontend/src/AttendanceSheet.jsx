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
  Loader2
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";

const AttendanceSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-zinc-100 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-zinc-50 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-48 bg-zinc-100 rounded-2xl" />
        <Skeleton className="h-12 w-48 bg-zinc-100 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} className="h-24 w-full bg-white border border-zinc-100 rounded-[2.5rem]" />
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

      // Map students with status based on date and justifications
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
      setMsg({ text: 'Consolidación de asistencia exitosa', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    } catch (e) {
      setMsg({ text: 'Error de sincronización con el núcleo', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const sections = ['Todas', ...new Set(students.map(s => s.seccion))];
  const filteredStudents = students.filter(s => filterSection === 'Todas' || s.seccion === filterSection);

  if (loading) return <AttendanceSkeleton />;

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                <ClipboardCheck className="w-6 h-6 text-white" />
             </div>
             <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Control en Tiempo Real
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Pase de Lista</h2>
            <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
              Registro de asistencia diaria automatizado con interconexión al departamento de justificaciones.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 bg-white border border-zinc-100 rounded-[2rem] p-2 pl-6 shadow-sm group">
                <CalendarIcon className="w-4.5 h-4.5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none text-zinc-900 font-black uppercase text-[11px] tracking-widest focus:ring-0 p-1 cursor-pointer"
                />
            </div>
            
            <div className="bg-white border border-zinc-100 rounded-[2.2rem] p-2 flex gap-2 shadow-sm">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${
                            filterSection === sec 
                                ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-900/10' 
                                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        {sec}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Stats Summary for Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'Presentes', count: filteredStudents.filter(s => s.status === 'presente').length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'Ausentes', count: filteredStudents.filter(s => s.status === 'ausente').length, color: 'text-red-500', bg: 'bg-red-50' },
           { label: 'Retrasos', count: filteredStudents.filter(s => s.status === 'retraso').length, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Justificados', count: filteredStudents.filter(s => s.status === 'justificado').length, color: 'text-blue-500', bg: 'bg-blue-50' },
         ].map(stat => (
           <div key={stat.label} className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center justify-between shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{stat.label}</span>
              <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center font-black text-sm`}>
                {stat.count}
              </div>
           </div>
         ))}
      </div>

      {/* Attendance List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-zinc-100/50 rounded-[4rem] p-12 flex flex-col xl:flex-row xl:items-center justify-between gap-12 group hover:shadow-2xl hover:border-black transition-all duration-1000"
            >
              <div className="flex items-center gap-12">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden ${
                  s.status === 'presente' ? 'bg-black text-white' : 
                  s.status === 'ausente' ? 'bg-red-600 text-white' :
                  s.status === 'justificado' ? 'bg-zinc-400 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {s.status === 'presente' ? <CheckCircle2 className="w-14 h-14" /> : 
                   s.status === 'ausente' ? <XCircle className="w-14 h-14" /> : 
                   s.status === 'justificado' ? <FileText className="w-14 h-14" /> :
                   <Clock className="w-14 h-14" />}
                </div>
                
                <div>
                  <h3 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">{s.nombre}</h3>
                  <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                      <IdCard className="w-5 h-5 text-zinc-300" />
                      <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{s.cedula}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-zinc-300" />
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Sección {s.seccion}</span>
                    </div>
                    {s.isJustified && (
                        <Badge className="bg-black text-white border-none rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-widest">Validado</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 bg-zinc-50 p-3 rounded-[3rem] border border-zinc-100">
                {[
                  { id: 'presente', icon: CheckCircle2, label: 'Si', color: 'black' },
                  { id: 'ausente', icon: XCircle, label: 'Llamar', color: 'red-600' },
                  { id: 'justificado', icon: FileText, label: 'Exento', color: 'zinc-400' },
                  { id: 'retraso', icon: Clock, label: 'Tarde', color: 'amber-500' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    disabled={s.status === 'justificado' && opt.id !== 'justificado'}
                    onClick={() => handleStatusChange(s.id, opt.id)}
                    className={`h-20 px-10 rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all duration-700 flex items-center gap-4 ${
                      s.status === opt.id 
                        ? `bg-black text-white shadow-2xl scale-105` 
                        : 'bg-transparent text-zinc-300 hover:text-black'
                    }`}
                  >
                    <opt.icon className={`w-6 h-6`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-100 rounded-[5rem] space-y-8 opacity-20">
               <Users className="w-24 h-24 text-zinc-300" />
               <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400">Sin registros en esta sección</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-6 h-[72px]">
        <AnimatePresence>
          {msg.text && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-6 rounded-3xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
              } h-16 w-max absolute bottom-24 right-0`}
            >
              <Check className="w-5 h-5" />
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-20 px-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] flex gap-6"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          Consolidar Asistencia del Día
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
        <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocolo de Verificación Dual</span>
        </div>
        <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Andrés Bello • Núcleo v10.0</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
