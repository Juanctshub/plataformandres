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
  AlertCircle,
  Building2,
  User,
  MoreVertical,
  Loader2,
  Trash2,
  GraduationCap
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

const StaffSkeleton = () => (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-zinc-100 rounded-xl" />
          <Skeleton className="h-4 w-48 bg-zinc-50 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 bg-zinc-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-72 w-full bg-white border border-zinc-100 rounded-[3rem]" />
        ))}
      </div>
    </div>
);

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
            setTimeout(() => setLoading(false), 800);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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
                setMsg({ text: 'Acreditación institucional verificada', type: 'success' });
                setIsAddModalOpen(false);
                setNewStaff({ nombre: '', rol: 'Docente', email: '', contacto: '' });
                fetchStaff();
            }
        } catch (e) {
            setMsg({ text: 'Error de sincronización con el núcleo', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const filteredStaff = staff.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center text-zinc-300 font-black uppercase tracking-widest text-xs">Sincronizando Directorio Corporativo...</div>;

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                            Nómina Verificada • 2026
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Gestión Docente</h2>
                        <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
                            Directorio centralizado del capital humano y administración de roles pedagógicos institucionales.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                        <Input 
                            placeholder="Buscar docente o perfil..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 w-[340px] bg-white border-zinc-100 rounded-2xl shadow-sm focus:ring-1 focus:ring-zinc-200 placeholder:text-zinc-300 font-bold text-xs uppercase tracking-widest text-zinc-900"
                        />
                    </div>
                    
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10">
                                <Plus className="w-5 h-5" />
                                Acreditar Personal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none text-zinc-900 rounded-[3rem] p-12 max-w-xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.15)]">
                            <DialogHeader className="mb-8">
                                <DialogTitle className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Nuevo Staff</DialogTitle>
                                <DialogDescription className="text-zinc-400 font-bold text-sm mt-3">Incorporación oficial al sistema de gestión de personal</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Nombres y Apellidos</label>
                                    <Input 
                                        className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold uppercase"
                                        placeholder="Ej: Lic. Meléndez"
                                        value={newStaff.nombre}
                                        onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Rol dentro del Núcleo</label>
                                    <select 
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none appearance-none"
                                        value={newStaff.rol}
                                        onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Correo Corporativo</label>
                                        <Input 
                                            placeholder="correo@andresbello.edu.ve"
                                            className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold"
                                            value={newStaff.email}
                                            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Contacto Directo</label>
                                        <Input 
                                            placeholder="+58 ..."
                                            className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold"
                                            value={newStaff.contacto}
                                            onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black mt-4 transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/10"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validar e Inscribir"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                    {filteredStaff.length > 0 ? filteredStaff.map((s, idx) => (
                        <motion.div 
                            key={s.id || idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="bg-white border border-zinc-100 rounded-[3rem] p-12 group hover:shadow-2xl hover:border-zinc-200 transition-all duration-700 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-8">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-sm relative overflow-hidden ${
                                        s.rol === 'Directivo' ? 'bg-zinc-950 text-white' :
                                        s.rol === 'Docente' ? 'bg-zinc-50 text-zinc-900 border border-zinc-100' :
                                        'bg-zinc-50 text-zinc-400'
                                    }`}>
                                         <Briefcase className="w-9 h-9" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase group-hover:underline decoration-zinc-100 decoration-4 underline-offset-4">{s.nombre}</h3>
                                        <div className="flex items-center gap-3">
                                          <Badge className="bg-zinc-50 text-zinc-400 border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-xl">{s.rol}</Badge>
                                          <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">• Staff ID {s.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-emerald-50 px-4 py-1.5 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Activo</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-zinc-50 mb-10">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.3em]">Comunicación</span>
                                    <div className="flex items-center gap-3 text-zinc-900 font-black text-xs lowercase">
                                        <Mail className="w-4 h-4 text-zinc-200" />
                                        {s.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.4em]">Fase de Contacto</span>
                                    <div className="flex items-center gap-3 text-zinc-900 font-black text-xs uppercase">
                                        <Phone className="w-4 h-4 text-zinc-200" />
                                        {s.contacto}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2.5 rounded-2xl group-hover:bg-zinc-950 group-hover:text-white transition-all duration-700">
                                    <Award className="w-4.5 h-4.5 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Personal Acreditado</span>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-zinc-50 flex items-center justify-center text-zinc-100 group-hover:text-zinc-950 transition-all duration-700">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-8 opacity-20 select-none">
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-zinc-100 flex items-center justify-center">
                              <User className="w-10 h-10" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.6em] italic">No se registran integrantes en el directorio</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="fixed bottom-12 right-12 z-[100]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-3xl border ${
                                msg.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-red-600 border-red-100'
                            }`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {msg.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Núcleo de Datos Neon Secure</span>
                </div>
                <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Suite Andrés Bello v10.0</span>
                </div>
            </div>
        </div>
    );
};

export default Staff;
