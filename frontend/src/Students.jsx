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
  FileSpreadsheet,
  Upload,
  Download,
  Loader2,
  X,
  UserPlus,
  Activity,
  Bot,
  ArrowRight
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
} from "./components/ui/dialog";
import * as XLSX from 'xlsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('Todas');
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
    seccion: '1A', 
    año: '1',
    representante: '', 
    contacto: '' 
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item = { 
    hidden: { opacity: 0, y: 15 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } 
  };

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = Array.isArray(students) ? students.filter(s => 
    ((s.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
     (s.cedula || '').includes(searchTerm) ||
     (s.seccion?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (filterSection === 'Todas' || (s.seccion || '').includes(filterSection))
  ) : [];

  const sections = ['Todas', ...new Set((Array.isArray(students) ? students : []).map(s => s.seccion).filter(Boolean))];

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
        setMsg({ text: 'Estudiante inscrito y sincronizado', type: 'success' });
        setIsAddModalOpen(false);
        setNewStudent({ cedula: '', nombre: '', seccion: '1A', año: '1' });
        fetchStudents();
        window.dispatchEvent(new Event('refresh-dashboard'));
      } else {
        setMsg({ text: data.error || 'Error en la inscripción', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error de enlace con el servidor de matrícula', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30">Accediendo a Matrículas...</p>
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
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight italic leading-tight">Matrícula</h1>
                <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.3em] mt-3">Registro Maestro • {filteredStudents.length} Alumnos</p>
            </div>
            <div className="flex items-center gap-3">
                <Button 
                   onClick={() => fileInputRef.current?.click()}
                   variant="ghost"
                   className="h-12 w-12 rounded-2xl bg-white/5 text-white/40 hover:text-white p-0"
                >
                   <FileSpreadsheet className="w-5 h-5" />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" />
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="ios-button-primary bg-white text-black h-12 px-8 active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2" /> Admisión
                </Button>
            </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={item} className="space-y-6">
            <div className="relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                <Input 
                    placeholder="Escanear por nombre o cédula..." 
                    className="h-14 pl-16 bg-[#1c1c1e]/60 border-none rounded-2xl text-white font-bold transition-all focus:ring-1 focus:ring-blue-500/50 text-[15px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            filterSection === sec 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 text-[#86868b] hover:text-white'
                        }`}
                    >
                        {sec}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* List / Grid */}
        <motion.div variants={item} className="ios-list-group space-y-3">
            {filteredStudents.map((s, i) => (
                <div key={s.id} className="ios-list-item flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-bold text-[14px]">
                            {s.nombre[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[15px] font-bold text-white truncate">{s.nombre}</p>
                            <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">{s.cedula} • {s.seccion}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.solvente ? 'bg-emerald-500' : 'bg-red-500'} mr-2`} />
                        <Button 
                           onClick={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                           variant="ghost" 
                           className="w-10 h-10 rounded-xl text-white/10 hover:text-red-500 hover:bg-red-500/10 p-0 transition-colors"
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-[#86868b]/30" />
                    </div>
                </div>
            ))}
            {filteredStudents.length === 0 && (
                <div className="py-20 flex flex-col items-center opacity-20">
                    <Users className="w-12 h-12 mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Sin registros encontrados</p>
                </div>
            )}
        </motion.div>

        {/* Add Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="ios-modal-content">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h2 className="text-3xl font-bold text-white italic tracking-tight">Admisión</h2>
                    <p className="text-[11px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">Identidad Institucional</p>
                 </div>
                 <Button onClick={() => setIsAddModalOpen(false)} variant="ghost" className="rounded-full w-10 h-10 p-0 text-white/40 hover:text-white">
                    <X className="w-6 h-6" />
                 </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Identidad (CI)</label>
                       <Input 
                          placeholder="V-00.000.000"
                          className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold"
                          value={newStudent.cedula}
                          onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                          required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Ubicación Académica</label>
                       <div className="flex gap-2">
                           <select 
                                className="flex-1 h-14 bg-[#1c1c1e] border-none rounded-2xl px-4 text-white font-bold outline-none appearance-none"
                                value={newStudent.año || '1'}
                                onChange={(e) => setNewStudent({...newStudent, año: e.target.value, seccion: `${e.target.value}${newStudent.seccion?.slice(-1) || 'A'}`})}
                           >
                               {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-black">{y} Año</option>)}
                           </select>
                           <select 
                                className="w-20 h-14 bg-[#1c1c1e] border-none rounded-2xl px-4 text-white font-bold outline-none appearance-none"
                                value={newStudent.seccion?.slice(-1) || 'A'}
                                onChange={(e) => setNewStudent({...newStudent, seccion: `${newStudent.año || '1'}${e.target.value}`})}
                           >
                               {['A','B','C'].map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                           </select>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Nombre Completo</label>
                    <Input 
                       className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold"
                       value={newStudent.nombre}
                       onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                       required
                    />
                 </div>
                 <Button type="submit" disabled={submitting} className="ios-button-primary bg-white text-black h-16 w-full text-[14px] font-black mt-4">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Admisión"}
                 </Button>
              </form>
            </DialogContent>
        </Dialog>

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

export default Students;

