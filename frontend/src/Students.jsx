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
import StudentExpediente from './StudentExpediente';

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
  const [selectedStudentForExpediente, setSelectedStudentForExpediente] = useState(null);
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
        className="max-w-screen-2xl mx-auto py-8 md:py-24 space-y-12 md:space-y-24 px-6 md:px-16"
    >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-6xl font-bold text-white tracking-tighter italic leading-none">Matrícula</h1>
                <div className="flex items-center gap-3">
                    <Badge className="bg-white/5 text-[#86868b] border-white/10 px-3 py-0.5 text-[8px] font-black uppercase tracking-widest">Admisiones v4.0</Badge>
                    <p className="text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-[0.2em] leading-none">{filteredStudents.length} Alumnos Registrados</p>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                   onClick={() => fileInputRef.current?.click()}
                   className="h-14 md:h-18 w-14 md:w-18 rounded-2xl md:rounded-[2rem] bg-white/5 text-white/40 hover:text-white border border-white/10 p-0 transition-all flex-shrink-0"
                >
                   <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" />
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-14 md:h-18 px-8 md:px-14 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group flex-1 md:flex-none"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-3 group-hover:rotate-90 transition-transform" /> 
                    Admisión
                </Button>
            </div>
        </motion.div>

        {/* Controls */}
        <motion.div variants={item} className="space-y-6 md:space-y-8">
            <div className="relative group max-w-3xl mx-auto w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                <Input 
                    placeholder="Buscar identidad por nombre o CI..." 
                    className="h-14 md:h-18 pl-16 bg-white/[0.03] border-white/5 rounded-2xl md:rounded-[2rem] text-white font-bold transition-all focus:ring-1 focus:ring-blue-500/30 text-[15px] md:text-[17px] shadow-inner placeholder:text-white/5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-xl ${
                            filterSection === sec 
                            ? 'bg-blue-600 text-white shadow-blue-600/20' 
                            : 'bg-white/5 text-[#86868b] hover:text-white border border-white/5'
                        }`}
                    >
                        {sec === 'Todas' ? 'Toda la Institución' : `Sección ${sec}`}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* Grid */}
        <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10 pb-32">
            {filteredStudents.map((s, i) => (
                <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="ios-card p-8 md:p-10 bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all flex items-center justify-between group rounded-[3rem] shadow-2xl"
                >
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-black text-3xl md:text-4xl group-hover:bg-blue-600/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-2xl">
                                {s.nombre[0]}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-[22px] md:text-[28px] font-black text-white truncate italic tracking-tighter leading-none mb-3">{s.nombre}</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] md:text-[12px] font-black text-[#86868b] uppercase tracking-[0.2em] leading-none">CI: {s.cedula}</span>
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                    <span className="text-[11px] md:text-[12px] font-black text-blue-500 uppercase tracking-widest leading-none">{s.seccion}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Button 
                               onClick={() => setSelectedStudentForExpediente(s)}
                               className="h-16 px-10 rounded-[1.5rem] bg-blue-600 text-white hover:bg-blue-500 transition-all text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95"
                            >
                               EXPEDIENTE
                            </Button>
                            <Button 
                               onClick={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                               className="h-16 w-16 rounded-[1.5rem] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 shadow-xl"
                            >
                               <Trash2 className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
            {filteredStudents.length === 0 && (
                <div className="col-span-full py-24 md:py-48 flex flex-col items-center justify-center gap-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] md:rounded-[5rem]">
                    <Users className="w-12 h-12 md:w-20 md:h-20 text-white/5" />
                    <div className="text-center space-y-2">
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/20">Matrícula no localizada</p>
                        <p className="text-[8px] md:text-[9px] font-bold text-white/10 uppercase tracking-widest">Ajuste los filtros de búsqueda institucional</p>
                    </div>
                </div>
            )}
        </motion.div>

        {/* Admission Modal - Mobile Sheet */}
        <AnimatePresence>
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                    />
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="w-full max-w-2xl bg-zinc-950 sm:rounded-[3.5rem] border-t sm:border border-white/10 p-8 md:p-14 relative overflow-hidden shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 w-12 h-1.5 bg-white/10 rounded-full sm:hidden" />
                        
                        <div className="flex items-center justify-between mb-10 md:mb-16">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">ADMISIÓN</h2>
                                <p className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-[0.3em] mt-2">Identidad Institucional</p>
                            </div>
                            <Button onClick={() => setIsAddModalOpen(false)} variant="ghost" className="rounded-full w-12 h-12 p-0 text-white/20 hover:text-white hover:bg-white/5 transition-all">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar pb-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Identidad (Cédula)</label>
                                    <Input 
                                        placeholder="V-00.000.000"
                                        className="h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-black text-xl focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                        value={newStudent.cedula}
                                        onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Ubicación Académica</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none transition-all shadow-inner"
                                            value={newStudent.año || '1'}
                                            onChange={(e) => setNewStudent({...newStudent, año: e.target.value, seccion: `${e.target.value}${newStudent.seccion?.slice(-1) || 'A'}`})}
                                        >
                                            {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-zinc-950">{y} Año</option>)}
                                        </select>
                                        <select 
                                            className="w-24 h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none transition-all shadow-inner"
                                            value={newStudent.seccion?.slice(-1) || 'A'}
                                            onChange={(e) => setNewStudent({...newStudent, seccion: `${newStudent.año || '1'}${e.target.value}`})}
                                        >
                                            {['A','B','C'].map(s => <option key={s} value={s} className="bg-zinc-950">{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Nombre Completo del Auditor</label>
                                <Input 
                                    placeholder="Ej: Andrés Eloy Blanco"
                                    className="h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-bold text-lg focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                    value={newStudent.nombre}
                                    onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="h-18 md:h-20 w-full bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] mt-6">
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ejecutar Admisión Maestra"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Notifications Portal */}
        <AnimatePresence>
            {msg.text && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed top-24 left-4 right-4 md:left-auto md:right-12 md:w-96 z-[2000]"
                >
                    <div className="apple-glass p-5 md:p-6 rounded-3xl md:rounded-[2rem] flex items-center gap-4 shadow-2xl border border-white/10">
                        <div className={`p-3 rounded-xl ${msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black text-[#86868b] uppercase tracking-widest block mb-1">Registry Management Kernel</span>
                            <p className={`text-[12px] font-bold truncate ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
                        </div>
                        <button onClick={() => setMsg({text:'', type:''})} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-4 h-4 text-white/20" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        {/* Expediente Modal */}
        <AnimatePresence>
            {selectedStudentForExpediente && (
                <StudentExpediente 
                    student={selectedStudentForExpediente} 
                    onClose={() => setSelectedStudentForExpediente(null)} 
                />
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default Students;

