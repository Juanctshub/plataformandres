import React, { useState, useEffect } from 'react';
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
  AlertCircle
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

const Grades = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newGrade, setNewGrade] = useState({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
    const [msg, setMsg] = useState({ text: '', type: '' });

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
        e.preventDefault();
        if (parseFloat(newGrade.nota) < 0 || parseFloat(newGrade.nota) > 20) {
            setMsg({ text: 'La nota debe estar entre 0 y 20', type: 'error' });
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
                setMsg({ text: 'Calificación registrada', type: 'success' });
                setIsAddModalOpen(false);
                setNewGrade({ estudiante_id: '', materia: '', nota: '', lapso: '1' });
                fetchData();
            }
        } catch (e) {
            setMsg({ text: 'Error al registrar nota', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        }
    };

    const filteredGrades = grades.filter(g => 
        g.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Calificaciones</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Registro y auditoría de rendimiento académico (Escala 0-20).</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white/40 transition-colors" />
                        <Input 
                            placeholder="Buscar por alumno o materia..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 w-[300px] bg-zinc-900/50 border-white/5 rounded-2xl apple-input-focus placeholder:text-zinc-700 text-white/80"
                        />
                    </div>
                    
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
                                <Plus className="w-5 h-5" />
                                Cargar Notas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 backdrop-blur-3xl border-white/10 text-white rounded-[2.5rem] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-semibold tracking-tight text-white">Cargar Calificación</DialogTitle>
                                <DialogDescription className="text-zinc-500 font-medium">Asignación de puntaje académico por lapso.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Estudiante</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                                        value={newGrade.estudiante_id}
                                        onChange={(e) => setNewGrade({...newGrade, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-black">Seleccionar Alumno</option>
                                        {students.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre} ({s.seccion})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Materia</label>
                                    <Input 
                                        placeholder="Ej: Matemáticas"
                                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                        value={newGrade.materia}
                                        onChange={(e) => setNewGrade({...newGrade, materia: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Nota (0-20)</label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="20"
                                            className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                            value={newGrade.nota}
                                            onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Lapso</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                                            value={newGrade.lapso}
                                            onChange={(e) => setNewGrade({...newGrade, lapso: e.target.value})}
                                        >
                                            <option value="1" className="bg-black">1er Lapso</option>
                                            <option value="2" className="bg-black">2do Lapso</option>
                                            <option value="3" className="bg-black">3er Lapso</option>
                                        </select>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold mt-4 transition-all active:scale-95 text-lg"
                                >
                                    {submitting ? "Sincronizando..." : "Registrar Calificación"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredGrades.length > 0 ? filteredGrades.map((g, i) => (
                        <motion.div 
                            key={g.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="apple-card p-8 flex items-center justify-between group transition-all duration-700 bg-zinc-900/40 border-white/[0.05] hover:bg-zinc-800/40"
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-2xl relative overflow-hidden ${
                                    parseFloat(g.grade) >= 10 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <GraduationCap className="w-8 h-8 relative z-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white/90 group-hover:text-apple-gradient transition-all duration-700 uppercase italic tracking-tight">{g.student}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge className="bg-zinc-950/50 text-zinc-500 border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">{g.subject}</Badge>
                                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <Badge className="bg-blue-500/5 text-blue-400/60 border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">Lapso {g.lapso}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="flex flex-col items-end">
                                    <span className={`text-4xl font-semibold tracking-tighter transition-all duration-700 ${
                                        parseFloat(g.grade) >= 15 ? 'text-apple-gradient' : 
                                        parseFloat(g.grade) >= 10 ? 'text-white' : 'text-red-500'
                                    }`}>
                                        {parseFloat(g.grade).toFixed(1)}
                                    </span>
                                    <Badge className={`mt-1 border-none rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                        parseFloat(g.grade) >= 18 ? 'bg-purple-500/10 text-purple-400' :
                                        parseFloat(g.grade) >= 10 ? 'bg-emerald-500/10 text-emerald-400' : 
                                        'bg-red-500/10 text-red-400'
                                    }`}>
                                        {parseFloat(g.grade) >= 18 ? 'Sobresaliente' : 
                                         parseFloat(g.grade) >= 10 ? 'Aprobado' : 'Riesgo Crítico'}
                                    </Badge>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-32 text-zinc-800 space-y-4 opacity-30 select-none">
                            <GraduationCap className="w-16 h-16" strokeWidth={1} />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">
                                {loading ? "Sincronizando con base de datos..." : "No hay calificaciones registradas"}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toasts / Feedback */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-6 rounded-[2rem] flex items-center gap-4 text-sm font-bold uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                                msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                        >
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {msg.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Grades;
