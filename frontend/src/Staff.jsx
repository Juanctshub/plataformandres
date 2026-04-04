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
  GraduationCap,
  Globe,
  Database,
  X
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
            setTimeout(() => setLoading(false), 1000);
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
                setMsg({ text: 'Acreditación verificada en el núcleo', type: 'success' });
                setIsAddModalOpen(false);
                setNewStaff({ nombre: '', rol: 'Docente', email: '', contacto: '' });
                fetchStaff();
            }
        } catch (e) {
            setMsg({ text: 'Incompatibilidad de sincronización', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const filteredStaff = staff.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
      <div className="space-y-16 pb-20">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
            <div className="space-y-6">
                <div className="h-12 w-80 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-4 w-64 bg-white/[0.02] rounded-lg animate-pulse" />
            </div>
            <div className="h-16 w-[400px] bg-white/5 rounded-full animate-pulse" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map(i => (
                <div key={i} className="h-80 bg-[#1C1C1E] border border-white/5 rounded-[4rem] animate-pulse" />
            ))}
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
                            <Briefcase className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.4em]">
                            Gestión Docente v14.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Talento Humano</h2>
                        <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
                            Control centralizado del staff institucional y roles pedagógicos. 
                            <span className="block mt-2 text-[#0A84FF] select-none italic uppercase tracking-[0.2em] text-[11px] font-black underline underline-offset-4 decoration-[#0A84FF]/20">Protocolo de acreditación síncrono activo.</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                    <div className="relative group/search">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/search:text-[#0A84FF] transition-colors" />
                        <Input 
                            placeholder="Buscar docente o perfil..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-16 h-16 w-[380px] bg-[#1C1C1E] border-white/5 rounded-2xl shadow-2xl focus:ring-1 focus:ring-[#0A84FF]/40 placeholder:text-white/10 font-bold italic text-xs uppercase tracking-widest text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Staff Grid Noir */}
            <div className="grid gap-10 md:grid-cols-2 relative z-10">
                <AnimatePresence mode="popLayout">
                    {filteredStaff.length > 0 ? filteredStaff.map((s, idx) => (
                        <motion.div 
                            key={s.id || idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="apple-pro-card p-12 group hover:border-white/20 transition-all duration-1000 relative overflow-hidden bg-black/40 border-white/[0.03] cursor-default"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div className="flex items-center gap-10">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden group-hover:scale-105 ${
                                        s.rol === 'Directivo' ? 'bg-white text-black' :
                                        'bg-white/5 text-white/40 border border-white/10 group-hover:border-[#0A84FF]/40 group-hover:text-white'
                                    }`}>
                                         <User className="w-14 h-14" strokeWidth={1} />
                                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-3 transition-transform duration-700 leading-none">{s.nombre}</h3>
                                        <div className="flex items-center gap-6">
                                          <Badge className={`border-none font-black text-[10px] uppercase tracking-[0.4em] px-6 py-2.5 rounded-2xl shadow-2xl italic ${
                                            s.rol === 'Directivo' ? 'bg-white text-black' : 'bg-white/5 text-[#0A84FF]'
                                          }`}>{s.rol}</Badge>
                                          <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">Audit-ID {s.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-full border border-white/5 shadow-2xl">
                                    <div className="w-2 h-2 rounded-full bg-[#32D74B] shadow-[0_0_10px_rgba(50,215,75,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Status Activo</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-white/5 mb-12">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">Cifrado Corporativo</span>
                                    <div className="flex items-center gap-5 text-white/40 font-black text-xs lowercase tracking-wider group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5 opacity-20" />
                                        {s.email}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">Enlace Directo</span>
                                    <div className="flex items-center gap-5 text-white/40 font-black text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5 opacity-20" />
                                        {s.contacto}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 bg-white/[0.02] px-10 py-5 rounded-[2.5rem] group-hover:bg-white group-hover:text-black transition-all duration-1000 shadow-2xl border border-white/[0.03] group-hover:border-transparent">
                                    <ShieldCheck className="w-5 h-5 text-white/20 group-hover:text-black" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] italic leading-none">Perfil Certificado v14.0</span>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:bg-white/10 group-hover:text-white transition-all duration-700 cursor-pointer">
                                    <ChevronRight className="w-8 h-8" strokeWidth={3} />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-64 flex flex-col items-center justify-center space-y-12 select-none apple-pro-card border-dashed border-white/5 bg-transparent opacity-20">
                            <div className="w-40 h-40 rounded-[3.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <User className="w-16 h-16 text-white" strokeWidth={1} />
                                <div className="absolute inset-0 bg-white/5 blur-3xl animate-pulse" />
                            </div>
                            <div className="text-center space-y-4">
                                <p className="text-[14px] font-black uppercase tracking-[0.8em] text-white italic">Nómina Offline</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Sincronizando Archivo de Capital Humano...</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Actions & Notifications Noir */}
            <div className="fixed bottom-12 right-12 flex flex-col items-end gap-10 h-[80px]">
                <AnimatePresence>
                    {msg.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-32 right-0"
                        >
                           <div className={`p-10 rounded-[3rem] border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-8 bg-[#1C1C1E] ${
                             msg.type === 'success' ? 'border-emerald-500/20 text-emerald-400' : 'border-red-500/20 text-red-400'
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
                
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-24 px-20 bg-white text-black hover:bg-zinc-200 rounded-[3rem] font-black text-[13px] uppercase tracking-[0.5em] active:scale-95 transition-all shadow-[0_30px_70px_rgba(255,255,255,0.1)] flex gap-10 group/main">
                            <Plus className="w-8 h-8 group-hover/main:rotate-90 transition-transform duration-700" strokeWidth={3} />
                            Acreditar Staff Pro
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white rounded-[4rem] p-20 max-w-2xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]">
                        <DialogHeader className="mb-12">
                            <DialogTitle className="text-5xl font-black tracking-tighter text-white uppercase italic">Acreditación Staff</DialogTitle>
                            <DialogDescription className="text-white/20 font-black text-[11px] uppercase tracking-[0.5em] mt-4">Gestión de Roles • Andrés Bello v14.0</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Nombres y Apellidos Completos</label>
                                <Input 
                                    className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black uppercase tracking-widest text-xs italic px-8"
                                    placeholder="EJ: LIC. JOSÉ MELÉNDEZ"
                                    value={newStaff.nombre}
                                    onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Rol en la Institución</label>
                                <select 
                                    className="w-full bg-black border border-white/5 rounded-[1.75rem] h-18 px-8 text-xs font-black text-white outline-none appearance-none uppercase tracking-widest"
                                    value={newStaff.rol}
                                    onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                >
                                    {roles.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Correo Corporativo</label>
                                    <Input 
                                        className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black text-xs px-8"
                                        placeholder="user@andresbello.edu.ve"
                                        value={newStaff.email}
                                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Contacto Directo</label>
                                    <Input 
                                        className="bg-black border-white/5 h-18 rounded-[1.75rem] text-white font-black text-xs px-8"
                                        placeholder="+58 4XX XXX XX XX"
                                        value={newStaff.contacto}
                                        onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black mt-10 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.4em] shadow-2xl shadow-white/5"
                            >
                                {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : "Validar e Inscribir"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32 no-print">
                <div className="flex items-center gap-4">
                    <Database className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Consolidación de Identidades Staff • Terminal Andrés Bello v14.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 opacity-40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Criptografía Neural Quantum Active</span>
                </div>
            </div>
        </div>
    );
};

export default Staff;
