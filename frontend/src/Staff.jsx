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
        (s.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
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
            if (res.ok) {
                setMsg({ text: 'Personal registrado en el Nodo Maestro', type: 'success' });
                setIsAddModalOpen(false);
                setNewStaff({ nombre: '', rol: 'Docente', email: '', contacto: '' });
                fetchStaff();
                window.dispatchEvent(new Event('refresh-dashboard'));
            }
        } catch (e) {
            setMsg({ text: 'Error al registrar personal', type: 'error' });
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
        <div className="max-w-7xl mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6">
            {/* Header: Human Talent Hub */}
            <div className="flex flex-col gap-10 sm:gap-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10">
                    <div className="space-y-4 sm:space-y-6">
                        <motion.div 
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-6 group"
                        >
                            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                            <div className="space-y-1">
                                <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">Personal</h2>
                                <p className="text-sm text-[#86868b] font-normal mt-1">Gestión de talento humano institucional.</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                              <Button className="h-14 sm:h-16 px-8 sm:px-12 bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 group">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-3 group-hover:rotate-90 transition-transform" />
                                Integrar Staff
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="apple-glass border-white/10 p-12 rounded-[3.5rem] max-w-2xl bg-black/95 backdrop-blur-[100px] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] z-[9999]">
                               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none rounded-[3.5rem]" />
                               <DialogHeader className="mb-12 relative z-10">
                                  <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 mb-6">
                                     <Plus className="w-8 h-8" />
                                  </div>
                                   <DialogTitle className="text-2xl font-semibold text-white tracking-tight">Nuevo Personal</DialogTitle>
                                   <DialogDescription className="text-sm text-[#86868b] font-normal mt-1">Registro de personal institucional.</DialogDescription>
                               </DialogHeader>
                               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                  <div className="space-y-3 group">
                                     <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-indigo-500 transition-colors">Nombre Completo</label>
                                     <Input 
                                        placeholder="Ej: Lic. Andrés Bello"
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                        value={newStaff.nombre}
                                        onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                                        required
                                     />
                                  </div>
                                  <div className="space-y-3 group">
                                     <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-indigo-500 transition-colors">Cargo o Función</label>
                                     <div className="relative">
                                         <select 
                                             className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] h-16 px-6 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none font-bold transition-all"
                                             value={newStaff.rol}
                                             onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                         >
                                             {roles.map(r => <option key={r} value={r} className="bg-[#000000] text-white">{r}</option>)}
                                         </select>
                                         <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] rotate-90" />
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                     <div className="space-y-3 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-indigo-500 transition-colors">Correo Corporativo</label>
                                        <Input 
                                           placeholder="correo@institucion.edu"
                                           className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                           value={newStaff.email}
                                           onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                           required
                                        />
                                     </div>
                                     <div className="space-y-3 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-indigo-500 transition-colors">Contacto Directo</label>
                                        <Input 
                                           placeholder="04XX-XXXXXXX"
                                           className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                           value={newStaff.contacto}
                                           onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                           required
                                        />
                                     </div>
                                  </div>
                                  <Button type="submit" disabled={submitting} className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] mt-6">
                                     {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Validar e Integrar al Staff"}
                                  </Button>
                               </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Control Bar: Refined for Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                    <div className="lg:col-span-7 relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868b] group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            placeholder="Buscar por nombre, cargo o departamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 sm:h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] pl-20 pr-8 text-white font-bold text-lg sm:text-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-white/5"
                        />
                    </div>
                    <div className="lg:col-span-5 flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar bg-white/[0.02] border border-white/5 p-2 sm:p-3 rounded-[2.5rem]">
                        {['Todos', ...roles].map((r) => (
                          <button
                            key={r}
                            onClick={() => setActiveRole(r)}
                            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[1.8rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                              activeRole === r 
                                ? 'bg-white text-black shadow-2xl' 
                                : 'text-[#86868b] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {r}
                          </button>
                       ))}
                    </div>
                </div>
            </div>

            {/* Staff Grid: Increased Gap for Elegance */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-20">
               <AnimatePresence>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((s, i) => (
                      <motion.div
                        key={s?.id || `staff-${i}`}
                        layout
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative overflow-hidden rounded-[4rem] p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                      >
                         <div className="flex justify-between items-start mb-12">
                            <div className="w-20 h-20 rounded-[2.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-indigo-600/10 group-hover:text-indigo-500 group-hover:border-indigo-500/20 shadow-2xl transition-all duration-500 overflow-hidden relative">
                               <User className="w-10 h-10 relative z-10" strokeWidth={1.5} />
                               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <Badge className={`rounded-[1.2rem] px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                               s.rol === 'Directivo' ? 'bg-white text-black' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}>
                               {s.rol}
                            </Badge>
                         </div>

                         <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none group-hover:text-indigo-400 transition-colors">{s.nombre}</h3>
                                <div className="flex items-center gap-3 mt-4">
                                   <Sparkles className="w-3.5 h-3.5 text-indigo-500/50" />
                                   <span className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em]">Identidad Staff Validada</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-10 border-t border-white/5">
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <Mail className="w-4 h-4 text-[#86868b]/40" />
                                     <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Email</span>
                                  </div>
                                  <span className="text-xs font-bold text-white/80">{s.email}</span>
                               </div>
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <Phone className="w-4 h-4 text-[#86868b]/40" />
                                     <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Contacto</span>
                                  </div>
                                  <span className="text-xs font-bold text-white/80">{s.contacto}</span>
                               </div>
                            </div>
                         </div>

                         <div className="absolute bottom-8 right-12 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-4">
                            <Button 
                                onClick={() => { setStaffToDelete(s); setIsDeleteModalOpen(true); }}
                                variant="ghost" 
                                className="h-12 w-12 p-0 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-2xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                            <Button 
                               variant="ghost" 
                               className="h-12 px-8 rounded-2xl bg-white/5 text-white hover:bg-white hover:text-black transition-all shadow-2xl"
                            >
                               <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
                            </Button>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="col-span-full py-48 text-center space-y-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[5rem]"
                    >
                       <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center text-white/10 mx-auto border border-white/5 shadow-inner">
                          <Bot className="w-16 h-16" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Staff No Sincronizado</h3>
                          <p className="text-[11px] text-[#86868b] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                             El nodo maestro no detectó identidades bajo el rol: <span className="text-indigo-500">"{activeRole}"</span>
                          </p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Global Notification Node */}
            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed bottom-32 right-12 z-[10000]"
               >
                  <div className="apple-glass p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl border border-white/10 min-w-[400px]">
                     <div className={`p-4 rounded-[1.2rem] ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] mb-1">Human Resources Kernel</span>
                        <span className={`text-[14px] font-bold ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="ml-auto p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/20" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="apple-glass border-red-500/20 rounded-[3rem] p-10 max-w-md bg-black/90 shadow-[0_50px_100px_-20px_rgba(255,0,0,0.2)] z-[10000]">
                  <DialogHeader className="text-center space-y-6">
                      <div className="w-20 h-20 rounded-[2.2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                          <AlertCircle className="w-10 h-10" />
                      </div>
                      <div>
                         <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Baja de Personal</DialogTitle>
                         <DialogDescription className="text-red-400/60 font-black uppercase tracking-[0.4em] text-[9px] mt-4">Esta action desactivará la identidad en el nodo maestro permanentemente.</DialogDescription>
                      </div>
                  </DialogHeader>
                  <div className="py-10 text-center">
                      <p className="text-sm font-bold text-[#86868b] uppercase tracking-wider leading-relaxed">
                         ¿Confirmar la desvinculación de: <br/> <span className="text-white text-lg italic mt-4 block">{staffToDelete?.nombre}</span>?
                      </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="h-16 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest text-[#86868b] hover:text-white">Cancelar</Button>
                      <Button onClick={() => { handleDelete(staffToDelete.id); setIsDeleteModalOpen(false); }} className="h-16 rounded-[1.8rem] bg-red-600 text-white hover:bg-red-500 font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95">Confirmar Baja</Button>
                  </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Staff;
