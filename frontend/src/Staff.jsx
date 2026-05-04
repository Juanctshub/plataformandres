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
  X,
  ArrowRight,
  Sparkles,
  Bot
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
    const [activeRole, setActiveRole] = useState('Todos');
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
            setStaff(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error fetching staff:', e);
            setStaff([]);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const filteredStaff = Array.isArray(staff) ? staff.filter(s => 
        ((s.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
         (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
         (s.rol?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
        (activeRole === 'Todos' || s.rol === activeRole)
    ) : [];

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
            
            const data = await res.json();
            
            if (res.ok) {
                setMsg({ text: 'Personal registrado en el Nodo Maestro', type: 'success' });
                setIsAddModalOpen(false);
                setNewStaff({ nombre: '', rol: 'Docente', email: '', contacto: '' });
                fetchStaff();
                window.dispatchEvent(new Event('refresh-dashboard'));
            } else {
                setMsg({ text: data.error || 'Fallo en la sincronización del personal', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de enlace con el servidor de personal', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/personal/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMsg({ text: 'Registro eliminado exitosamente', type: 'success' });
                fetchStaff();
                window.dispatchEvent(new Event('refresh-dashboard'));
            }
        } catch (e) { console.error(e); }
        finally { setTimeout(() => setMsg({ text: '', type: '' }), 4000); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">Sincronizando Recursos Humanos...</p>
        </div>
    );

    return (
        <div className="max-w-screen-2xl mx-auto py-8 md:py-24 space-y-12 md:space-y-24 px-6 md:px-16">
            {/* Header: Human Talent Hub */}
            <div className="flex flex-col gap-8 md:gap-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-3 md:space-y-6">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4 md:gap-6 group"
                        >
                            <div className="w-1 h-6 md:h-10 bg-indigo-500 rounded-full" />
                            <div className="space-y-0.5">
                                <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tighter leading-none italic">Personal</h2>
                                <p className="text-[10px] md:text-xs font-black text-[#86868b] uppercase tracking-[0.3em]">Gestión de Talento Humano</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                              <Button className="h-14 md:h-18 px-8 md:px-14 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group flex-1 md:flex-none">
                                <Plus className="w-4 h-4 md:w-5 md:h-5 mr-3 group-hover:rotate-90 transition-transform" />
                                Integrar Staff
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="apple-glass border-white/10 p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] max-w-2xl bg-black/95 backdrop-blur-[120px] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] z-[1000]">
                               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none rounded-[2rem] md:rounded-[4rem]" />
                               <DialogHeader className="mb-8 md:mb-12 relative z-10">
                                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 mb-6 mx-auto md:mx-0">
                                     <User className="w-6 h-6 md:w-10 md:h-10" />
                                  </div>
                                   <DialogTitle className="text-2xl md:text-4xl font-bold text-white tracking-tighter text-center md:text-left">Nuevo Registro</DialogTitle>
                                   <DialogDescription className="text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mt-2 text-center md:text-left">Validación de Identidad en Nodo Maestro</DialogDescription>
                               </DialogHeader>
                               <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                                  <div className="space-y-2 group">
                                     <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2 group-focus-within:text-indigo-500 transition-colors">Nombre Completo</label>
                                     <Input 
                                        placeholder="Ej: Lic. Andrés Bello"
                                        className="h-14 md:h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                        value={newStaff.nombre}
                                        onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                                        required
                                     />
                                  </div>
                                  <div className="space-y-2 group">
                                     <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2 group-focus-within:text-indigo-500 transition-colors">Cargo Asignado</label>
                                     <div className="relative">
                                         <select 
                                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-14 md:h-16 px-6 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none font-bold transition-all"
                                             value={newStaff.rol}
                                             onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                         >
                                             {roles.map(r => <option key={r} value={r} className="bg-zinc-950 text-white">{r}</option>)}
                                         </select>
                                         <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] rotate-90" />
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                     <div className="space-y-2 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2 group-focus-within:text-indigo-500 transition-colors">Correo Electrónico</label>
                                        <Input 
                                           placeholder="staff@andresbello.edu"
                                           className="h-14 md:h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10"
                                           value={newStaff.email}
                                           onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                           required
                                        />
                                     </div>
                                     <div className="space-y-2 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2 group-focus-within:text-indigo-500 transition-colors">Móvil / Contacto</label>
                                        <Input 
                                           placeholder="+58 4XX-XXXXXXX"
                                           className="h-14 md:h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10"
                                           value={newStaff.contacto}
                                           onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                           required
                                        />
                                     </div>
                                  </div>
                                  <Button type="submit" disabled={submitting} className="w-full h-16 md:h-20 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] mt-4">
                                     {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ejecutar Registro de Personal"}
                                  </Button>
                               </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                    <div className="lg:col-span-6 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            placeholder="Buscar identidad staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 md:h-18 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[2rem] pl-16 pr-8 text-white font-bold text-sm md:text-base focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all placeholder:text-white/5 shadow-inner"
                        />
                    </div>
                    <div className="lg:col-span-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {['Todos', ...roles].map((r) => (
                          <button
                            key={r}
                            onClick={() => setActiveRole(r)}
                            className={`px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-xl ${
                              activeRole === r 
                                ? 'bg-indigo-600 text-white shadow-indigo-600/20' 
                                : 'bg-white/5 text-[#86868b] hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                          >
                            {r}
                          </button>
                       ))}
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-14 pb-32 md:pb-0">
               <AnimatePresence mode="popLayout">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((s, i) => (
                      <motion.div
                        key={s?.id || `staff-${i}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-indigo-500/20 transition-all duration-500"
                      >
                         <div className="flex justify-between items-start mb-8 md:mb-12">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all duration-300">
                               <User className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                            <Badge className={`rounded-xl px-4 py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
                               s.rol === 'Directivo' ? 'bg-white text-black' : 'bg-white/10 text-white/40 border-none'
                            }`}>
                               {s.rol}
                            </Badge>
                         </div>

                         <div className="space-y-6 md:space-y-8">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase truncate leading-none">{s.nombre}</h3>
                                <div className="flex items-center gap-2 mt-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   <span className="text-[8px] md:text-[9px] font-black text-[#86868b] uppercase tracking-widest">Estado: Sincronizado</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pt-6 md:pt-8 border-t border-white/5">
                               <div className="flex items-center justify-between text-xs">
                                  <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">Email</span>
                                  <span className="text-white/60 font-bold truncate max-w-[150px]">{s.email}</span>
                               </div>
                               <div className="flex items-center justify-between text-xs">
                                  <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">Contacto</span>
                                  <span className="text-white/60 font-bold">{s.contacto}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-2 mt-8 md:mt-10">
                            <Button 
                                onClick={() => { setStaffToDelete(s); setIsDeleteModalOpen(true); }}
                                className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-0 flex-shrink-0"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                            <Button className="h-12 flex-1 rounded-xl bg-white/5 text-white/60 hover:bg-white hover:text-black font-black text-[9px] uppercase tracking-widest transition-all">
                                Perfil Maestro
                            </Button>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                       className="col-span-full py-24 md:py-48 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] md:rounded-[5rem]"
                    >
                       <Bot className="w-12 h-12 md:w-20 md:h-20 text-white/5 mx-auto" />
                       <div className="space-y-2">
                          <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Sin Resultados</h3>
                          <p className="text-[10px] md:text-xs text-[#86868b] font-bold uppercase tracking-widest">El nodo no detectó identidades bajo este parámetro.</p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Notification Portal */}
            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed top-24 left-4 right-4 md:left-auto md:right-12 md:w-96 z-[2000]"
               >
                  <div className="apple-glass p-5 md:p-6 rounded-3xl md:rounded-[2rem] flex items-center gap-4 shadow-2xl border border-white/10">
                     <div className={`p-3 rounded-xl ${msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-black text-[#86868b] uppercase tracking-widest block mb-1">Human Resources Kernel</span>
                        <p className={`text-[12px] font-bold truncate ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-4 h-4 text-white/20" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="apple-glass border-red-500/20 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 max-w-md bg-zinc-950/95 backdrop-blur-3xl z-[10000]">
                  <DialogHeader className="text-center space-y-4 md:space-y-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                          <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                      <DialogTitle className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Baja de Personal</DialogTitle>
                  </DialogHeader>
                  <div className="py-6 md:py-10 text-center">
                      <p className="text-xs md:text-sm font-bold text-[#86868b] uppercase tracking-wider leading-relaxed">
                         ¿Confirmar la desvinculación de: <br/> <span className="text-white text-lg italic mt-4 block">{staffToDelete?.nombre}</span>?
                      </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="h-14 md:h-16 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest text-[#86868b]">Cancelar</Button>
                      <Button onClick={() => { handleDelete(staffToDelete.id); setIsDeleteModalOpen(false); }} className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-red-600 text-white hover:bg-red-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95">Confirmar</Button>
                  </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Staff;
