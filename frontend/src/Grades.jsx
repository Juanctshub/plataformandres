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
  Database
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription
} from "./components/ui/dialog";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import * as XLSX from 'xlsx';

const Grades = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [yearFilter, setYearFilter] = useState('Todos');
    const fileInputRef = useRef(null);

    const [newGrade, setNewGrade] = useState({ estudiante_id: '', materia: '', nota: '', lapso: '1' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const headers = { 'Authorization': `Bearer ${token}` };
            const [resG, resS] = await Promise.all([
                fetch(`${baseUrl}/api/notas`, { headers }),
                fetch(`${baseUrl}/api/estudiantes`, { headers })
            ]);
            setGrades(await resG.json());
            setStudents(await resS.json());
        } catch (e) {
            console.error('Error fetching grades:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const notaNum = parseFloat(newGrade.nota);
        if (isNaN(notaNum) || notaNum < 0 || notaNum > 20) {
            setMsg({ text: 'La calificación debe estar entre 0.00 y 20.00', type: 'error' });
            return;
        }
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
                setMsg({ text: 'Calificación consolidada en el núcleo', type: 'success' });
                setIsAddModalOpen(false);
                setNewGrade({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
                fetchData();
            }
        } catch (e) {
            setMsg({ text: 'Error de sincronización académica', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
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
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws);

                const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
                const token = localStorage.getItem('token');
                let successCount = 0;

                for (const row of data) {
                    const student = students.find(s => 
                        s.cedula === String(row.Cedula || row.ID) || 
                        s.nombre.toLowerCase() === String(row.Estudiante || row.Student).toLowerCase()
                    );
                    
                    if (!student) continue;

                    const payload = {
                        estudiante_id: student.id,
                        materia: row.Materia || row.Subject || 'Sin Asignar',
                        nota: parseFloat(row.Nota || row.Grade || 0),
                        lapso: String(row.Lapso || row.Period || '1')
                    };

                    await fetch(`${baseUrl}/api/notas`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(payload)
                    });
                    successCount++;
                }

                setMsg({ text: `Carga masiva completa: ${successCount} registros sincronizados.`, type: 'success' });
                fetchData();
            } catch (err) {
                setMsg({ text: 'Error al procesar la planilla de notas', type: 'error' });
            } finally {
                setBulkLoading(false);
                setTimeout(() => setMsg({ text: '', type: '' }), 5000);
            }
        };
        reader.readAsBinaryString(file);
    };

    const filteredGrades = grades.filter(g => {
        const matchesSearch = g.student.toLowerCase().includes(searchTerm.toLowerCase()) || g.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = yearFilter === 'Todos' || g.seccion.includes(yearFilter);
        return matchesSearch && matchesYear;
    });

    const chartData = [
        { name: 'Sobresaliente (18-20)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 18).length, color: '#10b981' },
        { name: 'Notable (15-17)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 15 && parseFloat(g.grade) < 18).length, color: '#3b82f6' },
        { name: 'Aprobado (10-14)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 10 && parseFloat(g.grade) < 15).length, color: '#f59e0b' },
        { name: 'Reprobado (0-9)', value: filteredGrades.filter(g => parseFloat(g.grade) < 10).length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const years = ['Todos', '1ro', '2do', '3ro', '4to', '5to'];

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                            Escala 0-20 • Auditado
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Calificaciones</h2>
                        <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
                            Gestión de rendimiento académico por lapsos con análisis estadístico de aprobación institucional.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                        <Input 
                            placeholder="Alumno o materia..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 w-[300px] bg-white border-zinc-100 rounded-2xl shadow-sm focus:ring-1 focus:ring-zinc-200 placeholder:text-zinc-300 font-bold text-xs uppercase tracking-widest text-zinc-900"
                        />
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2.2rem] p-2 flex gap-2 shadow-sm">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => setYearFilter(y)}
                                className={`px-5 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${
                                    yearFilter === y 
                                        ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-900/10' 
                                        : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                    
                    <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                    <Button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={bulkLoading}
                        className="h-14 px-8 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95"
                    >
                        {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4.5 h-4.5" />}
                        Importar Notas
                    </Button>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10">
                                <Plus className="w-5 h-5" />
                                Nueva Nota
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none text-zinc-900 rounded-[3rem] p-12 max-w-xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.15)]">
                            <DialogHeader className="mb-8">
                                <DialogTitle className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Registro Académico</DialogTitle>
                                <DialogDescription className="text-zinc-400 font-bold text-sm mt-3">Asignación de calificación oficial escala 00-20</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Seleccionar Estudiante</label>
                                    <select 
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-200 appearance-none"
                                        value={newGrade.estudiante_id}
                                        onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Buscar en matrícula...</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.nombre} | {s.seccion}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Materia / Unidad Curricular</label>
                                    <Input 
                                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold uppercase"
                                        value={newGrade.materia}
                                        onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Nota Final</label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 text-2xl font-black text-center"
                                            value={newGrade.nota}
                                            onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Lapso Académico</label>
                                        <select 
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none appearance-none"
                                            value={newGrade.lapso}
                                            onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                        >
                                            <option value="1">1er Momento</option>
                                            <option value="2">2do Momento</option>
                                            <option value="3">3er Momento</option>
                                        </select>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black mt-4 transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/10"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Consolidar Nota"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 apple-card p-12 flex flex-col md:flex-row gap-10"
                >
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <BarChart3 className="w-6 h-6 text-zinc-900" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Distribución Institucional</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '10px' }}
                                    />
                                    <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-6 pt-4">
                            {chartData.map(d => (
                                <div key={d.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{d.name}: {d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 apple-card p-12 bg-zinc-950 text-white"
                >
                    <div className="space-y-10">
                        <div className="flex flex-col items-center justify-center py-6 border-b border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6">Promedio Nucleo</h4>
                            <div className="text-7xl font-black italic tracking-tighter text-apple-gradient">
                                {(filteredGrades.reduce((acc, curr) => acc + parseFloat(curr.grade), 0) / (filteredGrades.length || 1)).toFixed(2)}
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex justify-between items-center group cursor-help">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total de Registros</span>
                                <span className="text-xl font-black">{filteredGrades.length}</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-help">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tasa de Aprobación</span>
                                <span className="text-xl font-black text-emerald-500">
                                    {((filteredGrades.filter(g => parseFloat(g.grade) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center group cursor-help text-red-400">
                                <span className="text-[10px] font-black uppercase tracking-widest">Alerta de Repitencia</span>
                                <span className="text-xl font-black">
                                    {filteredGrades.filter(g => parseFloat(g.grade) < 10).length} Alumnos
                                </span>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-14 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mt-6"
                        >
                            Generar Boletín Global
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Grades Table/Grid */}
            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredGrades.length > 0 ? filteredGrades.map((g, i) => (
                        <motion.div 
                            key={g.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-xl hover:border-zinc-200 transition-all duration-700"
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm transition-all duration-700 group-hover:scale-110 ${
                                    parseFloat(g.grade) >= 10 ? 'bg-zinc-50 text-zinc-900' : 'bg-red-50 text-red-500'
                                }`}>
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase group-hover:underline decoration-zinc-100 decoration-4 underline-offset-4">{g.student}</h3>
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-zinc-100 text-zinc-400 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1">{g.subject}</Badge>
                                        <Badge className="bg-blue-50 text-blue-400 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 mr-[-5px]">Momento {g.lapso}</Badge>
                                        <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest pl-2">Año: {g.seccion}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-5xl font-black tracking-tighter ${
                                            parseFloat(g.grade) >= 15 ? 'text-zinc-900 italic' : 
                                            parseFloat(g.grade) >= 10 ? 'text-zinc-900' : 'text-red-500'
                                        }`}>
                                            {parseFloat(g.grade).toFixed(2)}
                                        </span>
                                        <span className="text-[10px] font-black text-zinc-300 uppercase">/ 20</span>
                                    </div>
                                    <Badge className={`mt-3 border-none rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${
                                        parseFloat(g.grade) >= 18 ? 'bg-zinc-950 text-white' :
                                        parseFloat(g.grade) >= 10 ? 'bg-emerald-50 text-emerald-600' : 
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {parseFloat(g.grade) >= 18 ? 'Consolidación Plena' : 
                                         parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Requiere Refuerzo'}
                                    </Badge>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-100 group-hover:text-zinc-900 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-32 text-zinc-100 space-y-6 opacity-30 select-none">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-100 flex items-center justify-center">
                                <TrendingUp className="w-10 h-10" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                                Sincronizando Archivo Académico...
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toasts / Feedback */}
            <div className="fixed bottom-12 right-12 z-[100]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                            }`}
                        >
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {msg.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
                <div className="flex items-center gap-3">
                    <Database className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Núcleo de Datos Neon Secure</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Cifrado Protocolo UPEL-v10.0</span>
                </div>
            </div>
        </div>
    );
};

export default Grades;
