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
  Sparkles
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

                setMsg({ text: `Carga exitosa: ${successCount} registros sincronizados.`, type: 'success' });
                fetchData();
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
        doc.text("BOLETÍN OFICIAL DE RENDIMIENTO ACADÉMICO - V26.0 PLATINUM", 20, 32);
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
      <div className="space-y-12">
          <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 apple-glass rounded-[2rem] animate-pulse" />
              <div className="h-80 apple-glass rounded-[2rem] animate-pulse" />
          </div>
      </div>
    );

    return (
        <div className="space-y-12">
            {/* Search & Tabs */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
               <div className="flex items-center gap-6 flex-1">
                  <div className="relative flex-1 max-w-lg group">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                     <Input 
                        placeholder="..." 
                        className="pl-16 h-14 bg-white/5 border-white/5 rounded-2xl text-white text-sm font-medium focus:ring-1 focus:ring-blue-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                     {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => setYearFilter(y)}
                          className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                            yearFilter === y 
                              ? 'bg-white text-black shadow-lg' 
                              : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {y} {y !== 'Todos' && 'Año'}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx, .xls" className="hidden" />
                  <Button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={bulkLoading}
                    className="h-14 px-8 apple-glass border border-white/5 text-white/50 hover:text-white hover:bg-white/5 rounded-2xl font-semibold text-xs transition-all flex gap-3"
                  >
                    {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                    Carga Masiva
                  </Button>
                  <Button 
                        onClick={exportToExcel}
                        variant="outline"
                        className="h-14 px-8 apple-glass border-white/10 text-white/50 hover:text-white hover:bg-white/5 rounded-2xl font-semibold text-xs flex gap-3 transition-all bg-transparent"
                    >
                        <Download className="w-5 h-5" />
                        Descargar Acta
                    </Button>

                  <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-14 px-10 bg-blue-600 text-white hover:bg-blue-500 rounded-2xl font-semibold text-xs flex gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                        <Plus className="w-5 h-5" />
                        Registrar Nota
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="apple-glass border-white/10 p-16 rounded-[3rem] max-w-xl">
                       <DialogHeader className="mb-10">
                          <DialogTitle className="text-3xl font-semibold text-white tracking-tight">Consolidación de Nota</DialogTitle>
                          <DialogDescription className="text-[#86868b] font-medium mt-3">Registro académico v15.0</DialogDescription>
                       </DialogHeader>
                       <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-3">
                             <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Estudiante</label>
                             <select 
                               className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                               value={newGrade.estudiante_id}
                               onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                               required
                             >
                                <option value="" className="text-black">Seleccionar alumno...</option>
                                {students.map(s => <option key={s.id} value={s.id} className="text-black">{s.nombre} ({s.seccion})</option>)}
                             </select>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Materia</label>
                             <Input 
                                placeholder="Ej: Castellano"
                                className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                                value={newGrade.materia}
                                onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                required
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-3">
                                <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Nota (0-20)</label>
                                <Input 
                                   type="number"
                                   min="0"
                                   max="20"
                                   placeholder="20"
                                   className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium text-center text-xl"
                                   value={newGrade.nota}
                                   onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                   required
                                />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Momento</label>
                                <select 
                                   className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none appearance-none"
                                   value={newGrade.lapso}
                                   onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                >
                                   <option value="1" className="text-black">1er Lapso</option>
                                   <option value="2" className="text-black">2do Lapso</option>
                                   <option value="3" className="text-black">3er Lapso</option>
                                </select>
                             </div>
                          </div>
                          <Button type="submit" disabled={submitting} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all shadow-2xl">
                             {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Guardar Calificación"}
                          </Button>
                       </form>
                    </DialogContent>
                  </Dialog>
               </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Promedio Global', value: (filteredGrades.reduce((acc, c) => acc + (parseFloat(c.grade) || 0), 0) / (filteredGrades.length || 1)).toFixed(1), icon: Target, color: 'text-white' },
                  { label: 'Aprobación', value: `${((filteredGrades.filter(g => (parseFloat(g.grade) || 0) >= 10).length / (filteredGrades.length || 1)) * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Total Registros', value: filteredGrades.length, icon: Database, color: 'text-blue-400' },
                ].map((m, i) => (
                  <div key={i} className="apple-card p-8 flex items-center justify-between border-white/[0.03]">
                     <div>
                        <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">{m.label}</p>
                        <div className={`text-4xl font-semibold tracking-tight ${m.color}`}>{m.value}</div>
                     </div>
                     <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${m.color}`}>
                        <m.icon className="w-6 h-6" />
                     </div>
                  </div>
                ))}
            </div>

            {/* Grades Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredGrades.length > 0 ? (
                    filteredGrades.map((g, i) => (
                      <motion.div
                        key={g.id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="apple-card group p-8 flex items-center justify-between hover:translate-y-0"
                      >
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white/[0.03] border border-white/5 ${
                               parseFloat(g.grade) >= 10 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                               <GraduationCap className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-lg font-semibold text-white tracking-tight">{g.student}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="text-xs text-[#86868b] font-medium">{g.subject}</span>
                                  <div className="w-1 h-1 rounded-full bg-white/10" />
                                  <span className="text-xs text-[#86868b] font-medium uppercase tracking-wider">Lapso {g.lapso}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-8">
                            <div className="flex flex-col items-end mr-4">
                               <div className={`text-3xl font-semibold tracking-tight ${
                                  parseFloat(g.grade) >= 18 ? 'text-blue-400' : 
                                  parseFloat(g.grade) >= 10 ? 'text-white' : 'text-red-400'
                               }`}>
                                  {parseFloat(g.grade).toFixed(1)}
                               </div>
                               <Badge className={`mt-2 rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest ${
                                  parseFloat(g.grade) >= 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                               }`}>
                                  {parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Reprobado'}
                                </Badge>
                             </div>
                             <div className="flex gap-2">
                               <Button 
                                 onClick={() => generateIndividualPDF(g.estudiante_id)}
                                 className="w-10 h-10 rounded-xl bg-white/5 text-[#86868b] hover:text-white hover:bg-white/10 p-0"
                               >
                                 <FileText className="w-4 h-4" />
                               </Button>
                               <button className="p-2.5 rounded-full bg-white/5 text-white/10 group-hover:text-white transition-all">
                                  <ChevronRight className="w-5 h-5" />
                               </button>
                             </div>
                          </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-30">
                       <BarChart3 className="w-16 h-16" />
                       <p className="text-sm font-semibold tracking-widest uppercase">Sin registros académicos</p>
                    </div>
                  )}
               </AnimatePresence>
            </div>

            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-32 right-12 z-[110]"
               >
                  <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl border-white/5">
                     <div className={`p-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Grades System</span>
                        <span className="text-sm font-semibold text-white mt-0.5">{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-1.5 hover:bg-white/5 rounded-full transition-colors opacity-30">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default Grades;
