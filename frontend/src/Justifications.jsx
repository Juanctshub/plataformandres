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
  Loader2
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
  <div className="space-y-12 pb-20">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-zinc-100 rounded-xl" />
        <Skeleton className="h-4 w-48 bg-zinc-50 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-48 bg-zinc-100 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {[1, 2].map(i => (
        <Skeleton key={i} className="h-80 w-full bg-zinc-50 border border-zinc-100 rounded-[4rem]" />
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
        body: JSON.stringify({ estado, comentario: estado === 'aprobado' ? 'Certificado validado por control de asistencia.' : 'Rechazado por inconsistencia.' })
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
        setMsg({ text: 'Protocolo de justificación registrado', type: 'success' });
        setIsAddModalOpen(false);
        setNewJustification({ ...newJustification, comentario: '' });
        fetchData();
      }
    } catch (e) { setMsg({ text: 'Error en el núcleo de datos', type: 'error' }); }
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
    doc.text("Unidad Educativa Andrés Bello • Departamento Administrativo", 105, 50, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    doc.setFontSize(12);
    doc.text(`Estudiante: ${j.nombre}`, 20, 80);
    doc.text(`Grado/Sección: ${j.seccion}`, 20, 90);
    doc.text(`Fecha del Evento: ${new Date(j.fecha).toLocaleDateString()}`, 20, 100);
    doc.text(`Motivo: ${j.motivo}`, 20, 110);
    
    doc.text("Observaciones:", 20, 130);
    doc.setFontSize(10);
    doc.text(j.comentario || "Sin observaciones adicionales", 20, 140, { maxWidth: 170 });

    doc.setFontSize(14);
    doc.text("ESTADO: " + j.estado.toUpperCase(), 105, 180, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Código de Auditoría: ${j.id}-${Date.now()}`, 105, 260, { align: 'center' });
    doc.text("Documento digital generado por Andrés Bello Suite v10.0", 105, 265, { align: 'center' });

    doc.save(`Justificativo_${j.nombre}_${j.fecha}.pdf`);
  };

  const filteredJustifications = justifications.filter(j => 
    j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <JustificationsSkeleton />;

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                <FileText className="w-6 h-6 text-white" />
             </div>
             <Badge className="bg-amber-50 text-amber-600 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Auditoría de Inasistencia
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Justificativos</h2>
            <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
              Consolidación administrativa de certificados médicos e institucionales con validación biocrónica.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
            <Input 
              placeholder="Buscar por alumno o motivo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 w-[340px] bg-white border-zinc-100 rounded-2xl shadow-sm focus:ring-1 focus:ring-zinc-200 placeholder:text-zinc-300 font-bold text-xs uppercase tracking-widest text-zinc-900"
            />
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex gap-3 active:scale-95 shadow-xl shadow-zinc-900/10">
                <Plus className="w-5 h-5" />
                Registrar Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none text-zinc-900 rounded-[3rem] p-12 max-w-xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.15)]">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Nuevo Protocolo</DialogTitle>
                <DialogDescription className="text-zinc-400 font-bold text-sm mt-3">Carga de evidencias para justificación de inasistencia</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Vincular Estudiante</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-200 appearance-none"
                    value={newJustification.estudiante_id}
                    onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar de matrícula...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.nombre} | {s.seccion}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Fecha del Evento</label>
                    <Input 
                      type="date"
                      className="bg-zinc-50 border-zinc-100 h-14 rounded-2xl text-zinc-900 font-bold"
                      value={newJustification.fecha}
                      onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Naturaleza / Motivo</label>
                    <select 
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl h-14 px-6 text-sm font-bold text-zinc-900 outline-none appearance-none"
                      value={newJustification.motivo}
                      onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                    >
                      <option value="Médico">Asunto Médico</option>
                      <option value="Personal">Asunto Personal</option>
                      <option value="Institucional">Delegación Oficial</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black pl-2">Detalle de Auditoría</label>
                  <textarea 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-zinc-900 font-bold text-sm outline-none focus:ring-1 focus:ring-zinc-200 min-h-[120px]"
                    placeholder="Describa la causa de la ausencia..."
                    value={newJustification.comentario}
                    onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-16 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black mt-4 transition-all active:scale-[0.98] text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/10"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sincronizar Documento"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredJustifications.length > 0 ? filteredJustifications.map((j, idx) => (
            <motion.div 
              key={j.id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-zinc-100/50 rounded-[4.5rem] p-12 group hover:shadow-2xl hover:border-black transition-all duration-1000 relative overflow-hidden"
            >
              {j.estado === 'aprobado' && (
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-black/5 rotate-45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-1000">
                   <Stamp className="w-24 h-24 text-black/10" />
                </div>
              )}

              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-10">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-1000 shadow-2xl relative overflow-hidden ${
                    j.estado === 'aprobado' ? 'bg-black text-white' : 
                    j.estado === 'rechazado' ? 'bg-red-600 text-white' :
                    'bg-amber-500 text-white'
                    }`}>
                    {j.estado === 'aprobado' ? <CheckCircle2 className="w-12 h-12" /> : 
                     j.estado === 'rechazado' ? <XCircle className="w-12 h-12" /> : 
                     <Clock className="w-12 h-12 animate-pulse" />}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-black tracking-tighter uppercase mb-2 group-hover:underline underline-offset-8 decoration-black/10">{j.nombre}</h3>
                        <Badge className="bg-zinc-50 text-zinc-400 border-none font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-2xl">Sección {j.seccion}</Badge>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge className={`rounded-full px-6 py-2.5 font-black text-[10px] uppercase tracking-widest border-none ${
                      j.estado === 'aprobado' ? 'bg-black text-white' : 
                      j.estado === 'rechazado' ? 'bg-red-600 text-white' :
                      'bg-amber-500 text-white'
                  }`}>
                      {j.estado}
                  </Badge>
                  <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest leading-none">Cert v11.0</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-12 mb-12 py-12 border-y border-zinc-50">
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Cronología</span>
                    <div className="flex items-center gap-4 text-black font-black text-xs uppercase">
                        <Calendar className="w-5 h-5 text-zinc-200" />
                        {new Date(j.fecha).toLocaleDateString()}
                    </div>
                </div>
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Protocolo</span>
                    <div className="flex items-center gap-4 text-black font-black text-xs uppercase italic underline underline-offset-8 decoration-black/5">
                        <FileText className="w-5 h-5 text-zinc-200" />
                        {j.motivo}
                    </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-zinc-50 rounded-[2.5rem] p-10 relative overflow-hidden group/box">
                    <MessageSquare className="absolute -right-8 -bottom-8 w-32 h-32 text-zinc-100/50 group-hover/box:scale-110 transition-transform duration-1000" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 block mb-6">Declaración del Representante</span>
                    <p className="text-black text-sm font-bold italic leading-relaxed tracking-tight group-hover:text-zinc-500 transition-colors uppercase">"{j.comentario || 'Pendiente de auditoría física'}"</p>
                </div>
                
                <div className="flex items-center gap-6">
                    {j.estado === 'pendiente' ? (
                        <>
                            <Button 
                                onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                                className="flex-1 h-20 bg-black text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-zinc-800 shadow-2xl shadow-black/20 active:scale-95 transition-all flex gap-4"
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                Validar Digitalmente
                            </Button>
                            <Button 
                                onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                                className="w-20 h-20 bg-white border border-zinc-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-all active:scale-95 shadow-sm hover:border-red-100"
                            >
                                <XCircle className="w-8 h-8" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex w-full gap-6">
                            <Button 
                                onClick={() => exportSinglePDF(j)}
                                className="flex-1 h-20 bg-zinc-50 text-black border border-zinc-100 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-700 flex gap-4 shadow-sm hover:shadow-2xl hover:border-black"
                            >
                                <Printer className="w-6 h-6" />
                                Generar Certificado PDF
                            </Button>
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-56 flex flex-col items-center justify-center space-y-12 opacity-20 select-none border-2 border-dashed border-zinc-100 rounded-[6rem]">
              <div className="w-36 h-36 rounded-full border-[3px] border-zinc-200 flex items-center justify-center">
                <Stamp className="w-16 h-16 text-zinc-200" />
              </div>
              <div className="text-center space-y-3">
                 <p className="text-[12px] font-black uppercase tracking-[0.8em] italic">Auditoría Limpia</p>
                 <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">No hay protocolos pendientes en la cola de validación</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Msg */}
        <AnimatePresence>
            {msg.text && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`fixed bottom-12 left-1/2 -translate-x-1/2 p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-4 z-50 ${
                msg.type === 'success' ? 'bg-white text-emerald-600 border border-emerald-100' : 'bg-white text-red-600 border border-red-100'
                }`}
            >
                <CheckCircle2 className="w-5 h-5" />
                {msg.text}
            </motion.div>
            )}
        </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
        <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocolo Andrés Bello Suite v10.0</span>
        </div>
        <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Audit Validated Security</span>
        </div>
      </div>
    </div>
  );
};

export default Justifications;
