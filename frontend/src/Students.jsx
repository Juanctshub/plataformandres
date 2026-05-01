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
  Bot,
  Database
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
        window.dispatchEvent(new Event('refresh-dashboard'));
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
        window.dispatchEvent(new Event('refresh-dashboard'));
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
        window.dispatchEvent(new Event('refresh-dashboard'));
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
    <div className="max-w-[1600px] mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6">
        {/* Header: Institutional Command Center */}
        <div className="flex flex-col gap-10 sm:gap-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10">
                <div className="space-y-4 sm:space-y-6">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-5 group"
                    >
                        <div className="w-1.5 h-10 bg-blue-600 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                        <div className="space-y-2">
                            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                              Matrícula
                            </h2>
                            <p className="text-sm text-[#86868b] font-normal max-w-md leading-relaxed">
                              Registro y gestión de identidades estudiantiles.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Button 
                       onClick={() => fileInputRef.current?.click()}
                       variant="ghost"
                       className="h-14 sm:h-16 px-6 sm:px-10 rounded-[1.8rem] sm:rounded-[2rem] bg-white/[0.03] border border-white/5 text-[#86868b] hover:text-white hover:bg-white/10 flex items-center gap-4 transition-all"
                    >
                       {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Sincronizar Excel</span>
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelImport} />
                    
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-14 sm:h-16 px-8 sm:px-12 bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 group"
                    >
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        Nueva Admisión
                    </Button>
                </div>
            </div>

            {/* Control Bar: Refined for Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                <div className="lg:col-span-7 relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        placeholder="Buscar identidad, sección o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-16 sm:h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] pl-20 pr-8 text-white font-bold text-lg sm:text-xl focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/5"
                    />
                </div>
                <div className="lg:col-span-5 flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar bg-white/[0.02] border border-white/5 p-2 sm:p-3 rounded-[2.5rem]">
                    {sections.map(s => (
                       <button
                          key={s}
                          onClick={() => setActiveFilter(s)}
                          className={`px-6 sm:px-8 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[1.8rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                             activeFilter === s 
                             ? 'bg-white text-black shadow-2xl' 
                             : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                       >
                          {s}
                       </button>
                    ))}
                </div>
            </div>
        </div>

        <AnimatePresence mode="wait">
            {msg.text && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className={`fixed top-32 left-1/2 z-[10000] px-10 py-5 rounded-[2rem] apple-glass border font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 ${
                  msg.type === 'success' ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
                }`}
              >
                {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {msg.text}
              </motion.div>
            )}
        </AnimatePresence>

        {/* Students Grid: Higher Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-10">
            <AnimatePresence>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative overflow-hidden rounded-[4rem] p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                  >
                     <div className="flex justify-between items-start mb-12">
                        <div className="w-20 h-20 rounded-[2.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-blue-600/10 group-hover:text-blue-500 group-hover:border-blue-500/20 shadow-2xl transition-all duration-500 overflow-hidden relative">
                           <UserIcon className="w-10 h-10 relative z-10" strokeWidth={1.5} />
                           <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <Badge className="bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-[1.2rem] px-6 py-2.5 text-[9px] font-black uppercase tracking-widest">
                           {student.seccion}
                        </Badge>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${student.solvente ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-lg`} />
                               <span className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em]">
                                  {student.solvente ? 'Estatus Solvente' : 'Compromiso Pendiente'}
                               </span>
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:text-blue-400 transition-colors">
                               {student.nombre}
                            </h3>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/5">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <IdCard className="w-4 h-4 text-[#86868b]/40" />
                                 <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Identidad</span>
                              </div>
                              <span className="text-xs font-bold text-white/80">{student.cedula}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Users className="w-4 h-4 text-[#86868b]/40" />
                                 <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Representante</span>
                              </div>
                              <span className="text-xs font-bold text-white/80">{student.representante || 'Sin Asignar'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="absolute bottom-8 right-12 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-4">
                        <Button 
                           onClick={() => { setStudentToDelete(student); setIsDeleteModalOpen(true); }}
                           variant="ghost" 
                           className="h-12 w-12 p-0 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-2xl transition-all"
                        >
                           <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button 
                           variant="ghost" 
                           className="h-12 px-8 rounded-2xl bg-white/5 text-white hover:bg-white hover:text-black transition-all shadow-2xl"
                        >
                           <span className="text-[10px] font-black uppercase tracking-widest">Expediente</span>
                        </Button>
                     </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="col-span-full py-48 text-center space-y-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[5rem]"
                >
                   <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center text-white/10 mx-auto border border-white/5 shadow-inner">
                      <Bot className="w-16 h-16" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Búsqueda sin Resultados</h3>
                      <p className="text-[11px] text-[#86868b] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                         El Núcleo de Inteligencia no ha localizado registros bajo el parámetro: <span className="text-blue-500">"{searchTerm}"</span>
                      </p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>


        {/* Inscription Modal (Remains as Dialog for focus) */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="apple-glass border-white/10 rounded-[3.5rem] p-12 max-w-2xl bg-black/95 backdrop-blur-[100px] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] z-[9999]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none rounded-[3.5rem]" />
              <DialogHeader className="mb-12 relative z-10">
                 <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 mb-6">
                    <UserPlus className="w-8 h-8" />
                 </div>
                 <DialogTitle className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Nueva Admisión</DialogTitle>
                 <DialogDescription className="text-blue-400/60 font-black uppercase tracking-[0.3em] text-[8px] mt-3">Sincronización de Identidad Institucional v30.0</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3 group">
                       <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Representante Legal</label>
                       <Input 
                          placeholder="Nombre del Padre/Madre"
                          className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                          value={newStudent.representante}
                          onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                          required
                       />
                    </div>
                    <div className="space-y-3 group">
                       <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-blue-500 transition-colors">Contacto de Emergencia</label>
                       <Input 
                          placeholder="Teléfono móvil"
                          className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/30"
                          value={newStudent.contacto}
                          onChange={(e) => setNewStudent({...newStudent, contacto: e.target.value})}
                          required
                       />
                    </div>
                 </div>
                 <Button type="submit" disabled={submitting} className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] mt-6">
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Consolidar Inscripción"}
                 </Button>
              </form>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="apple-glass border-red-500/20 rounded-[3rem] p-10 max-w-md bg-black/90 shadow-[0_50px_100px_-20px_rgba(255,0,0,0.2)]">
              <DialogHeader className="text-center space-y-6">
                  <div className="w-20 h-20 rounded-[2.2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                      <AlertCircle className="w-10 h-10" />
                  </div>
                  <div>
                     <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Baja del Sistema</DialogTitle>
                     <DialogDescription className="text-red-400/60 font-black uppercase tracking-[0.4em] text-[9px] mt-4">Esta acción revocará la identidad institucional permanentemente.</DialogDescription>
                  </div>
              </DialogHeader>
              <div className="py-10 text-center">
                  <p className="text-sm font-bold text-[#86868b] uppercase tracking-wider leading-relaxed">
                     ¿Confirmar revocación de la identidad: <br/> <span className="text-white text-lg italic mt-4 block">{studentToDelete?.nombre}</span>?
                  </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="h-16 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest text-[#86868b] hover:text-white">Abortar</Button>
                  <Button onClick={() => handleDelete(studentToDelete.id)} className="h-16 rounded-[1.8rem] bg-red-600 text-white hover:bg-red-500 font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95">Confirmar Baja</Button>
              </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default Students;
