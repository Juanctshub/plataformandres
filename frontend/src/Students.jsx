import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus,
  User as UserIcon,
  ChevronRight,
  GraduationCap,
  IdCard,
  Phone,
  Building2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileSpreadsheet,
  Upload,
  Download,
  Loader2,
  X
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./components/ui/dialog";
import { Skeleton } from "./components/ui/skeleton";
import * as XLSX from 'xlsx';

const StudentsSkeleton = () => (
  <div className="space-y-16 pb-20">
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
      <div className="space-y-6">
        <Skeleton className="h-12 w-80 bg-white/5 rounded-2xl" />
        <Skeleton className="h-4 w-64 bg-white/[0.02] rounded-lg" />
      </div>
      <div className="flex items-center gap-6">
        <Skeleton className="h-16 w-[400px] bg-white/5 rounded-2xl" />
        <Skeleton className="h-16 w-48 bg-white/10 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-[450px] w-full bg-[#1C1C1E] border border-white/5 rounded-[3rem]" />
      ))}
    </div>
  </div>
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  
  const [newStudent, setNewStudent] = useState({ 
    cedula: '', 
    nombre: '', 
    seccion: '', 
    representante: '', 
    contacto: '' 
  });

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching students:', e);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cedula?.includes(searchTerm) ||
    s.seccion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Estudiante inscrito exitosamente', type: 'success' });
        setNewStudent({ cedula: '', nombre: '', seccion: '', representante: '', contacto: '' });
        fetchStudents();
        setTimeout(() => setIsAddModalOpen(false), 1500);
      } else {
        setMsg({ text: data.error || 'Error al inscribir', type: 'error' });
      }
    } catch (e) { 
      setMsg({ text: 'Error de conexión con el servidor', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        let successCount = 0;
        let errorCount = 0;

        for (const row of data) {
          const payload = {
            nombre: row.Nombre || row.nombre || row.STUDENT || '',
            cedula: String(row.Cedula || row.cedula || row.ID || ''),
            seccion: row.Seccion || row.seccion || row.GRADE || '',
            representante: row.Representante || row.representante || '',
            contacto: String(row.Contacto || row.contacto || '')
          };

          if (!payload.nombre || !payload.cedula || !payload.seccion) continue;

          try {
            const res = await fetch(`${baseUrl}/api/estudiantes`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(payload)
            });
            if (res.ok) successCount++;
            else errorCount++;
          } catch (err) {
            errorCount++;
          }
        }

        setMsg({ 
          text: `Carga Pro finalizada: ${successCount} registros activos.`, 
          type: successCount > 0 ? 'success' : 'error' 
        });
        fetchStudents();
      } catch (err) {
        setMsg({ text: 'Incompatibilidad en el flujo de datos Excel', type: 'error' });
      } finally {
        setBulkLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setMsg({ text: '', type: '' }), 5000);
      }
    };

    reader.readAsBinaryString(file);
  };

  if (loading) return <StudentsSkeleton />;

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-6">
                <Users className="w-6 h-6 text-black" />
             </div>
             <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Núcleo de Matrícula v14.0
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase">Expediente Digital</h2>
            <p className="text-white/40 font-bold tracking-tight text-lg max-w-2xl leading-relaxed">
              Administración de alta disponibilidad para la población académica. 
              <span className="block mt-2 text-[#0A84FF] select-none">Sincronizado con el Protocolo Apple Pro.</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#0A84FF] transition-colors" />
            <Input 
              placeholder="Buscar CI, Nombre o Sección..." 
              className="pl-14 h-16 w-[420px] bg-[#1C1C1E] border-white/5 rounded-2xl shadow-2xl focus:ring-1 focus:ring-[#0A84FF]/40 placeholder:text-white/10 font-bold text-xs uppercase tracking-widest text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleExcelImport} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />

          <Button 
            onClick={() => fileInputRef.current.click()}
            disabled={bulkLoading}
            className="h-16 px-8 bg-[#2C2C2E] border border-white/5 text-white/40 hover:bg-[#3A3A3C] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex gap-4 active:scale-95 shadow-xl"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#0A84FF]" /> : <FileSpreadsheet className="w-5 h-5" />}
            Corte Excel
          </Button>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex gap-4 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Alta Matrícula
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white rounded-[3rem] p-16 max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
              <DialogHeader className="mb-12">
                <DialogTitle className="text-5xl font-black tracking-tighter text-white uppercase italic">Inscripción Pro</DialogTitle>
                <DialogDescription className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] mt-4">Registro en el Núcleo v14.0 • Apple Pro Style</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Identidad (CI)</label>
                    <Input 
                        className="bg-black border-white/5 h-16 rounded-2xl focus:ring-1 focus:ring-[#0A84FF] text-white font-black text-lg uppercase" 
                        placeholder="V-000.000"
                        value={newStudent.cedula}
                        onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                        required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Sección / Grado</label>
                    <Input 
                        className="bg-black border-white/5 h-16 rounded-2xl focus:ring-1 focus:ring-[#0A84FF] text-white font-black text-lg uppercase" 
                        placeholder="Ej: 5A"
                        value={newStudent.seccion}
                        onChange={(e) => setNewStudent({...newStudent, seccion: e.target.value})}
                        required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Apellidos y Nombres</label>
                  <Input 
                    className="bg-black border-white/5 h-20 rounded-2xl focus:ring-2 focus:ring-[#0A84FF]/20 text-white text-2xl font-black uppercase tracking-tighter italic" 
                    placeholder="NOMBRE COMPLETO"
                    value={newStudent.nombre}
                    onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Representante</label>
                    <Input 
                        className="bg-black border-white/5 h-16 rounded-2xl focus:ring-1 focus:ring-[#0A84FF]/20 text-white font-bold" 
                        value={newStudent.representante}
                        onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                    />
                    </div>
                    <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Contacto Pro</label>
                    <Input 
                        className="bg-black border-white/5 h-16 rounded-2xl focus:ring-1 focus:ring-[#0A84FF]/20 text-white font-bold" 
                        placeholder="+58 ..."
                        value={newStudent.contacto}
                        onChange={(e) => setNewStudent({...newStudent, contacto: e.target.value})}
                    />
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black mt-8 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-white/5"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sincronizar con el Núcleo"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed bottom-12 right-12 z-[100]"
          >
             <div className={`p-8 rounded-[2.5rem] border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-6 ${
               msg.type === 'success' ? 'bg-[#1C1C1E] border-emerald-500/20 text-emerald-400' : 'bg-[#18181B] border-red-500/20 text-red-400'
             }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {msg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Respuesta del Núcleo</span>
                  <span className="text-sm font-black uppercase tracking-tight mt-1">{msg.text}</span>
                </div>
                <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-2 hover:bg-white/5 rounded-full transition-colors">
                   <X className="w-4 h-4 opacity-20 hover:opacity-100" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => (
          <motion.div 
            key={student.id || idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -15 }}
            className="group relative"
          >
            <div className="stat-card-pro h-full border-white/5 hover:border-white/20">
              <div className="flex justify-between items-start mb-16">
                <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center text-white/10 group-hover:bg-white group-hover:text-black transition-all duration-700 shadow-2xl">
                  <UserIcon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-end gap-5">
                  <Badge className="bg-white text-black border-none font-black text-[11px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-2xl shadow-xl">
                    {student.seccion}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Expediente ID {student.id?.toString().slice(-4)}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mb-16">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Estudiante Matriculado</p>
                   <h3 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic transition-all group-hover:translate-x-2">{student.nombre}</h3>
                </div>
                <div className="flex items-center gap-4 bg-white/5 w-fit px-5 py-2.5 rounded-xl border border-white/5">
                    <IdCard className="w-4 h-4 text-white/20" />
                    <p className="text-[10px] font-black text-white tracking-[0.2em] uppercase">CI {student.cedula}</p>
                </div>
              </div>
              
              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-white/5">
                      <Building2 className="w-4.5 h-4.5 text-white/20" />
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Titular</span>
                  </div>
                  <span className="text-[11px] font-black text-white uppercase tracking-tighter bg-white/5 px-4 py-2 rounded-lg">{student.representante || 'CARGA PENDIENTE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-white/5">
                      <Phone className="w-4.5 h-4.5 text-white/20" />
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Canal Pro</span>
                  </div>
                  <span className="text-[11px] font-black text-white tracking-widest opacity-80">{student.contacto || 'N/A'}</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.01] rounded-full -mr-24 -mt-24 blur-3xl transition-all group-hover:bg-white/[0.03]" />
            </div>
          </motion.div>
        )) : (
            <div className="col-span-full py-64 flex flex-col items-center justify-center space-y-12 select-none apple-pro-card border-dashed border-white/5 bg-transparent">
                <div className="w-40 h-40 rounded-[3rem] border border-white/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                  <Users className="w-16 h-16 text-white/10 relative z-10" strokeWidth={1} />
                </div>
                <div className="text-center space-y-4">
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.8em] italic">Núcleo Offline</p>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                    No se han identificado registros técnicos bajo los parámetros de búsqueda actuales.
                  </p>
                </div>
            </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32">
        <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Protocolo de Datos Apple Pro v14.0</span>
        </div>
        <div className="flex items-center gap-4">
            <IdCard className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Consolidación Digital de Matrícula</span>
        </div>
      </div>
    </div>
  );
};

export default Students;
