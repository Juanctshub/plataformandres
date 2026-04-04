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
  ArrowRight
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
                setMsg({ text: 'Personal registrado exitosamente', type: 'success' });
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

    const filteredStaff = staff.filter(s => 
        (s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.rol.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeRole === 'Todos' || s.rol === activeRole)
    );

    if (loading) return (
      <div className="space-y-12">
          <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 apple-glass rounded-[2rem] animate-pulse" />)}
          </div>
      </div>
    );

    return (
        <div className="space-y-12">
            {/* Search & Role Filter */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
                <div className="flex items-center gap-6 flex-1">
                   <div className="relative flex-1 max-w-lg group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                         placeholder="Buscar por nombre o cargo..." 
                         className="pl-16 h-14 bg-white/5 border-white/5 rounded-2xl text-white text-sm font-medium focus:ring-1 focus:ring-blue-500/50"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      {['Todos', ...roles].map((r) => (
                         <button
                           key={r}
                           onClick={() => setActiveRole(r)}
                           className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                             activeRole === r 
                               ? 'bg-white text-black shadow-lg' 
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
                    <Button className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-xs flex gap-3 shadow-2xl active:scale-95 transition-all">
                      <Plus className="w-5 h-5" />
                      Registrar Personal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="apple-glass border-white/10 p-16 rounded-[3rem] max-w-xl">
                     <DialogHeader className="mb-10">
                        <DialogTitle className="text-3xl font-semibold text-white tracking-tight">Nuevo Miembro Staff</DialogTitle>
                        <DialogDescription className="text-[#86868b] font-medium mt-3">Gestión de recursos humanos v15.0</DialogDescription>
                     </DialogHeader>
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Nombre Completo</label>
                           <Input 
                              placeholder="Ej: Profe Juan"
                              className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                              value={newStaff.nombre}
                              onChange={(e) => setNewStaff({...newStaff, nombre: e.target.value})}
                              required
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Cargo</label>
                           <select 
                              className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                              value={newStaff.rol}
                              onChange={(e) => setNewStaff({...newStaff, rol: e.target.value})}
                           >
                              {roles.map(r => <option key={r} value={r} className="text-black">{r}</option>)}
                           </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Email</label>
                              <Input 
                                 placeholder="correo@ejemplo.com"
                                 className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                                 value={newStaff.email}
                                 onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                 required
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Contacto</label>
                              <Input 
                                 placeholder="04XX-XXXXXXX"
                                 className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                                 value={newStaff.contacto}
                                 onChange={(e) => setNewStaff({...newStaff, contacto: e.target.value})}
                                 required
                              />
                           </div>
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full h-16 bg-blue-600 text-white hover:bg-blue-500 rounded-full font-bold transition-all shadow-xl">
                           {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmar Registro"}
                        </Button>
                     </form>
                  </DialogContent>
                </Dialog>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((s, i) => (
                      <motion.div
                        key={s.id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="apple-card group p-10"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white/[0.03] border border-white/5 text-white/20 group-hover:bg-white group-hover:text-black shadow-lg`}>
                               <User className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <Badge className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest ${
                               s.rol === 'Directivo' ? 'bg-white text-black' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                               {s.rol}
                            </Badge>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-white tracking-tight group-hover:translate-x-1 transition-transform">{s.nombre}</h3>
                            
                            <div className="space-y-3 pt-6 border-t border-white/5">
                               <div className="flex items-center gap-4 text-xs font-medium text-[#86868b] group-hover:text-white/80 transition-colors">
                                  <Mail className="w-4 h-4 opacity-40" />
                                  {s.email}
                               </div>
                               <div className="flex items-center gap-4 text-xs font-medium text-[#86868b] group-hover:text-white/80 transition-colors">
                                  <Phone className="w-4 h-4 opacity-40" />
                                  {s.contacto}
                               </div>
                            </div>
                         </div>

                         <div className="mt-8 flex justify-end">
                            <div className="p-2.5 rounded-full bg-white/5 text-white/10 group-hover:text-white group-hover:bg-white/10 transition-all cursor-pointer">
                               <ArrowRight className="w-5 h-5" />
                            </div>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-30">
                       <Briefcase className="w-16 h-16" />
                       <p className="text-sm font-semibold tracking-widest uppercase">Sin personal registrado</p>
                    </div>
                  )}
               </AnimatePresence>
            </div>

            <AnimatePresence>
               {msg.text && (
               <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-32 right-12 z-[110]"
               >
                  <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl border-white/5">
                     <div className={`p-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Personal System</span>
                        <span className="text-sm font-semibold text-white mt-0.5">{msg.text}</span>
                     </div>
                     <button onClick={() => setMsg({text:'', type:''})} className="ml-4 p-1.5 hover:bg-white/5 rounded-full transition-colors opacity-30">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
               </motion.div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default Staff;
