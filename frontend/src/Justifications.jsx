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
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Stamp,
  MoreVertical,
  Loader2,
  X,
  FileCheck
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
import { Badge } from "./components/ui/badge";
import { Skeleton } from "./components/ui/skeleton";
import jsPDF from 'jspdf';

const JustificationsSkeleton = () => (
  <div className="space-y-16 pb-20">
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
      <div className="space-y-6">
        <Skeleton className="h-12 w-80 bg-white/5 rounded-2xl" />
        <Skeleton className="h-4 w-64 bg-white/[0.02] rounded-lg" />
      </div>
      <Skeleton className="h-16 w-56 bg-white/10 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {[1, 2].map(i => (
        <Skeleton key={i} className="h-96 w-full bg-[#1C1C1E] border border-white/5 rounded-[4rem]" />
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
        body: JSON.stringify({ estado, comentario: estado === 'aprobado' ? 'Certificado validado Pro Dark.' : 'Rechazado por protocolo.' })
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
        setMsg({ text: 'Sincronización de justificación exitosa', type: 'success' });
        setIsAddModalOpen(false);
        setNewJustification({ ...newJustification, comentario: '' });
        fetchData();
      }
    } catch (e) { setMsg({ text: 'Fallo en la comunicación con el núcleo', type: 'error' }); }
    finally { 
        setSubmitting(false);
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const exportSinglePDF = (j) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Certificado Institucional de Justificación", 105, 40, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Unidad Educativa Andrés Bello • Apple Pro Terminal v14.0", 105, 50, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    doc.setFontSize(12);
    doc.text(`Identidad del Estudiante: ${j.nombre}`, 20, 80);
    doc.text(`Ubicación Académica: ${j.seccion}`, 20, 90);
    doc.text(`Fecha del Suceso: ${new Date(j.fecha).toLocaleDateString()}`, 20, 100);
    doc.text(`Protocolo: ${j.motivo}`, 20, 110);
    
    doc.text("Análisis de Observación:", 20, 130);
    doc.setFontSize(10);
    doc.text(j.comentario || "Sin aclaratorias adicionales del representante", 20, 140, { maxWidth: 170 });

    doc.setFontSize(14);
    doc.text("ESTADO DEL CONTROL: " + j.estado.toUpperCase(), 105, 180, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Hash de Verificación: ${j.id}-${Date.now()}-PRO-DARK`, 105, 260, { align: 'center' });
    doc.text("Documento digital generado con Validación Apple Pro v14.0", 105, 265, { align: 'center' });

    doc.save(`Justificativo_AB_${j.nombre}_${j.fecha}.pdf`);
  };

  const filteredJustifications = justifications.filter(j => 
    j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <JustificationsSkeleton />;

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-6">
                <FileCheck className="w-6 h-6 text-black" />
             </div>
             <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Auditoría de Certificados v14.0
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Justificativos</h2>
            <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
              Validación institucional de inasistencias bajo protocolo de emergencia.
              <span className="block mt-2 text-[#0A84FF] select-none italic">Sincronización con Apple Pro Dark.</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#0A84FF] transition-colors" />
            <Input 
              placeholder="Filtro de búsqueda Pro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-16 w-[400px] bg-[#1C1C1E] border-white/5 rounded-2xl shadow-2xl focus:ring-1 focus:ring-[#0A84FF]/40 placeholder:text-white/10 font-bold text-xs uppercase tracking-widest text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            />
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex gap-4 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Emitir Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white rounded-[3rem] p-16 max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
              <DialogHeader className="mb-12">
                <DialogTitle className="text-5xl font-black tracking-tighter text-white uppercase italic">Nuevo Protocolo</DialogTitle>
                <DialogDescription className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] mt-4">Auditoría de Inasistencia • Andrés Bello v14.0</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Localizar Estudiante</label>
                  <select 
                    className="w-full bg-black border border-white/5 rounded-2xl h-16 px-8 text-sm font-black text-white outline-none focus:ring-1 focus:ring-[#0A84FF] appearance-none"
                    value={newJustification.estudiante_id}
                    onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                    required
                  >
                    <option value="" className="text-white/20">Seleccionar perfil...</option>
                    {students.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre} COMPLETO | {s.seccion}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Fecha del Suceso</label>
                    <Input 
                      type="date"
                      className="bg-black border-white/5 h-16 rounded-2xl text-white font-black uppercase tracking-widest text-xs"
                      value={newJustification.fecha}
                      onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Tipo de Trámite</label>
                    <select 
                      className="w-full bg-black border border-white/5 rounded-2xl h-16 px-8 text-xs font-black text-white outline-none appearance-none uppercase tracking-widest"
                      value={newJustification.motivo}
                      onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                    >
                      <option value="Médico">Asunto Médico</option>
                      <option value="Personal">Causa Personal</option>
                      <option value="Institucional">Delegación Pro</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black pl-2">Declaración Jurada</label>
                  <textarea 
                    className="w-full bg-black border border-white/5 rounded-[2rem] p-8 text-white font-bold text-sm outline-none focus:ring-1 focus:ring-[#0A84FF]/40 min-h-[140px] uppercase placeholder:text-white/10"
                    placeholder="Especifique los detalles del evento para el acta digital..."
                    value={newJustification.comentario}
                    onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-20 bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black mt-8 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-white/5"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sincronizar Certificado"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Snapshot */}
      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[100]"
          >
             <div className="p-8 rounded-[2.5rem] bg-[#1C1C1E] border border-emerald-500/20 text-emerald-400 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.8)] flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Protocolo Sincronizado</span>
                  <span className="text-sm font-black uppercase tracking-tight mt-1">{msg.text}</span>
                </div>
                <button onClick={() => setMsg({text:'', type:''})} className="ml-6 p-2 hover:bg-white/10 rounded-full transition-colors font-black">
                   <X className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredJustifications.length > 0 ? filteredJustifications.map((j, idx) => (
            <motion.div 
              key={j.id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              className="apple-pro-card p-12 group hover:border-white/20 transition-all duration-700 relative overflow-hidden"
            >
              {j.estado === 'aprobado' && (
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/[0.02] rotate-45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-1000">
                   <Stamp className="w-32 h-32 text-white/5" strokeWidth={1} />
                </div>
              )}

              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className="flex items-center gap-10">
                    <div className={`w-28 h-28 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden group-hover:scale-105 ${
                        j.estado === 'aprobado' ? 'text-[#0A84FF]' : 
                        j.estado === 'rechazado' ? 'text-[#FF453A]' :
                        'text-[#FFD60A]'
                    }`}>
                        {j.estado === 'aprobado' ? <CheckCircle2 className="w-12 h-12" /> : 
                        j.estado === 'rechazado' ? <XCircle className="w-12 h-12" /> : 
                        <Clock className="w-12 h-12" />}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sección {j.seccion}</p>
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 group-hover:translate-x-2 transition-transform duration-500 italic">{j.nombre}</h3>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-5">
                  <Badge className={`rounded-xl px-7 py-3 font-black text-[11px] uppercase tracking-[0.2em] border shadow-2xl ${
                      j.estado === 'aprobado' ? 'bg-[#0A84FF] text-white border-none' : 
                      j.estado === 'rechazado' ? 'bg-[#FF453A] text-white border-none' :
                      'bg-white/5 text-white/40 border-white/10'
                  }`}>
                      {j.estado}
                  </Badge>
                  <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">Audit ID {j.id?.toString().slice(-4)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-16 mb-16 py-12 border-y border-white/5 relative z-10">
                <div className="space-y-5">
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Timeline</span>
                    <div className="flex items-center gap-5 text-white font-black text-xs uppercase tracking-widest">
                        <Calendar className="w-5 h-5 text-white/20" />
                        {new Date(j.fecha).toLocaleDateString()}
                    </div>
                </div>
                <div className="space-y-5 border-l border-white/5 pl-12 font-black">
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Protocolo</span>
                    <div className="flex items-center gap-5 text-[#0A84FF] font-black text-xs uppercase italic tracking-[0.2em]">
                        <FileText className="w-5 h-5 opacity-40" />
                        {j.motivo}
                    </div>
                </div>
              </div>

              <div className="space-y-12 relative z-10">
                <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/[0.03] group/box relative overflow-hidden">
                    <MessageSquare className="absolute -right-12 -top-12 w-48 h-48 text-white/[0.02] group-hover/box:scale-110 transition-transform duration-1000" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-6">Auditoría de Origen</span>
                    <p className="text-white text-sm font-bold italic leading-relaxed tracking-tight group-hover:text-white/60 transition-colors uppercase select-none">
                      "{j.comentario || 'Pase de validación de sistema pendiente de firma digital'}"
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    {j.estado === 'pendiente' ? (
                        <>
                            <Button 
                                onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                                className="flex-1 h-20 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 shadow-2xl active:scale-95 transition-all flex gap-5 group/ok"
                            >
                                <CheckCircle2 className="w-6 h-6 group-hover/ok:scale-125 transition-transform" />
                                Validar Digitalmente
                            </Button>
                            <Button 
                                onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                                className="w-20 h-20 bg-[#1C1C1E] border border-white/5 text-[#FF453A] rounded-[1.5rem] flex items-center justify-center hover:bg-[#FF453A]/10 transition-all active:scale-95 group/no"
                            >
                                <XCircle className="w-8 h-8 group-hover/no:rotate-90 transition-transform" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex w-full gap-8">
                            <Button 
                                onClick={() => exportSinglePDF(j)}
                                className="flex-1 h-20 bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-700 flex gap-5 group/print"
                            >
                                <Printer className="w-6 h-6 group-hover/print:scale-110 transition-transform" />
                                Generar Certificado Pro
                            </Button>
                            <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center text-white/10 group-hover:text-[#0A84FF] transition-colors shadow-2xl">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-64 flex flex-col items-center justify-center space-y-12 select-none apple-pro-card border-dashed border-white/5 bg-transparent">
              <div className="w-44 h-44 rounded-[3.5rem] border border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse" />
                <Stamp className="w-20 h-20 text-white/5 relative z-10" strokeWidth={1} />
              </div>
              <div className="text-center space-y-4">
                 <p className="text-[12px] font-black uppercase tracking-[0.8em] text-white italic">Cola Limpia</p>
                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                   No se han detectado protocolos de inasistencia pendientes de validación tecnológica.
                 </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32">
        <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Protocolo Andrés Bello Suite v14.0 Dark</span>
        </div>
        <div className="flex items-center gap-4">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Validación de Activos Digitales</span>
        </div>
      </div>
    </div>
  );
};

export default Justifications;
