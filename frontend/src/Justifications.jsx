import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  ShieldCheck,
  Building2,
  Filter,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const JustificationsSkeleton = () => (
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-white/5 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-48 bg-white/5 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-48 w-full bg-white/5 rounded-3xl" />
      ))}
    </div>
  </div>
);

const Justifications = () => {
  const [justifications, setJustifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJustification, setNewJustification] = useState({ 
    estudiante_id: '', 
    fecha: new Date().toISOString().split('T')[0], 
    motivo: 'Médico', 
    comentario: '' 
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      const [resJ, resS] = await Promise.all([
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/estudiantes`, { headers })
      ]);
      setJustifications(await resJ.json());
      setStudents(await resS.json());
    } catch (e) { console.error(e); }
    finally { setTimeout(() => setLoading(false), 800); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, estado) => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      await fetch(`${baseUrl}/api/justificaciones/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado, comentario: 'Procesado por Auditoría' })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/justificaciones`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newJustification)
      });
      if (res.ok) {
        setMsg({ text: 'Certificado registrado exitosamente', type: 'success' });
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (e) { setMsg({ text: 'Error al registrar', type: 'error' }); }
    finally { 
        setSubmitting(false);
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) return <JustificationsSkeleton />;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight text-white/90 italic">Justificativos</h2>
          <p className="text-zinc-500 font-medium font-sans">Gestión administrativa de ausencias justificadas y reposos médicos.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-2 active:scale-95 shadow-xl shadow-white/5">
              <Plus className="w-5 h-5" />
              Nuevo Justificativo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-3xl border-white/10 text-white rounded-[2.5rem] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-semibold tracking-tight text-white">Registrar Certificado</DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium">Carga de justificativos médicos o personales.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Estudiante</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                  value={newJustification.estudiante_id}
                  onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                  required
                >
                  <option value="" className="bg-black">Seleccionar Alumno</option>
                  {students.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre} ({s.seccion})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Fecha</label>
                  <Input 
                    type="date"
                    className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-1 focus:ring-white/20 text-white font-medium"
                    value={newJustification.fecha}
                    onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Motivo</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 px-4 text-white font-medium focus:ring-1 focus:ring-white/20 appearance-none"
                    value={newJustification.motivo}
                    onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                  >
                    <option value="Médico" className="bg-black">Motivo Médico</option>
                    <option value="Personal" className="bg-black">Motivo Personal</option>
                    <option value="Institucional" className="bg-black">Asunto Institucional</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Observaciones</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium focus:ring-1 focus:ring-white/20 min-h-[100px]"
                  placeholder="Detalles del justificativo..."
                  value={newJustification.comentario}
                  onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold mt-4 transition-all active:scale-95 text-lg"
              >
                {submitting ? "Procesando..." : "Registrar Documento"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {justifications.map((j, idx) => (
            <motion.div 
              key={j.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="apple-card p-10 group cursor-default"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl ${
                    j.estado === 'aprobado' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 ripple-success' : 
                    j.estado === 'rechazado' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
                    'bg-amber-500/5 border-amber-500/20 text-amber-400 animate-pulse'
                    }`}>
                    {j.estado === 'aprobado' ? <CheckCircle2 className="w-7 h-7" /> : 
                     j.estado === 'rechazado' ? <XCircle className="w-7 h-7" /> : 
                     <Clock className="w-7 h-7" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-white/90 group-hover:text-white transition-colors tracking-tight italic uppercase">{j.nombre}</h3>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Sección {j.seccion}</p>
                    </div>
                </div>
                <Badge className={`rounded-xl px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest border-none ${
                    j.estado === 'aprobado' ? 'bg-emerald-500/10 text-emerald-400' : 
                    j.estado === 'rechazado' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                }`}>
                    {j.estado}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8 py-8 border-y border-white/5">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Fecha del Evento</span>
                    <div className="flex items-center gap-2 text-white/70 font-semibold text-sm">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(j.fecha).toLocaleDateString()}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Motivo Categorizado</span>
                    <div className="flex items-center gap-2 text-white/70 font-semibold text-sm">
                        <FileText className="w-3.5 h-3.5 text-zinc-500" />
                        {j.motivo}
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative group/msg overflow-hidden transition-all duration-700 hover:bg-white/[0.04]">
                    <MessageSquare className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.02] group-hover/msg:scale-110 transition-transform duration-1000" />
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-3 italic">Observaciones del Directivo</p>
                    <p className="text-white/80 text-sm font-medium leading-relaxed italic">"{j.comentario || 'Sin comentarios adicionales'}"</p>
                </div>
                
                {j.estado === 'pendiente' && (
                    <div className="flex gap-4 pt-4">
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                            className="flex-1 h-12 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Aprobar Certificado
                        </Button>
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                            className="flex-1 h-12 bg-transparent border border-red-500/20 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 active:scale-95 transition-all"
                        >
                            Rechazar
                        </Button>
                    </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-10 opacity-30 text-zinc-700 select-none pt-10">
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Garantía LOPNA Art. 65</span>
        </div>
        <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Andrés Bello • Nucleo Administrativo</span>
        </div>
      </div>
    </div>
  );
};

export default Justifications;
