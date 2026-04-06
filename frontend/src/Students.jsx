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
  UserPlus
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

  const filteredStudents = students.filter(s => 
    (s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.cedula?.includes(searchTerm) ||
     s.seccion?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Todos' || s.seccion?.includes(activeFilter))
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
      if (res.ok) {
        setMsg({ text: 'Estudiante inscrito exitosamente', type: 'success' });
        setNewStudent({ cedula: '', nombre: '', seccion: '', representante: '', contacto: '' });
        fetchStudents();
        setTimeout(() => setIsAddModalOpen(false), 1500);
      }
    } catch (e) { 
      setMsg({ text: 'Error de sincronización con el servidor', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes/${studentToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setMsg({ text: 'Estudiante eliminado del Nodo Maestro', type: 'success' });
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        fetchStudents();
      } else {
        const err = await res.json();
        setMsg({ text: err.error || 'Fallo en la purga de registros', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error de conexión con el núcleo', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (student) => {
    const newStatus = student.estado === 'activo' ? 'suspendido' : 'activo';
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes/${student.id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: newStatus })
      });
      if (res.ok) {
        setMsg({ text: `Estado actualizado: ${newStatus.toUpperCase()}`, type: 'success' });
        fetchStudents();
      }
    } catch (e) {
      setMsg({ text: 'Error al cambiar estado', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro del nodo maestro? Esta acción es irreversible.")) return;
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setMsg({ text: 'Registro eliminado permanentemente', type: 'success' });
        fetchStudents();
      }
    } catch (e) {
      setMsg({ text: 'Error al eliminar registro', type: 'error' });
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
        const bulkPayload = [];
        for (const row of data) {
          const keys = Object.keys(row);
          const findCol = (...names) => {
            for (const n of names) {
              if (row[n] !== undefined && row[n] !== null && String(row[n]).trim() !== '') return String(row[n]).trim();
            }
            for (const k of keys) {
              const kl = k.toLowerCase().replace(/[_\s-]/g, '');
              for (const n of names) {
                const nl = n.toLowerCase().replace(/[_\s-]/g, '');
                if (kl === nl || kl.includes(nl) || nl.includes(kl)) {
                  if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
                }
              }
            }
            return '';
          };

          const payload = {
            nombre: findCol('Nombre_Completo', 'NombreCompleto', 'Nombre', 'nombre', 'NOMBRE', 'Name', 'Alumno', 'Estudiante', 'STUDENT'),
            cedula: findCol('Identidad', 'Cedula', 'cedula', 'CEDULA', 'CI', 'ci', 'ID', 'id', 'Numero_Cedula', 'DNI', 'Documento', 'Cédula'),
            seccion: findCol('Seccion', 'seccion', 'SECCION', 'Sección', 'Grado', 'grado', 'GRADO', 'Grade', 'Año', 'Curso', 'Nivel'),
            representante: findCol('Representante', 'representante', 'REPRESENTANTE', 'Padre', 'Madre', 'Tutor', 'Acudiente'),
            contacto: findCol('Contacto', 'contacto', 'CONTACTO', 'Telefono', 'telefono', 'Phone', 'Celular', 'Movil')
          };
          
          if (payload.nombre && payload.cedula && payload.seccion) {
              bulkPayload.push(payload);
          }
        }
        
        if (bulkPayload.length > 0) {
            const res = await fetch(`${baseUrl}/api/estudiantes/bulk`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ data: bulkPayload })
            });
            if (res.ok) successCount = bulkPayload.length;
        }

        setMsg({ text: `Carga exitosa: ${successCount} estudiantes registrados.`, type: 'success' });
        fetchStudents();
      } catch (err) {
        setMsg({ text: 'Error al procesar el archivo Excel', type: 'error' });
      } finally {
        setBulkLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Cedula,Nombre_Completo,Seccion,Representante,Contacto\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Plantilla_Estudiantes.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return (
    <div className="space-y-12">
        <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-80 apple-glass rounded-[2rem] animate-pulse" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Search & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative flex-1 max-w-lg group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
             <Input 
                placeholder="Buscar por CI, nombre o grado..." 
                className="pl-16 h-14 bg-white/5 border-white/5 rounded-2xl text-white text-sm font-medium placeholder:text-[#86868b] focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
             {['Todos', '1ro', '2do', '3ro', '4to', '5to'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    activeFilter === f 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f} {f !== 'Todos' && 'Año'}
                </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input type="file" ref={fileInputRef} onChange={handleExcelImport} className="hidden" />
          <Button 
            onClick={() => fileInputRef.current.click()}
            className="h-14 px-8 apple-glass border border-white/5 text-white/80 hover:bg-white/5 rounded-2xl font-semibold text-xs flex gap-3 transition-all"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
            Importar Excel
          </Button>
          
          <Button 
            onClick={downloadTemplate}
            className="h-14 px-8 apple-glass border border-white/5 text-white/80 hover:bg-white/10 hover:text-white rounded-2xl font-semibold text-xs flex gap-3 transition-all shrink-0"
          >
            <Download className="w-5 h-5" />
            Plantilla
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-10 bg-blue-600 text-white hover:bg-blue-500 rounded-2xl font-semibold text-xs flex gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                <UserPlus className="w-5 h-5" />
                Matricular Alumno
              </Button>
            </DialogTrigger>
            <DialogContent className="apple-glass border-white/10 p-16 rounded-[3rem] max-w-xl">
               <DialogHeader className="mb-10">
                  <DialogTitle className="text-3xl font-semibold text-white tracking-tight">Nueva Matrícula</DialogTitle>
                  <DialogDescription className="text-[#86868b] font-medium mt-3">Registro de estudiante en el Periodo 2026</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Identidad</label>
                        <Input 
                           placeholder="V-000.000"
                           className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                           value={newStudent.cedula}
                           onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                           required
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Sección</label>
                        <Input 
                           placeholder="Ej: 5A"
                           className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                           value={newStudent.seccion}
                           onChange={(e) => setNewStudent({...newStudent, seccion: e.target.value})}
                           required
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Nombre Completo</label>
                     <Input 
                        placeholder="Nombres y Apellidos"
                        className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                        value={newStudent.nombre}
                        onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                        required
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Representante</label>
                     <Input 
                        placeholder="Nombre del Padre/Madre"
                        className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                        value={newStudent.representante}
                        onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                     />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all shadow-2xl">
                     {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmar Inscripción"}
                  </Button>
               </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, i) => (
              <motion.div
                key={student.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="apple-card group"
              >
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-blue-600/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-700">
                       <UserIcon className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <Badge className="bg-white/5 text-[#86868b] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-semibold group-hover:bg-white group-hover:text-black transition-all">
                          Sección {student.seccion}
                       </Badge>
                       <Badge className={`${student.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-none px-4 py-1 text-[9px] uppercase font-bold tracking-widest`}>
                          {student.estado || 'activo'}
                       </Badge>
                    </div>
                 </div>

                <div className="space-y-3 mb-10">
                   <h3 className="text-2xl font-semibold text-white tracking-tight group-hover:translate-x-1 transition-transform">{student.nombre}</h3>
                   <div className="flex items-center gap-3 text-xs font-medium text-[#86868b]">
                      <IdCard className="w-4 h-4 opacity-40" />
                      CI {student.cedula}
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Titular</span>
                      <span className="text-xs font-medium text-white/80">{student.representante || 'N/A'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Contacto</span>
                      <span className="text-xs font-medium text-white/80">{student.contacto || 'N/A'}</span>
                   </div>
                </div>

                 <div className="mt-8 flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-3">
                       <button 
                          onClick={() => handleStatusToggle(student)}
                          className={`p-3 rounded-xl transition-all ${student.estado === 'activo' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                          title={student.estado === 'activo' ? 'Suspender Alumno' : 'Activar Alumno'}
                       >
                          <AlertCircle className="w-4 h-4" />
                       </button>
                       <button 
                          onClick={() => {
                             setStudentToDelete(student);
                             setIsDeleteModalOpen(true);
                          }}
                          className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                          title="Eliminar Registro"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <button className="p-3 rounded-full bg-white/5 text-white/10 hover:bg-white/10 hover:text-white transition-all">
                       <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-30">
               <Users className="w-16 h-16" />
               <p className="text-sm font-semibold tracking-widest uppercase">Sin registros en este nodo</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-12 right-12 z-[110]"
          >
             <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                <div className={`p-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                   {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Sistema Administrativo</span>
                   <span className="text-sm font-semibold text-white mt-0.5">{msg.text}</span>
                </div>
                <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-1.5 hover:bg-white/5 rounded-full transition-colors opacity-30 hover:opacity-100">
                   <X className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="apple-glass-dark border-white/10 rounded-[2.5rem] p-10 max-w-md">
           <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                 <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase">¿Confirmar Purga de Registro?</h2>
                 <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest leading-relaxed">
                    Estás a punto de eliminar a <span className="text-white">{studentToDelete?.nombre}</span> del Nodo Maestro. 
                    Esta acción es irreversible y afectará el historial académico.
                 </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                 <Button 
                   onClick={confirmDelete}
                   disabled={submitting}
                   className="h-14 w-full bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[11px] tracking-[0.2em] shadow-2xl shadow-red-600/20"
                 >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "ELIMINAR PERMANENTEMENTE"}
                 </Button>
                 <Button 
                   variant="ghost"
                   onClick={() => setIsDeleteModalOpen(false)}
                   className="h-14 w-full text-[#86868b] hover:text-white hover:bg-white/5 rounded-2xl font-bold text-[10px] tracking-widest"
                 >
                    CANCELAR PROTOCOLO
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
