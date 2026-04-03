import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus,
  User as UserIcon,
  ChevronRight,
  GraduationCap,
  IdCard,
  Phone,
  Building2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./components/ui/dialog";
import { Skeleton } from "./components/ui/skeleton";

const StudentsSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-white/5 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-[300px] bg-white/5 rounded-2xl" />
        <Skeleton className="h-12 w-40 bg-white/5 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} className="h-64 w-full bg-white/5 rounded-3xl" />
      ))}
    </div>
  </div>
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [newStudent, setNewStudent] = useState({ 
    cedula: '', 
    nombre: '', 
    seccion: '', 
    representante: '', 
    contacto: '' 
  });

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error('Error fetching students:', e);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cedula.includes(searchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Estudiante inscrito exitosamente', type: 'success' });
        setNewStudent({ cedula: '', nombre: '', seccion: '', representante: '', contacto: '' });
        fetchStudents();
        setTimeout(() => setIsAddModalOpen(false), 1500);
      } else {
        setMsg({ text: data.error || 'Error al inscribir', type: 'error' });
      }
    } catch (e) { 
      setMsg({ text: 'Error de conexión con el servidor', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) return <StudentsSkeleton />;

  return (
    <div className="space-y-12 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-2">
          <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Media General</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Gestión y control de matricula institucional.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white/40 transition-colors" />
            <Input 
              placeholder="Buscar por nombre o CI..." 
              className="pl-11 h-12 w-[300px] bg-zinc-900/50 border-white/5 rounded-2xl apple-input-focus placeholder:text-zinc-700 text-white/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
                <Plus className="w-5 h-5" />
                Inscribir Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 backdrop-blur-2xl border-white/10 text-white rounded-[2.5rem] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <DialogHeader>
                <DialogTitle className="text-3xl font-semibold tracking-tight text-white">Nuevo Registro</DialogTitle>
                <DialogDescription className="text-zinc-500 font-medium">Completa los datos para el ingreso oficial al sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Cédula</label>
                    <Input 
                        className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white" 
                        value={newStudent.cedula}
                        onChange={(e) => setNewStudent({...newStudent, cedula: e.target.value})}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Sección</label>
                    <Input 
                        className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white" 
                        placeholder="Ej: 5to A"
                        value={newStudent.seccion}
                        onChange={(e) => setNewStudent({...newStudent, seccion: e.target.value})}
                        required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Nombre del Estudiante</label>
                  <Input 
                    className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white text-lg font-medium" 
                    value={newStudent.nombre}
                    onChange={(e) => setNewStudent({...newStudent, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Representante</label>
                    <Input 
                        className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white" 
                        value={newStudent.representante}
                        onChange={(e) => setNewStudent({...newStudent, representante: e.target.value})}
                    />
                    </div>
                    <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Contacto</label>
                    <Input 
                        className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white" 
                        placeholder="+58 ..."
                        value={newStudent.contacto}
                        onChange={(e) => setNewStudent({...newStudent, contacto: e.target.value})}
                    />
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold mt-4 transition-all active:scale-95 text-lg"
                >
                  {submitting ? "Inscribiendo..." : "Validar e Inscribir"}
                </Button>

                <AnimatePresence>
                    {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                        msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                    >
                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {msg.text}
                    </motion.div>
                    )}
                </AnimatePresence>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudents.length > 0 ? filteredStudents.map((student) => (
          <motion.div 
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="apple-card p-10 group cursor-default bg-zinc-900/40 border-white/[0.05]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all duration-700 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <UserIcon className="w-7 h-7 relative z-10" />
              </div>
              <Badge className="bg-white/5 text-zinc-500 border-none font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-xl group-hover:text-white transition-colors">
                {student.seccion}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-10">
              <h3 className="text-2xl font-semibold text-white/90 group-hover:text-apple-gradient transition-all duration-700 tracking-tight italic uppercase">{student.nombre}</h3>
              <p className="text-[10px] font-bold text-zinc-600 tracking-[0.25em] uppercase">CÉDULA: {student.cedula}</p>
            </div>
            
            <div className="pt-8 border-t border-white/[0.05] flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium uppercase tracking-tight">Representante</span>
                <span className="text-white/80 font-semibold">{student.representante || 'Sin asignar'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium uppercase tracking-tight">Tlf. Contacto</span>
                <span className="text-white/80 font-semibold">{student.contacto || 'Sin datos'}</span>
              </div>
            </div>
          </motion.div>
        )) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 opacity-30 select-none">
                <Filter className="w-16 h-16 text-zinc-800" />
                <p className="text-lg font-medium text-zinc-600 tracking-tight">No se encontraron estudiantes registrados</p>
            </div>
        )}
      </div>

      <div className="flex items-center gap-10 opacity-30 text-zinc-700 select-none pt-10">
        <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Archivo Central 2026</span>
        </div>
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cifrado Protocolo UPEL</span>
        </div>
      </div>
    </div>
  );
};

export default Students;
