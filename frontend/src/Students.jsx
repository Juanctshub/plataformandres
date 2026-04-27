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
  X,
  ArrowRight,
  UserPlus,
  Target,
  Activity,
  Zap,
  Bot
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
import * as XLSX from 'xlsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
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
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = Array.isArray(students) ? students.filter(s => 
    ((s.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
     (s.cedula || '').includes(searchTerm) ||
     (s.seccion?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Todos' || (s.seccion || '').includes(activeFilter))
  ) : [];

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
      if (res.ok) {
        setMsg({ text: 'Estudiante inscrito en el Núcleo Maestro', type: 'success' });
        setIsAddModalOpen(false);
        setNewStudent({ cedula: '', nombre: '', seccion: '', representante: '', contacto: '' });
        fetchStudents();
      } else {
        const d = await res.json();
        setMsg({ text: d.msg || 'Error en inscripción', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error fatal de conexión', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setMsg({ text: 'Registro eliminado del historial', type: 'success' });
        setIsDeleteModalOpen(false);
        fetchStudents();
      }
    } catch (e) { console.error(e); }
    finally { setTimeout(() => setMsg({ text: '', type: '' }), 4000); }
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
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const token = localStorage.getItem('token');
        for (const row of data) {
           await fetch(`${baseUrl}/api/estudiantes`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
             body: JSON.stringify({
               cedula: row.Cedula || row.CI || '',
               nombre: row.Nombre || row.Estudiante || '',
               seccion: row.Seccion || row.Grado || '',
               representante: row.Representante || '',
               contacto: row.Contacto || row.Telefono || ''
             })
           });
        }
        setMsg({ text: 'Matrícula Masiva Procesada', type: 'success' });
        fetchStudents();
      } catch (e) { setMsg({ text: 'Error en procesamiento Excel', type: 'error' }); }
      finally { setBulkLoading(false); }
    };
    reader.readAsBinaryString(file);
  };

  const sections = ['Todos', '1ro', '2do', '3ro', '4to', '5to'];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">Sincronizando Matrícula...</p>
    </div>
  );

  return (
    <div className="space-y-16 py-6 relative">
      {/* 🛎️ NOTIFICACIÓN FLOTANTE (TOAST) 🛎️ */}
      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-32 left-1/2 z-[10000] px-10 py-5 rounded-[2rem] apple-glass border font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-4 ${
              msg.type === 'success' ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search and Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] apple-glass shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
         <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
            <div className="relative flex-1 max-w-lg group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
               <Input 
                  placeholder="Filtrar por Nombre, CI o Sección..." 
                  className="pl-16 h-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-white text-base font-medium focus:ring-1 focus:ring-blue-500/50 placeholder:text-[#86868b]/40 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[1.5rem] border border-white/5">
               {sections.map(s => (
                  <button
                     key={s}
                     onClick={() => setActiveFilter(s)}
                     className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeFilter === s 
                        ? 'bg-white text-black shadow-xl' 
                        : 'text-[#86868b] hover:text-white hover:bg-white/5'
                     }`}
                  >
                     {s}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex items-center gap-4">
            <Button 
               onClick={() => fileInputRef.current?.click()}
               variant="ghost"
               className="h-16 px-8 rounded-[1.8rem] bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/10 gap-3 font-black text-[10px] uppercase tracking-widest transition-all"
            >
               {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
               Importar Excel
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelImport} />
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="h-16 px-10 rounded-[1.8rem] bg-blue-600 text-white hover:bg-blue-500 shadow-2xl shadow-blue-600/30 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 gap-3 border border-blue-400/20">
                     <UserPlus className="w-5 h-5" />
                     Inscribir Alumno
                  </Button>
                </DialogTrigger>
                <DialogContent className="apple-glass border-white/10 rounded-[3.5rem] p-12 max-w-2xl bg-black/95 backdrop-blur-[100px] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] z-[9999]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none rounded-[3.5rem]" />
                  <DialogHeader className="mb-12 relative z-10">
                     <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 mb-6">
                        <UserPlus className="w-8 h-8" />
                     </div>
                     <DialogTitle className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Nueva Matrícula</DialogTitle>
                     <DialogDescription className="text-blue-400/60 font-black uppercase tracking-[0.3em] text-[8px] mt-3">Protocolo de Identidad Institucional v27.2</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3 group">
                           <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Identidad (CI)</label>
                           <Input 
                              placeholder="V-00.000.000"
                              className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                              value={newStudent.cedula}
                              onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                              required
                           />
                        </div>
                        <div className="space-y-3 group">
                           <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Sección Académica</label>
                           <Input 
                              placeholder="Ej: 5to Año A"
                              className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                              value={newStudent.seccion}
                              onChange={(e) => setNewStudent({...newStudent, seccion: e.target.value})}
                              required
                           />
                        </div>
                     </div>
                     <div className="space-y-3 group">
                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Nombre Completo del Estudiante</label>
                        <Input 
                           placeholder="Nombres y Apellidos del alumno"
                           className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                           value={newStudent.nombre}
                           onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                           required
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3 group">
                           <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Representante Legal</label>
                           <Input 
                              placeholder="Nombre del Padre/Madre"
                              className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                              value={newStudent.representante}
                              onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                           />
                        </div>
                        <div className="space-y-3 group">
                           <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Canal de Contacto</label>
                           <Input 
                              placeholder="+58 4XX..."
                              className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                              value={newStudent.contacto}
                              onChange={(e) => setNewStudent({...newStudent, contacto: e.target.value})}
                           />
                        </div>
                     </div>
                     <Button type="submit" disabled={submitting} className="w-full h-18 bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98] mt-4">
                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ejecutar Inscripción Institucional"}
                     </Button>
                  </form>
                </DialogContent>
            </Dialog>
         </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex items-center justify-between px-6">
         <div className="flex items-center gap-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Registros de Matrícula</h4>
            <Badge className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1 text-[10px] font-black uppercase">
               {filteredStudents.length} Alumnos Sincronizados
            </Badge>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
               <Database className="w-3 h-3 text-emerald-400" />
               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Base de Datos Unificada</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#86868b]" />
            <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Sincronización en Tiempo Real Activa</span>
         </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, i) => (
              <motion.div
                key={student.id || i}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.03, type: 'spring', damping: 20, stiffness: 100 }}
                className="group relative overflow-hidden rounded-[3.5rem] p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]"
              >
                 {/* ID Badge Floating */}
                 <div className="absolute top-10 right-10">
                    <Badge className="bg-white/5 group-hover:bg-blue-500 group-hover:text-white text-[#86868b] border border-white/5 rounded-2xl px-6 py-2 text-[11px] font-black tracking-tighter uppercase transition-all duration-700">
                       {student.seccion}
                    </Badge>
                 </div>

                 <div className="flex items-center gap-8 mb-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-blue-600/10 group-hover:text-blue-500 group-hover:border-blue-500/20 transition-all duration-700 relative overflow-hidden shadow-2xl">
                       <UserIcon className="w-10 h-10 relative z-10" strokeWidth={1.5} />
                       {/* Subtle animated overlay */}
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                       />
                    </div>
                    <div className="space-y-1">
                        <Badge className={`${student.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-none px-3 py-0.5 text-[8px] uppercase font-black tracking-[0.2em] mb-2`}>
                           {student.solvente ? 'SOLVENTE ✓' : 'DEUDA ⚠️'}
                        </Badge>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none group-hover:text-blue-400 transition-colors">{student.nombre}</h3>
                    </div>
                 </div>

                <div className="space-y-8 mb-16">
                   <div className="flex items-center justify-between p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-4">
                         <IdCard className="w-5 h-5 text-blue-500/50" />
                         <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Identidad Central</span>
                      </div>
                      <span className="text-sm font-bold text-white tracking-widest">{student.cedula}</span>
                   </div>
                </div>

                <div className="pt-12 border-t border-white/5 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Target className="w-4 h-4 text-white/20" />
                         <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">Titular Maestro</span>
                      </div>
                      <span className="text-[11px] font-bold text-white/80">{student.representante || 'Sin Asignar'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Phone className="w-4 h-4 text-white/20" />
                         <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Enlace de Red</span>
                      </div>
                      <span className="text-[11px] font-bold text-white/80 italic">{student.contacto || 'Pendiente'}</span>
                   </div>
                </div>

                {/* Professional Actions */}
                <div className="absolute bottom-6 right-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
                    <Button 
                       onClick={() => { setStudentToDelete(student); setIsDeleteModalOpen(true); }}
                       variant="ghost" 
                       className="h-10 w-10 p-0 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"
                    >
                       <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button 
                       variant="ghost" 
                       className="h-10 px-6 rounded-xl bg-white/5 text-white hover:bg-white hover:text-black transition-all shadow-xl"
                    >
                       <span className="text-[9px] font-black uppercase tracking-widest">Ficha Maestra</span>
                    </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
            >
               <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-white/20 mx-auto">
                  <Bot className="w-12 h-12" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sin Resultados en el Nodo</h3>
                  <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest">El Núcleo de Inteligencia no detectó identidades con el parámetro "{searchTerm}"</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="apple-glass border-red-500/20 rounded-[3rem] p-10 max-w-md bg-black/90 shadow-[0_50px_100px_-20px_rgba(255,0,0,0.2)]">
            <DialogHeader className="text-center space-y-6">
                <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20 animate-pulse">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div>
                   <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Eliminar Registro</DialogTitle>
                   <DialogDescription className="text-red-400/60 font-bold uppercase tracking-widest text-[9px] mt-3">Esta acción es definitiva y quedará registrada en la bitácora.</DialogDescription>
                </div>
            </DialogHeader>
            <div className="py-10 text-center">
                <p className="text-sm font-medium text-[#86868b]">¿Confirmar la eliminación de la identidad de <span className="text-white font-black">{studentToDelete?.nombre}</span>?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#86868b] hover:text-white">Cancelar</Button>
                <Button onClick={() => handleDelete(studentToDelete.id)} className="h-14 rounded-2xl bg-red-600 text-white hover:bg-red-500 font-black text-[10px] uppercase tracking-widest shadow-2xl">Confirmar Borrado</Button>
            </div>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
