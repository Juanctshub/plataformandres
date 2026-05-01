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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto py-6 sm:py-12 space-y-6 px-4 sm:px-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Evaluación Continua</p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Calificaciones</h1>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-9 px-4 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-200">
                          <Plus className="w-3.5 h-3.5 mr-2" />
                          Registrar nota
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 p-6 sm:p-8 rounded-xl max-w-lg">
                       <DialogHeader className="mb-6">
                          <DialogTitle className="text-xl font-semibold text-white tracking-tight">Registrar Nota</DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground mt-1">Añadir calificación al sistema</DialogDescription>
                       </DialogHeader>
                       <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-xs text-muted-foreground font-medium">Alumno</label>
                             <select 
                                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg h-10 px-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                                value={newGrade.estudiante_id}
                                onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                required
                             >
                                <option value="" className="bg-zinc-900">Seleccionar...</option>
                                {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.nombre} ({s.cedula})</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-muted-foreground font-medium">Asignatura</label>
                             <Input 
                                placeholder="Ej: Matemáticas"
                                className="h-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-white text-sm"
                                value={newGrade.materia}
                                onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                required
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs text-muted-foreground font-medium">Nota (0-20)</label>
                                <Input 
                                   type="number"
                                   min="0"
                                   max="20"
                                   placeholder="20"
                                   className="h-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-white text-sm"
                                   value={newGrade.nota}
                                   onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                   required
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs text-muted-foreground font-medium">Lapso</label>
                                <select 
                                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg h-10 px-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                                  value={newGrade.lapso}
                                  onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                >
                                  <option value="1" className="bg-zinc-900">1er Lapso</option>
                                  <option value="2" className="bg-zinc-900">2do Lapso</option>
                                  <option value="3" className="bg-zinc-900">3er Lapso</option>
                                </select>
                             </div>
                          </div>
                          <Button type="submit" disabled={submitting} className="w-full h-10 mt-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-all">
                             {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Nota"}
                          </Button>
                       </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por estudiante o materia..." 
                        className="h-10 pl-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-sm text-white placeholder:text-muted-foreground/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {years.map((y) => (
                        <button
                            key={y}
                            onClick={() => setYearFilter(y)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                yearFilter === y 
                                ? 'bg-white text-black' 
                                : 'bg-white/[0.03] text-muted-foreground hover:text-white border border-white/[0.06]'
                            }`}
                        >
                            {y} {y !== 'Todos' && (isMobile ? '' : 'Año')}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
                    <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                    <Button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={bulkLoading}
                        variant="outline"
                        className="h-10 px-3 rounded-lg text-xs font-medium bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                        title="Importar notas"
                    >
                        {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                    </Button>
                    <Button 
                        onClick={exportToExcel}
                        variant="outline"
                        className="h-10 px-3 rounded-lg text-xs font-medium bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                        title="Exportar acta"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Promedio', value: (filteredGrades.reduce((acc, c) => acc + (parseFloat(c.grade) || 0), 0) / (filteredGrades.length || 1)).toFixed(1), icon: Target, color: 'text-white' },
                  { label: 'Aprobación', value: `${((filteredGrades.filter(g => (parseFloat(g.grade) || 0) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Registros', value: filteredGrades.length, icon: Database, color: 'text-blue-400' },
                ].map((m, i) => (
                  <div key={i} className="stat-card flex items-center gap-3 p-3">
                      <m.icon className={`w-4 h-4 ${m.color} flex-shrink-0`} />
                      <div className="min-w-0">
                          <div className={`text-lg font-semibold ${m.color}`}>{m.value}</div>
                          <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      </div>
                  </div>
                ))}
            </div>

            {/* Main Grades Listing */}
            <div className="space-y-2">
               <div className="flex items-center gap-3 px-1 mb-3">
                   <Layers className="w-4 h-4 text-muted-foreground" />
                   <h3 className="text-xs text-muted-foreground">Listado de evaluaciones</h3>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                   {filteredGrades.length > 0 ? (
                     filteredGrades.map((g, i) => (
                       <motion.div
                         key={g.id || i}
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.98 }}
                         className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                       >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                             <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/[0.03] ${
                                parseFloat(g.grade) >= 10 ? 'text-emerald-400' : 'text-red-400'
                             }`}>
                                <GraduationCap className="w-5 h-5" />
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-sm font-medium text-white truncate">{g.student}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <span className="text-[10px] text-amber-500 font-medium truncate">{g.subject}</span>
                                   <span className="text-[10px] text-muted-foreground">Lapso {g.lapso}</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 pl-4 shrink-0">
                             <div className="text-right">
                                <div className={`text-xl font-semibold leading-none ${
                                   parseFloat(g.grade) >= 18 ? 'text-blue-500' : 
                                   parseFloat(g.grade) >= 10 ? 'text-white' : 'text-red-500'
                                }`}>
                                   {parseFloat(g.grade).toFixed(1)}
                                </div>
                                <Badge className={`mt-1 h-5 px-1.5 text-[9px] font-medium border-transparent ${
                                   parseFloat(g.grade) >= 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                   {parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Reprobado'}
                                 </Badge>
                             </div>
                             <Button 
                               onClick={() => generateIndividualPDF(g.estudiante_id)}
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-muted-foreground hover:text-white"
                             >
                               <Printer className="w-4 h-4" />
                             </Button>
                          </div>
                       </motion.div>
                     ))
                   ) : (
                     <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                        <BarChart3 className="w-8 h-8 opacity-20" />
                        <div className="text-center">
                           <h4 className="text-sm font-medium text-white">Sin datos</h4>
                           <p className="text-xs">No hay calificaciones registradas</p>
                        </div>
                     </div>
                   )}
                </AnimatePresence>
               </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
               {msg.text && (
                 <motion.div 
                   initial={{ opacity: 0, y: -8 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -8 }}
                   className={`fixed top-24 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-lg text-sm font-medium shadow-xl flex items-center gap-2 ${
                     msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
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
