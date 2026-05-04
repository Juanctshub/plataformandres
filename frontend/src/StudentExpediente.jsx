import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Plus, 
    FileText, 
    TrendingUp, 
    Award, 
    User, 
    ChevronRight, 
    Bot, 
    Loader2, 
    AlertCircle, 
    CheckCircle2,
    History,
    ClipboardList,
    BookOpen
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

const StudentExpediente = ({ student, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newRecord, setNewRecord] = useState({ lapso: 1, conducta: 'Excelente', observaciones: '' });
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const fetchExpediente = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/estudiantes/${student.id}/expediente`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpediente(); }, [student.id]);

    const handleSubmitRecord = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/estudiantes/expediente`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ ...newRecord, estudiante_id: student.id })
            });
            if (res.ok) {
                setMsg({ text: 'Expediente actualizado', type: 'success' });
                setIsAdding(false);
                setNewRecord({ lapso: 1, conducta: 'Excelente', observaciones: '' });
                fetchExpediente();
            }
        } catch (e) {
            setMsg({ text: 'Error al sincronizar', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    const gradesBySubject = {};
    if (data?.grades) {
        data.grades.forEach(g => {
            const subject = g.materia || g.subject;
            if (!gradesBySubject[subject]) gradesBySubject[subject] = { 1: '-', 2: '-', 3: '-' };
            gradesBySubject[subject][g.lapso] = g.nota || g.grade;
        });
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-6"
        >
            <div className="w-full max-w-5xl bg-zinc-950 md:rounded-[3.5rem] h-full md:h-[90vh] border border-white/10 flex flex-col overflow-hidden relative">
                {/* Header Section */}
                <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-3xl md:text-4xl text-blue-400 font-black italic shadow-2xl">
                            {student.nombre[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">{student.nombre}</h2>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 text-[10px] font-black uppercase italic">ACTIVO</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-[#86868b]" />
                                    <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest">CI: {student.cedula}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <Award className="w-3.5 h-3.5 text-blue-500/60" />
                                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{student.seccion} Año/Sección</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={onClose} variant="ghost" className="rounded-full w-14 h-14 p-0 text-white/20 hover:text-white hover:bg-white/5 absolute top-6 right-6 md:static">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 space-y-16 pb-32">
                    {/* Performance Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-4 h-4 text-white/40" />
                                    <h3 className="text-[12px] font-black text-[#86868b] uppercase tracking-[0.3em]">Rendimiento Académico</h3>
                                </div>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Lapsos 1-3 Sincronizados</span>
                            </div>
                            
                            <div className="ios-card overflow-hidden border-white/5 bg-white/[0.02]">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="px-6 py-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Materia</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest text-center">L1</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest text-center">L2</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest text-center">L3</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest text-center">DEF</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {Object.entries(gradesBySubject).map(([sub, lapsos]) => {
                                            const scores = Object.values(lapsos).map(v => parseFloat(v)).filter(v => !isNaN(v));
                                            const def = scores.length > 0 ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : '-';
                                            return (
                                                <tr key={sub} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm font-bold text-white italic">{sub}</span>
                                                    </td>
                                                    {[1,2,3].map(l => (
                                                        <td key={l} className="px-6 py-5 text-center">
                                                            <span className={`text-sm font-black ${parseFloat(lapsos[l]) < 10 ? 'text-red-500' : 'text-white/60'}`}>
                                                                {lapsos[l]}
                                                            </span>
                                                        </td>
                                                    ))}
                                                    <td className="px-6 py-5 text-center bg-white/[0.01]">
                                                        <span className={`text-sm font-black ${parseFloat(def) < 10 ? 'text-red-500' : 'text-blue-400'}`}>
                                                            {def}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {Object.keys(gradesBySubject).length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-bold text-white/10 uppercase tracking-widest">
                                                    Sin calificaciones cargadas en este ciclo
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-4 h-4 text-white/40" />
                                    <h3 className="text-[12px] font-black text-[#86868b] uppercase tracking-[0.3em]">Conducta y Observaciones</h3>
                                </div>
                                <Button 
                                    onClick={() => setIsAdding(true)}
                                    className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white p-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {data?.records.map((r, i) => (
                                    <div key={i} className="ios-card p-6 bg-white/[0.02] border-white/5 space-y-4 group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-white/5 text-[#86868b] border-none px-3 font-black text-[8px] uppercase">{r.lapso} LAPSO</Badge>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{r.conducta}</span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed italic">"{r.observaciones}"</p>
                                        <div className="pt-2 border-t border-white/5">
                                            <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Registrado: {new Date(r.fecha).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {data?.records.length === 0 && (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
                                        <History className="w-8 h-8 text-white/5" />
                                        <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Sin antecedentes registrados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Record Modal Overlay */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl p-8 md:p-12 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Actualizar Expediente</h3>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-2">Protocolo de Registro Disciplinario</p>
                                </div>
                                <Button onClick={() => setIsAdding(false)} variant="ghost" className="rounded-full w-12 h-12 p-0 text-white/40 hover:text-white">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmitRecord} className="max-w-2xl space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Lapso Escolar</label>
                                        <select 
                                            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold outline-none appearance-none"
                                            value={newRecord.lapso}
                                            onChange={(e) => setNewRecord({...newRecord, lapso: e.target.value})}
                                        >
                                            <option value="1" className="bg-zinc-950">1er Lapso</option>
                                            <option value="2" className="bg-zinc-950">2do Lapso</option>
                                            <option value="3" className="bg-zinc-950">3er Lapso</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Conducta Global</label>
                                        <select 
                                            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold outline-none appearance-none"
                                            value={newRecord.conducta}
                                            onChange={(e) => setNewRecord({...newRecord, conducta: e.target.value})}
                                        >
                                            <option value="Excelente" className="bg-zinc-950">Excelente</option>
                                            <option value="Positivo" className="bg-zinc-950">Positivo</option>
                                            <option value="Regular" className="bg-zinc-950">Regular</option>
                                            <option value="Deficiente" className="bg-zinc-950">Deficiente</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Observaciones y Análisis</label>
                                    <textarea 
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-white font-semibold text-sm outline-none min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                                        placeholder="Describa el comportamiento y rendimiento del estudiante durante este periodo..."
                                        value={newRecord.observaciones}
                                        onChange={(e) => setNewRecord({...newRecord, observaciones: e.target.value})}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={submitting} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    {submitting ? 'Sincronizando...' : 'Añadir al Expediente'}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status bar */}
                <div className="mt-auto p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-12">
                    <div className="flex items-center gap-3">
                        <Bot className="w-4 h-4 text-blue-500/40" />
                        <span className="text-[8px] font-black text-[#86868b] uppercase tracking-widest">Análisis de Datos Activo • Motor v14.2</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-[#86868b] uppercase tracking-widest">ASISTENCIA</span>
                            <span className="text-[10px] font-black text-emerald-400">{data?.attendanceStats ? ((data.attendanceStats.presentes / data.attendanceStats.total) * 100 || 0).toFixed(0) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentExpediente;
