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
  Activity
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
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const notaNum = parseFloat(newGrade.nota);
        if (isNaN(notaNum) || notaNum < 0 || notaNum > 20) {
            setMsg({ text: 'Rango de escala 00-20 no respetado', type: 'error' });
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
                setMsg({ text: 'Consolidación académica exitosa', type: 'success' });
                setIsAddModalOpen(false);
                setNewGrade({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
                fetchData();
            }
        } catch (e) {
            setMsg({ text: 'Fallo de integridad en el núcleo', type: 'error' });
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

                setMsg({ text: `Protocolo Excel completo: ${successCount} registros sincronizados.`, type: 'success' });
                fetchData();
            } catch (err) {
                setMsg({ text: 'Incompatibilidad en el flujo de datos Excel', type: 'error' });
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
        { name: 'Elite (18-20)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 18).length, color: '#FFFFFF' },
        { name: 'Avanzado (15-17)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 15 && parseFloat(g.grade) < 18).length, color: '#0A84FF' },
        { name: 'Estándar (10-14)', value: filteredGrades.filter(g => parseFloat(g.grade) >= 10 && parseFloat(g.grade) < 15).length, color: '#2C2C2E' },
        { name: 'Riesgo (0-9)', value: filteredGrades.filter(g => parseFloat(g.grade) < 10).length, color: '#FF453A' },
    ].filter(d => d.value > 0);

    const years = ['Todos', '1ro', '2do', '3ro', '4to', '5to'];

    if (loading) return (
      <div className="space-y-16 pb-20">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
            <div className="space-y-6">
                <div className="h-12 w-80 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-4 w-64 bg-white/[0.02] rounded-lg animate-pulse" />
            </div>
            <div className="h-16 w-[400px] bg-white/5 rounded-full animate-pulse" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 h-[400px] bg-[#1C1C1E] border border-white/5 rounded-[4rem] animate-pulse" />
            <div className="lg:col-span-4 h-[400px] bg-[#1C1C1E] border border-white/5 rounded-[4rem] animate-pulse" />
         </div>
      </div>
    );

    return (
        <div className="space-y-16 pb-20 relative">
            {/* Header Pro */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-12">
                            <Target className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.4em]">
                            Consolidación Académica v14.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Calificaciones</h2>
                        <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
                            Control de metas académicas y rendimiento por lapsos. 
                            <span className="block mt-2 text-[#0A84FF] select-none italic uppercase tracking-[0.2em] text-[11px] font-black underline underline-offset-4 decoration-[#0A84FF]/20">Protocolo de auditoría digital activo.</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                    <div className="relative group/search">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/search:text-[#0A84FF] transition-colors" />
                        <Input 
                            placeholder="Alumno o materia..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-16 h-16 w-[340px] bg-[#1C1C1E] border-white/5 rounded-2xl shadow-2xl focus:ring-1 focus:ring-[#0A84FF]/40 placeholder:text-white/10 font-bold italic text-xs uppercase tracking-widest text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        />
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/5 rounded-[2.25rem] p-2 flex gap-1 shadow-2xl">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => setYearFilter(y)}
                                className={`px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 flex items-center gap-2 ${
                                    yearFilter === y 
                                        ? 'bg-white text-black shadow-2xl scale-105' 
                                        : 'text-white/20 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {yearFilter === y && <div className="w-1 h-1 rounded-full bg-black animate-pulse" />}
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix & Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="xl:col-span-8 apple-pro-card p-12 bg-black/40 border-white/[0.03] group"
                >
                    <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-white/5 pb-10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[1.75rem] bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shadow-2xl">
                                   <BarChart3 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Distribución Institucional</h3>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <Badge className="bg-white text-black border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-2 rounded-xl">Q1 Period</Badge>
                               <span className="text-[9px] font-black text-white/10 uppercase tracking-widest mt-1">Auditado v14.0</span>
                            </div>
                        </div>
                        
                        <div className="h-[340px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ 
                                          backgroundColor: '#1C1C1E', 
                                          borderRadius: '1.5rem', 
                                          border: '1px solid rgba(255,255,255,0.05)', 
                                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', 
                                          color: 'white',
                                          fontSize: '11px', 
                                          fontWeight: 'black',
                                          textTransform: 'uppercase'
                                        }}
                                        itemStyle={{ color: '#0A84FF' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    />
                                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={80}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-10 pt-8 border-t border-white/5">
                            {chartData.map(d => (
                                <div key={d.name} className="flex items-center gap-4 group/item">
                                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover/item:scale-125 transition-transform" style={{ backgroundColor: d.color }} />
                                    <div className="flex flex-col">
                                       <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] leading-none mb-1">{d.name}</span>
                                       <span className="text-white font-black text-sm">{d.value} <span className="text-white/10 text-[10px] ml-1 uppercase">Indice</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-4 apple-pro-card p-12 bg-white text-black relative flex flex-col justify-between overflow-hidden"
                >
                    <Activity className="absolute -right-8 -bottom-8 w-48 h-48 text-black/[0.03] rotate-12" />
                    <div className="space-y-12 relative z-10">
                        <div className="flex flex-col items-center justify-center py-10 border-b border-black/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-black/30 mb-8 italic">Promedio Global</h4>
                            <div className="text-8xl font-black italic tracking-tighter text-black leading-none group-hover:scale-110 transition-transform duration-700 cursor-default">
                                {(filteredGrades.reduce((acc, curr) => acc + parseFloat(curr.grade), 0) / (filteredGrades.length || 1)).toFixed(2)}
                            </div>
                            <div className="mt-8 flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Inferencia Escalar</span>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex justify-between items-center group/stat cursor-help">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 group-hover/stat:text-black transition-colors">Core Records</span>
                                <span className="text-2xl font-black tracking-tighter italic">{filteredGrades.length}</span>
                            </div>
                            <div className="flex justify-between items-center group/stat cursor-help">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0A84FF] filter saturate-150">Aprobación Institucional</span>
                                <div className="flex items-center gap-3">
                                   <TrendingUp className="w-5 h-5 text-[#0A84FF]" />
                                   <span className="text-2xl font-black tracking-tighter text-[#0A84FF] italic">
                                       {((filteredGrades.filter(g => parseFloat(g.grade) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(1)}%
                                   </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center group/stat cursor-help text-[#FF453A]">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover/stat:opacity-100 transition-opacity">Vectores de Riesgo</span>
                                <span className="text-2xl font-black tracking-tighter italic">
                                    {filteredGrades.filter(g => parseFloat(g.grade) < 10).length} Alumnos
                                </span>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-18 bg-black text-white hover:bg-zinc-800 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all mt-6 shadow-2xl active:scale-95"
                        >
                            Generar Boletín Nucleo
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Grades Grid Noir */}
            <div className="grid gap-8 relative z-10">
                <AnimatePresence mode="popLayout">
                    {filteredGrades.length > 0 ? filteredGrades.map((g, i) => (
                        <motion.div 
                            key={g.id || i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="apple-pro-card p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12 group hover:border-white/20 hover:bg-white/[0.02] transition-all duration-700 cursor-default"
                        >
                            <div className="flex items-center gap-12">
                                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl border transition-all duration-1000 group-hover:rotate-3 ${
                                    parseFloat(g.grade) >= 10 ? 'bg-black text-white border-white/5' : 'bg-[#FF453A]/10 text-[#FF453A] border-[#FF453A]/20'
                                }`}>
                                    <GraduationCap className="w-10 h-10" strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-5">
                                       <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-1">Año {g.seccion}</p>
                                       <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                                       <Badge className="bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-lg italic">Lapso {g.lapso}</Badge>
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-3 transition-transform duration-700 leading-none">{g.student}</h3>
                                    <div className="flex items-center gap-10">
                                        <div className="flex items-center gap-3">
                                           <div className="p-2 rounded-lg bg-white/5">
                                              <FileText className="w-4 h-4 text-white/20" />
                                           </div>
                                           <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">{g.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                           <div className="p-2 rounded-lg bg-white/5">
                                              <Database className="w-4 h-4 text-white/20" />
                                           </div>
                                           <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Hash ID {g.id?.toString().slice(-4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-16">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-baseline gap-2 translate-y-2">
                                        <span className={`text-6xl font-black italic tracking-tighter leading-none ${
                                            parseFloat(g.grade) >= 18 ? 'text-white' : 
                                            parseFloat(g.grade) >= 10 ? 'text-white/60' : 'text-[#FF453A]'
                                        }`}>
                                            {parseFloat(g.grade).toFixed(2)}
                                        </span>
                                        <span className="text-[12px] font-black text-white/10 uppercase tracking-widest leading-none">/ 20</span>
                                    </div>
                                    <Badge className={`mt-6 border-none rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl ${
                                        parseFloat(g.grade) >= 18 ? 'bg-white text-black' :
                                        parseFloat(g.grade) >= 10 ? 'bg-white/5 text-white/40' : 
                                        'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/20'
                                    }`}>
                                        {parseFloat(g.grade) >= 18 ? 'Consolidación Plena' : 
                                         parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Requiere Refuerzo'}
                                    </Badge>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:text-white group-hover:bg-white/10 transition-all duration-700 cursor-pointer">
                                    <ChevronRight className="w-7 h-7" strokeWidth={3} />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-64 apple-pro-card border-dashed border-white/5 bg-transparent space-y-12 select-none opacity-20">
                            <div className="w-40 h-40 rounded-[3.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <TrendingUp className="w-16 h-16 text-white" strokeWidth={1} />
                                <div className="absolute inset-0 bg-white/5 blur-3xl animate-pulse" />
                            </div>
                            <div className="text-center space-y-4">
                               <p className="text-[14px] font-black uppercase tracking-[0.8em] text-white italic">Archivo Offline</p>
                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Sincronizando Metodología de Evaluación Institucional...</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls Noir */}
            <div className="fixed bottom-12 right-12 flex flex-col items-end gap-10 h-[80px]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-32 right-0"
                        >
                           <div className={`p-10 rounded-[3rem] border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-8 ${
                             msg.type === 'success' ? 'bg-[#1C1C1E] border-emerald-500/20 text-emerald-400' : 'bg-[#1C1C1E] border-red-500/20 text-red-400'
                           }`}>
                              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                {msg.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">Notificación del Núcleo</span>
                                <span className="text-md font-black uppercase tracking-tight mt-2">{msg.text}</span>
                              </div>
                              <button onClick={() => setMsg({text:'', type:''})} className="ml-10 p-3 hover:bg-white/10 rounded-full transition-colors">
                                 <X className="w-5 h-5 opacity-30 hover:opacity-100" />
                              </button>
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="flex items-center gap-6 no-print">
                   <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                   <Button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={bulkLoading}
                        className="h-20 px-10 bg-[#1C1C1E] border border-white/5 text-white/40 hover:text-white hover:bg-[#2C2C2E] rounded-[2.25rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex gap-5 active:scale-95 shadow-2xl"
                    >
                        {bulkLoading ? <Loader2 className="w-6 h-6 animate-spin text-[#0A84FF]" /> : <FileSpreadsheet className="w-6 h-6" strokeWidth={1.5} />}
                        Inyección Excel
                    </Button>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-20 px-16 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_30px_70px_rgba(255,255,255,0.1)] flex gap-8 group/main">
                                <Plus className="w-7 h-7 group-hover/main:rotate-90 transition-transform duration-700" strokeWidth={2.5} />
                                Nueva Calificación Pro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white rounded-[4rem] p-20 max-w-2xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]">
                            <DialogHeader className="mb-12">
                                <DialogTitle className="text-5xl font-black tracking-tighter text-white uppercase italic">Consolidación Pro</DialogTitle>
                                <DialogDescription className="text-white/20 font-black text-[11px] uppercase tracking-[0.5em] mt-4">Auditoría Académica • Andrés Bello v14.0</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-14">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Localizar Estudiante</label>
                                    <select 
                                        className="w-full bg-black border border-white/5 rounded-[1.75rem] h-18 px-8 text-sm font-black text-white outline-none focus:ring-1 focus:ring-[#0A84FF] appearance-none uppercase"
                                        value={newGrade.estudiante_id}
                                        onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="" className="text-white/20">Seleccionar perfil...</option>
                                        {students.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre} COMPLETO | {s.seccion}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Unidad Curricular / Materia</label>
                                    <Input 
                                        className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black uppercase tracking-widest text-xs italic px-8"
                                        placeholder="EJ: MATEMÁTICAS III"
                                        value={newGrade.materia}
                                        onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4 text-center">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Nota Final (0-20)</label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            className="bg-black border-white/5 h-20 rounded-[1.75rem] text-white text-5xl font-black text-center italic tracking-tighter"
                                            value={newGrade.nota}
                                            onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Momento Académico</label>
                                        <select 
                                            className="w-full bg-black border border-white/5 rounded-[1.75rem] h-20 px-8 text-xs font-black text-white outline-none appearance-none uppercase tracking-widest"
                                            value={newGrade.lapso}
                                            onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                        >
                                            <option value="1">1er Lapso</option>
                                            <option value="2">2do Lapso</option>
                                            <option value="3">3er Lapso</option>
                                        </select>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black mt-10 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.4em] shadow-2xl shadow-white/5"
                                >
                                    {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : "Sincronizar Nota"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32 no-print">
                <div className="flex items-center gap-4">
                    <Database className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Consolidación Digital de Activos Académicos</span>
                </div>
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Protocolo Andrés Bello Term v14.0</span>
                </div>
            </div>
        </div>
    );
};

export default Grades;
