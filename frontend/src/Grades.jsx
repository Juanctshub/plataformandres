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
import { Badge } from "./components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription
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
    const [bulkLoading, setBulkLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [yearFilter, setYearFilter] = useState('Todos');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
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
            const gData = resG.ok ? await resG.json() : [];
            const sData = resS.ok ? await resS.json() : [];
            setGrades(Array.isArray(gData) ? gData : []);
            setStudents(Array.isArray(sData) ? sData : []);
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
            setMsg({ text: 'Rango de escala 0-20 no válido', type: 'error' });
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
                setMsg({ text: 'Nota registrada exitosamente', type: 'success' });
                setIsAddModalOpen(false);
                setNewGrade({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
                fetchData();
                window.dispatchEvent(new Event('refresh-dashboard'));
            }
        } catch (e) {
            setMsg({ text: 'Error al conectar con el servidor', type: 'error' });
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
                const bulkPayload = [];

                for (const row of data) {
                    const student = students.find(s => 
                        s.cedula === String(row.Cedula || row.ID) || 
                        s.nombre.toLowerCase() === String(row.Estudiante || row.Student).toLowerCase()
                    );
                    
                    if (!student) continue;

                    bulkPayload.push({
                        estudiante_id: student.id,
                        materia: row.Materia || row.Subject || 'Sin Asignar',
                        nota: parseFloat(row.Nota || row.Grade || 0),
                        lapso: String(row.Lapso || row.Period || '1')
                    });
                }

                if (bulkPayload.length > 0) {
                    const res = await fetch(`${baseUrl}/api/notas/bulk`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ data: bulkPayload })
                    });
                    if (res.ok) successCount = bulkPayload.length;
                }

                setMsg({ text: `Lote procesado: ${successCount} notas importadas`, type: 'success' });
                fetchData();
                window.dispatchEvent(new Event('refresh-dashboard'));
            } catch (err) {
                setMsg({ text: 'Error al procesar archivo Excel', type: 'error' });
            } finally {
                setBulkLoading(false);
                setTimeout(() => setMsg({ text: '', type: '' }), 5000);
            }
        };
        reader.readAsBinaryString(file);
    };

    const generateIndividualPDF = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        const studentGrades = grades.filter(g => g.estudiante_id === studentId);
        
        const doc = new jsPDF();
        
        // Institutional Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("UNIDAD EDUCATIVA ANDRÉS BELLO", 20, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("BOLETÍN OFICIAL DE RENDIMIENTO ACADÉMICO - V30.0 CORE", 20, 32);
        doc.text(`CÓDIGO INSTITUCIONAL: AB-2026-SAAS`, 20, 38);

        // Student Banner
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.text(`ESTUDIANTE: ${student.nombre}`, 20, 60);
        doc.text(`CÉDULA: ${student.cedula}`, 20, 68);
        doc.text(`SECCIÓN: ${student.seccion}`, 20, 76);
        doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString()}`, 140, 60);

        // Grades Table
        doc.autoTable({
            startY: 85,
            head: [['Materia', 'Nota / Escala 20', 'Lapso', 'Estado']],
            body: studentGrades.map(g => [
                g.subject, 
                g.grade, 
                `Lapso ${g.lapso}`,
                g.grade >= 10 ? 'Aprobado' : 'Reprobado'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10 }
        });

        // Professional Stamp / Footer
        const finalY = doc.lastAutoTable.finalY + 40;
        
        // Circular Stamp Representation
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1);
        doc.circle(160, finalY - 10, 25);
        doc.setFontSize(7);
        doc.text("VALIDADO POR", 148, finalY - 15);
        doc.text("NÚCLEO IA", 152, finalY - 10);
        doc.text("ANDRÉS BELLO", 147, finalY - 5);
        
        doc.line(20, finalY + 10, 80, finalY + 10);
        doc.setFontSize(8);
        doc.text("FIRMA DE LA DIRECCIÓN", 30, finalY + 18);
        
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text("Este documento es una representación digital válida de los registros académicos institucionales.", 20, 280);
        doc.text("Verificable mediante Cédula de Identidad en el Portal del Representante.", 20, 285);

        doc.save(`Boletin_${student.cedula}_${new Date().getTime()}.pdf`);
    };

    const exportToExcel = () => {
        const dataToExport = grades.map(g => {
            const student = students.find(s => s.id === g.estudiante_id);
            return {
                Alumno: student?.nombre || 'Desconocido',
                Cedula: student?.cedula || 'N/A',
                Materia: g.subject,
                Nota: g.grade,
                Lapso: g.lapso,
                Fecha: g.fecha
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
        XLSX.writeFile(wb, "Acta_Notas_Andres_Bello.xlsx");
    };

    const filteredGrades = Array.isArray(grades) ? grades.filter(g => {
        if (!g) return false;
        const studentName = g.student || g.nombre || '';
        const subjectName = g.subject || g.materia || '';
        const sectionName = g.seccion || '';
        
        const matchesSearch = (studentName.toLowerCase()).includes(searchTerm.toLowerCase()) || 
                             (subjectName.toLowerCase()).includes(searchTerm.toLowerCase());
        const matchesYear = yearFilter === 'Todos' || sectionName.includes(yearFilter);
        return matchesSearch && matchesYear;
    }).map(g => ({
        ...g,
        student: g.student || g.nombre || 'Estudiante',
        subject: g.subject || g.materia || 'Materia',
        grade: g.grade || g.nota || 0
    })) : [];

    const years = ['Todos', '1ro', '2do', '3ro', '4to', '5to'];

    if (loading) return (
      <div className="max-w-7xl mx-auto py-16 px-6 space-y-24">
          <div className="h-40 bg-white/5 rounded-[3rem] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white/5 rounded-[4rem] animate-pulse" />)}
          </div>
      </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6"
        >
            {/* Premium Header: Apple Style v30.0 */}
            <motion.div className="space-y-8 sm:space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-8 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                   <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-5 py-1.5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em]">
                      Núcleo de Calificaciones v30.0
                   </Badge>
                </div>
                
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                          Calificaciones
                        </h2>
                        <p className="text-sm text-[#86868b] font-normal max-w-md leading-relaxed">
                          Registro y analítica de evaluación continua.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full xl:w-auto">
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                              <Button className="h-20 sm:h-24 px-12 sm:px-16 bg-white text-black hover:bg-zinc-200 rounded-[2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] transition-all flex gap-6 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] active:scale-95 flex-1 sm:flex-none border border-white/10">
                                <Plus className="w-6 h-6" />
                                Registrar Nota
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="apple-glass border-white/10 p-10 sm:p-20 rounded-[3rem] sm:rounded-[4rem] max-w-2xl overflow-hidden">
                               <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
                               <DialogHeader className="mb-12">
                                  <DialogTitle className="text-3xl sm:text-5xl font-black text-white tracking-tighter italic uppercase">Registro de Nota</DialogTitle>
                                  <DialogDescription className="text-[10px] sm:text-xs text-amber-500 font-black uppercase tracking-[0.4em] mt-4 italic">Protocolo de Evaluación v30.0</DialogDescription>
                               </DialogHeader>
                               <form onSubmit={handleSubmit} className="space-y-8">
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Alumno a Evaluar</label>
                                     <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] h-16 px-8 text-sm text-white outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none font-bold"
                                        value={newGrade.estudiante_id}
                                        onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                        required
                                     >
                                        <option value="" className="bg-zinc-900">Seleccionar Estudiante...</option>
                                        {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.nombre} ({s.cedula})</option>)}
                                     </select>
                                  </div>
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Asignatura / Materia</label>
                                     <Input 
                                        placeholder="Ej: Matemáticas Avanzadas"
                                        className="h-16 bg-white/5 border-white/10 rounded-[2rem] text-white font-bold px-8"
                                        value={newGrade.materia}
                                        onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                        required
                                     />
                                  </div>
                                  <div className="grid grid-cols-2 gap-8">
                                     <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Calificación (0-20)</label>
                                        <Input 
                                           type="number"
                                           min="0"
                                           max="20"
                                           placeholder="20"
                                           className="h-16 bg-white/5 border-white/10 rounded-[2rem] text-white font-black text-xl px-8"
                                           value={newGrade.nota}
                                           onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                           required
                                        />
                                     </div>
                                     <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Periodo Académico</label>
                                        <select 
                                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] h-16 px-8 text-sm text-white outline-none appearance-none font-bold"
                                          value={newGrade.lapso}
                                          onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                        >
                                          <option value="1" className="bg-zinc-900">1er Lapso</option>
                                          <option value="2" className="bg-zinc-900">2do Lapso</option>
                                          <option value="3" className="bg-zinc-900">3er Lapso</option>
                                        </select>
                                     </div>
                                  </div>
                                  <Button type="submit" disabled={submitting} className="w-full h-20 bg-amber-600 text-white hover:bg-amber-500 rounded-full font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95">
                                     {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : "Sincronizar con Expediente"}
                                  </Button>
                               </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            {/* Action Bar: Import/Export & Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 relative z-10">
                   <div className="relative w-full md:flex-1 md:max-w-2xl group/search">
                      <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868b] group-focus-within/search:text-amber-500 transition-colors" />
                       <Input 
                         placeholder="Buscar por estudiante o materia..." 
                         className="pl-24 h-18 sm:h-20 bg-white/5 border-white/5 rounded-[2.5rem] text-white text-base font-black italic tracking-tighter focus:ring-1 focus:ring-amber-500/50"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto bg-white/5 p-2 rounded-full border border-white/5">
                      {years.map((y) => (
                         <button
                           key={y}
                           onClick={() => setYearFilter(y)}
                           className={`px-10 py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                             yearFilter === y 
                               ? 'bg-white text-black shadow-2xl' 
                               : 'text-[#86868b] hover:text-white hover:bg-white/5'
                           }`}
                         >
                           {y} {y !== 'Todos' && (isMobile ? '' : 'Año')}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                   <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                   <Button 
                     onClick={() => fileInputRef.current.click()}
                     disabled={bulkLoading}
                     className="h-16 sm:h-18 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-[#86868b] hover:text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex gap-4 transition-all"
                   >
                     {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                     Carga Masiva
                   </Button>
                   <Button 
                         onClick={exportToExcel}
                         className="h-16 sm:h-18 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-[#86868b] hover:text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex gap-4 transition-all"
                     >
                         <Download className="w-5 h-5" />
                         Acta Excel
                     </Button>
                </div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            </div>

            {/* Tactical Metrics: Mini Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
                {[
                  { label: 'Promedio Global', value: (filteredGrades.reduce((acc, c) => acc + (parseFloat(c.grade) || 0), 0) / (filteredGrades.length || 1)).toFixed(1), icon: Target, color: 'text-white', bg: 'bg-white/5' },
                  { label: 'Indice Aprobación', value: `${((filteredGrades.filter(g => (parseFloat(g.grade) || 0) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Registros Maestro', value: filteredGrades.length, icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map((m, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className={`bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3.5rem] flex items-center justify-between group transition-all duration-500 ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
                  >
                     <div className="space-y-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m.bg} ${m.color} border border-white/5 shadow-xl`}>
                            <m.icon className="w-7 h-7" />
                        </div>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] leading-none">{m.label}</p>
                     </div>
                     <div className={`text-5xl sm:text-6xl font-black tracking-tighter italic ${m.color}`}>{m.value}</div>
                  </motion.div>
                ))}
            </div>

            {/* Main Grades Listing: Premium Tactical Interface */}
            <div className="space-y-10 sm:space-y-16">
               <div className="flex items-center gap-6 ml-8">
                   <Layers className="w-6 h-6 text-white/20" />
                   <h3 className="text-2xl font-black text-white/40 uppercase tracking-[0.5em] italic">Bitácora de Evaluación</h3>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14">
                <AnimatePresence mode="popLayout">
                   {filteredGrades.length > 0 ? (
                     filteredGrades.map((g, i) => (
                       <motion.div
                         key={g.id || i}
                         initial={{ opacity: 0, scale: 0.95, y: 20 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         transition={{ delay: i * 0.03 }}
                         className="group relative rounded-[4rem] p-10 sm:p-14 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-700 overflow-hidden"
                       >
                          <div className="flex items-center justify-between gap-10 relative z-10">
                             <div className="flex items-center gap-8 flex-1 overflow-hidden">
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[2.5rem] flex items-center justify-center transition-all bg-white/[0.03] border border-white/5 shadow-2xl ${
                                   parseFloat(g.grade) >= 10 ? 'text-emerald-400 border-emerald-500/20' : 'text-red-400 border-red-500/20'
                                }`}>
                                   <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12" />
                                </div>
                                <div className="space-y-3 overflow-hidden">
                                   <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic truncate">{g.student}</h4>
                                   <div className="flex items-center gap-4">
                                      <span className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] italic">{g.subject}</span>
                                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                      <Badge className="bg-white/5 text-[#86868b] border-none rounded-lg px-4 py-1 text-[10px] font-black uppercase tracking-widest">LAPSO {g.lapso}</Badge>
                                   </div>
                                </div>
                             </div>

                             <div className="flex flex-col items-end gap-6">
                                <div className="text-right">
                                   <div className={`text-5xl sm:text-7xl font-black tracking-tighter italic leading-none ${
                                      parseFloat(g.grade) >= 18 ? 'text-blue-500' : 
                                      parseFloat(g.grade) >= 10 ? 'text-white' : 'text-red-500'
                                   }`}>
                                      {parseFloat(g.grade).toFixed(1)}
                                   </div>
                                   <Badge className={`mt-4 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl ${
                                      parseFloat(g.grade) >= 10 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/10'
                                   }`}>
                                      {parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Reprobado'}
                                    </Badge>
                                 </div>
                                 <Button 
                                   onClick={() => generateIndividualPDF(g.estudiante_id)}
                                   className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.8rem] bg-white/5 hover:bg-white text-[#86868b] hover:text-black border border-white/10 p-0 flex items-center justify-center transition-all shadow-2xl"
                                 >
                                   <Printer className="w-6 h-6 sm:w-8 sm:h-8" />
                                 </Button>
                              </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                       </motion.div>
                     ))
                   ) : (
                     <div className="col-span-full py-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[5rem] opacity-30 space-y-12 bg-white/[0.01]">
                        <div className="w-36 h-36 rounded-[3.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
                           <BarChart3 className="w-18 h-18" />
                        </div>
                        <div className="text-center space-y-4">
                           <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Cero Data Académica</h4>
                           <p className="text-[11px] font-black tracking-[0.5em] uppercase text-[#86868b]">Sin registros detectados en este filtro</p>
                        </div>
                     </div>
                   )}
                </AnimatePresence>
               </div>
            </div>

            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed bottom-32 sm:bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0 z-[2000] w-[calc(100%-2rem)] sm:w-auto"
               >
                  <div className="apple-glass p-10 rounded-[3rem] flex items-center gap-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                     </div>
                     <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] italic leading-none">Sincronización de Calificaciones</span>
                        <span className="text-xl font-black text-white mt-2 italic uppercase tracking-tighter leading-none">{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="p-4 hover:bg-white/5 rounded-full transition-colors opacity-30 group">
                        <X className="w-8 h-8 group-hover:text-white" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-6 text-[#86868b] select-none opacity-20 pt-16">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] italic">Andrés Bello Kernel v30.0 — Evaluación Certificada</span>
            </div>
        </motion.div>
    );
};

export default Grades;
