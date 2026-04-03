import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  TrendingUp,
  Filter
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const Grades = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const grades = [
        { id: 1, student: 'Alejandro G.', grade: '18/20', subject: 'Matemática', status: 'sobresaliente' },
        { id: 2, student: 'María F.', grade: '15/20', subject: 'Física', status: 'promedio' },
        { id: 3, student: 'Jesús M.', grade: '19/20', subject: 'Castellano', status: 'sobresaliente' },
        { id: 4, student: 'Lucía V.', grade: '12/20', subject: 'Química', status: 'riesgo' },
    ];

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Calificaciones</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Registro y auditoría de rendimiento académico por lapso.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white/40 transition-colors" />
                        <Input 
                            placeholder="Buscar estudiante..." 
                            className="pl-11 h-12 w-[300px] bg-zinc-900/50 border-white/5 rounded-2xl apple-input-focus placeholder:text-zinc-700 text-white/80"
                        />
                    </div>
                    <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
                        <Plus className="w-5 h-5" />
                        Cargar Notas
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {grades.map((g, i) => (
                    <motion.div 
                        key={g.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="apple-card p-6 flex items-center justify-between group transition-all duration-700 bg-zinc-900/40 border-white/[0.05]"
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white/90 uppercase italic tracking-tight">{g.student}</h3>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{g.subject}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-white group-hover:text-apple-gradient transition-all">{g.grade}</span>
                                <Badge className={`mt-1 border-none rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                    g.status === 'sobresaliente' ? 'bg-emerald-500/10 text-emerald-400' :
                                    g.status === 'riesgo' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                    {g.status}
                                </Badge>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-800" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Grades;
