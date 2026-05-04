import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  TrendingUp,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  LayoutGrid,
  Loader2,
  Database,
  X,
  Target,
  ShieldCheck,
  Building2,
  Activity,
  ArrowRight,
  Sparkles,
  Printer,
  Calendar,
  Layers
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
} from "./components/ui/dialog";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Grades = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [yearFilter, setYearFilter] = useState('Todas');
    const [sectionFilter, setSectionFilter] = useState('Todas');
    const fileInputRef = useRef(null);

    const [newGrade, setNewGrade] = useState({ estudiante_id: '', materia: '', nota: '', lapso: '1' });

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const item = { 
        hidden: { opacity: 0, y: 15 }, 
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } 
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const headers = { 'Authorization': `Bearer ${token}` };
            const [resG, resS] = await Promise.all([
                fetch(`${baseUrl}/api/notas`, { headers }),
                fetch(`${baseUrl}/api/estudiantes`, { headers })
            ]);
            const gData = await resG.json();
            const sData = await resS.json();
            setGrades(Array.isArray(gData) ? gData : []);
            setStudents(Array.isArray(sData) ? sData : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredGrades = Array.isArray(grades) ? grades.filter(g => {
        const studentName = g.student || g.nombre || '';
        const subjectName = g.subject || g.materia || '';
        const sectionName = g.seccion || '';
        
        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             subjectName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesYear = yearFilter === 'Todas' || sectionName.startsWith(yearFilter);
        const matchesSection = sectionFilter === 'Todas' || sectionName.endsWith(sectionFilter);
        
        return matchesSearch && matchesYear && matchesSection;
    }) : [];

    const years = ['Todas', '1', '2', '3', '4', '5'];
    const sections = ['Todas', 'A', 'B', 'C'];

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/notas`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newGrade)
            });
            if (res.ok) {
                setMsg({ text: 'Nota sincronizada', type: 'success' });
                setIsAddModalOpen(false);
                setNewGrade({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
                fetchData();
            }
        } catch (e) {
            setMsg({ text: 'Error de conexión', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30">Accediendo a Calificaciones...</p>
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
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight italic leading-tight">Calificaciones</h1>
                    <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.3em] mt-3">Evaluación Continua • {filteredGrades.length} Registros</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="ios-button-primary bg-white text-black h-12 px-8 active:scale-95"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Registrar
                    </Button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { label: 'Promedio', value: (filteredGrades.reduce((acc, c) => acc + (parseFloat(c.nota || c.grade) || 0), 0) / (filteredGrades.length || 1)).toFixed(1), icon: Target, color: 'text-blue-400' },
                    { label: 'Aprobados', value: `${((filteredGrades.filter(g => (parseFloat(g.nota || g.grade) || 0) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Registros', value: filteredGrades.length, icon: Database, color: 'text-white/40' }
                ].map((stat, i) => (
                    <div key={i} className="apple-card p-5 border-white/5 flex flex-col gap-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <p className="text-2xl font-bold text-white italic">{stat.value}</p>
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div variants={item} className="space-y-6">
                <div className="relative group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                        placeholder="Buscar por alumno o materia..." 
                        className="h-14 pl-16 bg-[#1c1c1e]/60 border-none rounded-2xl text-white font-bold transition-all focus:ring-1 focus:ring-blue-500/50 text-[15px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Año Escolar</span>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {years.map(y => (
                                <button
                                    key={y}
                                    onClick={() => setYearFilter(y)}
                                    className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        yearFilter === y 
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-white/5 text-[#86868b] hover:text-white'
                                    }`}
                                >
                                    {y === 'Todas' ? 'Todas' : `${y} Año`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Sección Académica</span>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {sections.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSectionFilter(s)}
                                    className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        sectionFilter === s 
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'bg-white/5 text-[#86868b] hover:text-white'
                                    }`}
                                >
                                    {s === 'Todas' ? 'Todas' : `Sección ${s}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* List */}
            <motion.div variants={item} className="ios-list-group space-y-3">
                {filteredGrades.map((g, i) => (
                    <div key={g.id || i} className="ios-list-item flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[14px] ${
                                (g.nota || g.grade) >= 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                                {g.nota || g.grade}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[15px] font-bold text-white truncate">{g.student || g.nombre}</p>
                                <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">{g.subject || g.materia} • Lapso {g.lapso}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#86868b]/30" />
                    </div>
                ))}
                {filteredGrades.length === 0 && (
                    <div className="py-20 flex flex-col items-center opacity-20">
                        <GraduationCap className="w-12 h-12 mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-widest">Sin registros académicos</p>
                    </div>
                )}
            </motion.div>

            {/* Registrar Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="ios-modal-content">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white italic tracking-tight">Registro</h2>
                            <p className="text-[11px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">Calificación Académica</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(false)} variant="ghost" className="rounded-full w-10 h-10 p-0 text-white/40 hover:text-white">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Alumno</label>
                            <select 
                                className="w-full bg-[#1c1c1e] border-none rounded-2xl h-14 px-6 text-[15px] text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none transition-all"
                                value={newGrade.estudiante_id}
                                onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                required
                            >
                                <option value="" className="bg-zinc-900">Seleccionar...</option>
                                {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.nombre} ({s.cedula})</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Materia</label>
                            <Input 
                                placeholder="Ej: Física"
                                className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold"
                                value={newGrade.materia}
                                onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Nota (0-20)</label>
                                <Input 
                                    type="number"
                                    max="20"
                                    min="0"
                                    className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold"
                                    value={newGrade.nota}
                                    onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Lapso</label>
                                <select 
                                    className="w-full bg-[#1c1c1e] border-none rounded-2xl h-14 px-6 text-[15px] text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none transition-all"
                                    value={newGrade.lapso}
                                    onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                >
                                    <option value="1" className="bg-zinc-900">1</option>
                                    <option value="2" className="bg-zinc-900">2</option>
                                    <option value="3" className="bg-zinc-900">3</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" disabled={submitting} className="ios-button-primary bg-white text-black h-16 w-full text-[14px] font-black mt-4">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sincronizar Nota"}
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

export default Grades;
