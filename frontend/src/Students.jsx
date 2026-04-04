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
  Loader2
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
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-zinc-100 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-zinc-50 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-[300px] bg-zinc-100 rounded-2xl" />
        <Skeleton className="h-12 w-40 bg-zinc-900 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} className="h-[320px] w-full bg-white border border-zinc-100 rounded-[2.5rem]" />
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
          // Normalize keys (Nombre, Cedula, Seccion, Representante, Contacto)
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
          text: `Importación finalizada: ${successCount} exitosos, ${errorCount} fallidos.`, 
          type: successCount > 0 ? 'success' : 'error' 
        });
        fetchStudents();
      } catch (err) {
        setMsg({ text: 'Error al procesar el archivo Excel', type: 'error' });
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
    <div className="space-y-12 pb-20 relative">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                <Users className="w-6 h-6 text-white" />
             </div>
             <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Media General • 2026
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none">Matrícula Escolar</h2>
            <p className="text-zinc-400 font-bold tracking-tight text-lg">
              Administración centralizada de la población estudiantil y registros académicos.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
            <Input 
              placeholder="Buscar por nombre, CI o grado..." 
              className="pl-12 h-14 w-[340px] bg-white border-zinc-100 rounded-2xl shadow-sm focus:ring-1 focus:ring-zinc-200 placeholder:text-zinc-300 font-bold text-xs uppercase tracking-widest text-zinc-900"
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
            className="h-14 px-8 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4.5 h-4.5" />}
            Importar Excel
          </Button>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10">
                <Plus className="w-5 h-5" />
                Matricular Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none text-zinc-900 rounded-[3rem] p-12 max-w-xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.15)]">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Nuevo Estudiante</DialogTitle>
                <DialogDescription className="text-zinc-400 font-bold text-sm mt-3">Registro oficial en el núcleo administrativo v10.0</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Identidad (CI)</label>
                    <Input 
                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl focus:ring-1 focus:ring-zinc-200 text-zinc-900 font-bold" 
                        placeholder="V-00000000"
                        value={newStudent.cedula}
                        onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                        required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Sección / Año</label>
                    <Input 
                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl focus:ring-1 focus:ring-zinc-200 text-zinc-900 font-bold" 
                        placeholder="Ej: 5to A"
                        value={newStudent.seccion}
                        onChange={(e) => setNewStudent({...newStudent, seccion: e.target.value})}
                        required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Apellidos y Nombres</label>
                  <Input 
                    className="bg-zinc-50 border-zinc-100 h-16 rounded-2xl focus:ring-1 focus:ring-zinc-200 text-zinc-900 text-xl font-black uppercase tracking-tight" 
                    value={newStudent.nombre}
                    onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Representante Legal</label>
                    <Input 
                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl focus:ring-1 focus:ring-zinc-200 text-zinc-900 font-bold" 
                        value={newStudent.representante}
                        onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                    />
                    </div>
                    <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Contacto Emergencia</label>
                    <Input 
                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl focus:ring-1 focus:ring-zinc-200 text-zinc-900 font-bold" 
                        placeholder="+58 ..."
                        value={newStudent.contacto}
                        onChange={(e) => setNewStudent({...newStudent, contacto: e.target.value})}
                    />
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black mt-4 transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/10"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Consolidar Inscripción"}
                </Button>

                <AnimatePresence>
                    {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-6 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest ${
                        msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}
                    >
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {msg.text}
                    </motion.div>
                    )}
                </AnimatePresence>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AnimatePresence>
        {msg.text && !isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-6 rounded-[2rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] border shadow-xl ${
              msg.type === 'success' ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-red-100 text-red-600'
            }`}
          >
             {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
             {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => (
          <motion.div 
            key={student.id || idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -10 }}
            className="apple-card p-12 group cursor-default"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-700 shadow-sm">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-zinc-950 text-white border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-xl">
                  {student.seccion}
                </Badge>
                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Activo 2026</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-12">
              <h3 className="text-3xl font-black text-zinc-900 leading-tight tracking-tight uppercase group-hover:underline decoration-zinc-100 decoration-4 underline-offset-8 transition-all">{student.nombre}</h3>
              <p className="text-[10px] font-black text-zinc-300 tracking-[0.3em] uppercase pl-1">CI: {student.cedula}</p>
            </div>
            
            <div className="pt-10 border-t border-zinc-50 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-3.5 h-3.5 text-zinc-200" />
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Representante</span>
                </div>
                <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">{student.representante || 'PENDIENTE'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-3.5 h-3.5 text-zinc-200" />
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Contacto</span>
                </div>
                <span className="text-xs font-black text-zinc-900">{student.contacto || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        )) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-8 opacity-20 select-none">
                <div className="w-24 h-24 rounded-full border-[3px] border-dashed border-zinc-200 flex items-center justify-center">
                  <Filter className="w-10 h-10 text-zinc-200" />
                </div>
                <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.4em]">No se identificaron registros en la sección actual</p>
            </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
        <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Archivo Digital Consolidado</span>
        </div>
        <div className="flex items-center gap-3">
            <IdCard className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Cédula Escolar v10.5</span>
        </div>
      </div>
    </div>
  );
};

export default Students;
