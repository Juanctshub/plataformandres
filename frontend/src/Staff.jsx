import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  ChevronRight, 
  Mail, 
  Phone, 
  Award,
  ShieldCheck,
  Plus,
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

const Staff = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newStaff, setNewStaff] = useState({ nombre: '', rol: 'Docente', email: '', contacto: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });

    const roles = ['Docente', 'Administrativo', 'Directivo', 'Obrero'];

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/personal`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStaff(data);
        } catch (e) {
            console.error('Error fetching staff:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/personal`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newStaff)
            });
            if (res.ok) {
                setMsg({ text: 'Personal registrado correctamente', type: 'success' });
                setIsAddModalOpen(false);
                setNewStaff({ nombre: '', rol: 'Docente', email: '', contacto: '' });
                fetchStaff();
            }
        } catch (e) {
            setMsg({ text: 'Error al registrar personal', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        }
    };

    const filteredStaff = staff.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Personal Docente</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Directorio del núcleo institucional y gestión de roles académicos.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white/40 transition-colors" />
                        <Input 
                            placeholder="Buscar docente o rol..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 w-[280px] bg-zinc-900/50 border-white/5 rounded-2xl apple-input-focus placeholder:text-zinc-700 text-white/80"
                        />
                    </div>
                    
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
                                <Plus className="w-5 h-5" />
                                Nuevo Personal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 backdrop-blur-3xl border-white/10 text-white rounded-[2.5rem] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-semibold tracking-tight text-white">Registrar Staff</DialogTitle>
                                <DialogDescription className="text-zinc-500 font-medium">Añadir nuevo integrante al núcleo institucional.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Nombre Completo</label>
                                    <Input 
                                        placeholder="Ej: Profe Meléndez"
                                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                        value={newStaff.nombre}
                                        onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Rol Institucional</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                                        value={newStaff.rol}
                                        onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                    >
                                        {roles.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Email</label>
                                        <Input 
                                            placeholder="correo@ejemplo.com"
                                            className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                            value={newStaff.email}
                                            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Contacto</label>
                                        <Input 
                                            placeholder="0412-0000000"
                                            className="bg-white/5 border-white/10 h-12 rounded-2xl text-white font-medium"
                                            value={newStaff.contacto}
                                            onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold mt-4 transition-all active:scale-95 text-lg"
                                >
                                    {submitting ? "Sincronizando..." : "Acreditar Personal"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                    {filteredStaff.length > 0 ? filteredStaff.map((s, idx) => (
                        <motion.div 
                            key={s.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5, scale: 1.005 }}
                            className="apple-card p-10 group bg-zinc-900/40 border-white/[0.05] transition-all duration-700 hover:bg-zinc-800/40"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.75rem] border flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden ${
                                        s.rol === 'Directivo' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                        s.rol === 'Docente' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        'bg-zinc-800 border-white/10 text-zinc-500'
                                    }`}>
                                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                         <Briefcase className="w-8 h-8 relative z-10" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-semibold text-white/90 group-hover:text-apple-gradient transition-all duration-700 uppercase italic tracking-tight">{s.nombre}</h3>
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1 italic">{s.rol}</p>
                                    </div>
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full mt-2 ${s.estado === 'activo' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} />
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 text-zinc-500 text-xs font-semibold hover:text-white transition-colors">
                                         <Mail className="w-4 h-4 text-zinc-700" />
                                         {s.email}
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-500 text-xs font-semibold hover:text-white transition-colors">
                                         <Phone className="w-4 h-4 text-zinc-700" />
                                         {s.contacto}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-10">
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                                    <Award className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest italic">Acreditado</span>
                                </div>
                                <Button variant="ghost" className="text-zinc-500 hover:text-white group-hover:translate-x-1 transition-all p-2 rounded-xl">
                                    <ChevronRight className="w-6 h-6" strokeWidth={1} />
                                </Button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-zinc-800 space-y-4 opacity-30 select-none">
                            <Briefcase className="w-16 h-16" strokeWidth={1} />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">
                                {loading ? "Sincronizando directorio..." : "No se ha registrado personal todavía"}
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

export default Staff;
