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
            }
        } catch (e) {
            setMsg({ text: 'Error al registrar personal', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmar baja de personal? Esta acción quedará registrada.')) return;
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
        <div className="space-y-16 py-6">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] apple-glass shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                 <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                    <div className="relative flex-1 max-w-lg group">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                       <Input 
                          placeholder="Buscar por Nombre o Cargo..." 
                          className="pl-16 h-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-white text-base font-medium focus:ring-1 focus:ring-blue-500/50 transition-all"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white/5 p-2 rounded-[1.5rem]">
                       {['Todos', ...roles].map((r) => (
                          <button
                            key={r}
                            onClick={() => setActiveRole(r)}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                              activeRole === r 
                                ? 'bg-white text-black shadow-xl' 
                                : 'text-[#86868b] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {r}
                          </button>
                       ))}
                    </div>
                 </div>

                 <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                   <DialogTrigger asChild>
                     <Button className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest flex gap-3 shadow-2xl active:scale-95 transition-all">
                       <Plus className="w-5 h-5" />
                       Registrar Staff
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="apple-glass border-white/10 p-12 rounded-[3.5rem] max-w-2xl bg-black/90 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                      <DialogHeader className="mb-10">
                         <div className="w-16 h-16 rounded-[1.8rem] bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                            <Plus className="w-8 h-8" />
                         </div>
                         <DialogTitle className="text-4xl font-black text-white italic uppercase tracking-tighter">Nuevo Staff Institucional</DialogTitle>
                         <DialogDescription className="text-[#86868b] font-bold uppercase tracking-widest text-[9px] mt-2">Gestión de Talento Humano 2026</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-4">Nombre Completo</label>
                            <Input 
                               placeholder="Ej: Lic. Andrés Bello"
                               className="h-16 bg-white/5 border-white/5 rounded-[1.5rem] text-white font-bold"
                               value={newStaff.nombre}
                               onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                               required
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-4">Cargo o Función</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] h-16 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none font-bold"
                                    value={newStaff.rol}
                                    onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                                >
                                    {roles.map(r => <option key={r} value={r} className="bg-[#1c1c1e] text-white">{r}</option>)}
                                </select>
                                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] rotate-90" />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-4">Correo Corporativo</label>
                               <Input 
                                  placeholder="correo@institucion.edu"
                                  className="h-16 bg-white/5 border-white/5 rounded-[1.5rem] text-white font-bold"
                                  value={newStaff.email}
                                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                  required
                               />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-4">Contacto Directo</label>
                               <Input 
                                  placeholder="04XX-XXXXXXX"
                                  className="h-16 bg-white/5 border-white/5 rounded-[1.5rem] text-white font-bold"
                                  value={newStaff.contacto}
                                  onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                  required
                               />
                            </div>
                         </div>
                         <Button type="submit" disabled={submitting} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-[0.98]">
                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Validar e Integrar al Staff"}
                         </Button>
                      </form>
                   </DialogContent>
                 </Dialog>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               <AnimatePresence mode="popLayout">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((s, i) => (
                      <motion.div
                        key={s.id || i}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.03 }}
                        className="group relative overflow-hidden rounded-[3.5rem] p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-700"
                      >
                         <div className="flex justify-between items-start mb-10">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all bg-white/[0.03] border border-white/10 text-white/20 group-hover:bg-blue-600/10 group-hover:text-blue-500 group-hover:border-blue-500/20 shadow-2xl overflow-hidden relative`}>
                               <User className="w-10 h-10 relative z-10" strokeWidth={1.5} />
                               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <Badge className={`rounded-2xl px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                               s.rol === 'Directivo' ? 'bg-white text-black' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                               {s.rol}
                            </Badge>
                         </div>

                         <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none group-hover:text-blue-400 transition-colors">{s.nombre}</h3>
                                <div className="flex items-center gap-2 mt-3">
                                   <Sparkles className="w-3 h-3 text-blue-500/50" />
                                   <span className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em]">Identidad Staff Validada</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-8 border-t border-white/5">
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <Mail className="w-4 h-4 text-[#86868b]/40" />
                                     <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Email</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-white/80">{s.email}</span>
                               </div>
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <Phone className="w-4 h-4 text-[#86868b]/40" />
                                     <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Contacto</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-white/80">{s.contacto}</span>
                               </div>
                            </div>
                         </div>

                          <div className="absolute bottom-6 right-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-3">
                            <Button 
                                onClick={() => handleDelete(s.id)}
                                variant="ghost" 
                                className="h-10 w-10 p-0 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-xl shadow-red-500/10 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button 
                               variant="ghost" 
                               className="h-10 px-6 rounded-xl bg-white/5 text-white hover:bg-white hover:text-black transition-all shadow-xl"
                            >
                               <span className="text-[9px] font-black uppercase tracking-widest">Perfil Staff</span>
                            </Button>
                          </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
                    >
                       <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-white/20 mx-auto">
                          <Bot className="w-12 h-12" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Staff No Sincronizado</h3>
                          <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest">No se encontraron identidades para el rol "{activeRole}"</p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Global Notification Node */}
            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed bottom-32 right-12 z-[110]"
               >
                  <div className="apple-glass p-8 rounded-[2.5rem] flex items-center gap-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-white/10 min-w-[400px]">
                     <div className={`p-3 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-1">Staff Master System</span>
                        <span className={`text-[13px] font-bold ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="ml-auto p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/20" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default Staff;
