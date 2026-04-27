import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  GraduationCap, 
  ClipboardCheck, 
  Wallet, 
  FileText, 
  Download,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layout
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import logo from './assets/logo.png';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const RepresentativeView = () => {
    const [cedula, setCedula] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!cedula) return;
        setLoading(true);
        setError('');
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/public/estudiante/${cedula}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                setError('No se encontró información para la cédula ingresada. Verifique con el plantel.');
            }
        } catch (err) {
            setError('Error de enlace con el servidor institucional.');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (!data) return;
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("UNIDAD EDUCATIVA ANDRÉS BELLO", 20, 20);
        doc.setFontSize(10);
        doc.text("BOLETÍN INFORMATIVO INSTITUCIONAL - V26.0 PLATINUM", 20, 30);

        // Body
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`ESTUDIANTE: ${data.student.nombre}`, 20, 55);
        doc.text(`CÉDULA: ${data.student.cedula}`, 20, 65);
        doc.text(`SECCIÓN: ${data.student.seccion}`, 20, 75);

        // Grades Table
        doc.autoTable({
            startY: 85,
            head: [['Materia', 'Nota', 'Lapso', 'Fecha']],
            body: data.grades.map(g => [g.materia, g.nota, g.lapso, g.fecha]),
            theme: 'grid',
            headStyles: { fillColor: [0, 102, 204] }
        });

        // Attendance Summary
        const attendanceY = doc.lastAutoTable.finalY + 20;
        doc.text("RESUMEN DE ASISTENCIA (ÚLTIMOS 10 REGISTROS)", 20, attendanceY);
        doc.autoTable({
            startY: attendanceY + 5,
            head: [['Fecha', 'Estado']],
            body: data.attendance.map(a => [a.fecha, a.estado]),
            theme: 'striped'
        });

        // Footer / Stamp
        const footerY = doc.lastAutoTable.finalY + 30;
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.5);
        doc.line(140, footerY + 20, 190, footerY + 20);
        doc.setFontSize(8);
        doc.text("SELLO Y FIRMA DE LA DIRECCIÓN", 142, footerY + 25);
        doc.text("VALIDADO ELECTRÓNICAMENTE POR NÚCLEO IA ANDRÉS BELLO", 20, footerY + 40);

        doc.save(`Boletin_${data.student.cedula}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#000] text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-12 py-10">
                {/* Header Public */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 rounded-full border-2 border-white/10 p-1 bg-white/5"
                    >
                        <img src={logo} className="w-full h-full object-cover rounded-full" alt="Logo" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Andrés Bello</h1>
                        <p className="text-[#86868b] font-bold text-[10px] tracking-[0.4em] uppercase">Portal de Consulta para Representantes</p>
                    </div>
                </div>

                {!data ? (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="apple-card p-12 max-w-lg mx-auto border border-white/5"
                    >
                        <form onSubmit={handleSearch} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block text-center">Identificación del Estudiante</label>
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-all" />
                                    <Input 
                                        placeholder="Ej: V-28123456" 
                                        className="h-16 pl-14 bg-white/5 border-white/5 rounded-2xl text-lg font-bold placeholder:text-white/20"
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Consultar Rendimiento"}
                            </Button>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center text-xs font-bold"
                                >
                                    <AlertCircle className="w-4 h-4 inline-block mr-2" />
                                    {error}
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {/* Student Info Card */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="apple-card p-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">{data.student.nombre}</h2>
                                    <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest">{data.student.cedula} • Sección {data.student.seccion}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={() => setData(null)} className="h-12 px-6 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">Nueva Consulta</Button>
                                <Button onClick={generatePDF} className="h-12 px-8 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Descargar Boletín
                                </Button>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Grades Section */}
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="apple-card p-8 border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-blue-500" /> Rendimiento Académico
                                    </h3>
                                    <Badge className="bg-blue-600 text-[8px] font-black">ACTUALIZADO</Badge>
                                </div>
                                <div className="space-y-4">
                                    {data.grades.length > 0 ? data.grades.map((g, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest">Lapso {g.lapso} • {g.fecha}</p>
                                                <h4 className="text-sm font-bold text-white">{g.materia}</h4>
                                            </div>
                                            <div className="text-xl font-black text-blue-500">{g.nota}</div>
                                        </div>
                                    )) : <p className="text-xs text-[#86868b] italic text-center py-10">Sin registros de notas para este periodo.</p>}
                                </div>
                            </motion.div>

                            {/* Attendance & Payments */}
                            <div className="space-y-8">
                                <motion.div 
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="apple-card p-8 border border-white/5"
                                >
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <ClipboardCheck className="w-4 h-4 text-emerald-500" /> Registro de Asistencia
                                    </h3>
                                    <div className="grid grid-cols-5 gap-2">
                                        {data.attendance.map((a, i) => (
                                            <div key={i} className={`h-12 rounded-xl flex items-center justify-center border ${
                                                a.estado === 'presente' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                                <div className="text-[8px] font-black uppercase">{a.fecha.split('-')[2]}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="apple-card p-8 border border-white/5"
                                >
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-amber-500" /> Estado de Solvencia
                                    </h3>
                                    <div className="space-y-3">
                                        {data.payments.length > 0 ? (
                                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-400">ESTUDIANTE SOLVENTE</span>
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase">{data.payments[0].mes_correspondiente}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                    <span className="text-xs font-bold text-red-400">PAGO PENDIENTE</span>
                                                </div>
                                                <span className="text-[10px] font-black text-red-500 uppercase">MOROSO</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center opacity-20">
                    <p className="text-[9px] font-black tracking-[0.5em] uppercase">Sistema Andrés Bello • v26.0 Platinum</p>
                </div>
            </div>
        </div>
    );
};

export default RepresentativeView;
