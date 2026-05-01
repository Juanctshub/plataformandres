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
  FileCheck,
  ArrowRight
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
import jsPDF from 'jspdf';

const Justifications = () => {
  const [justifications, setJustifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJustification, setNewJustification] = useState({ 
    estudiante_id: '', 
    fecha: new Date().toISOString().split('T')[0], 
    motivo: 'Médico', 
    comentario: '',
    evidencia_url: ''
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
      const jData = await resJ.json();
      const sData = await resS.json();
      setJustifications(Array.isArray(jData) ? jData : []);
      setStudents(Array.isArray(sData) ? sData : []);
    } catch (e) { console.error(e); }
    finally { setTimeout(() => setLoading(false), 1000); }
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
        body: JSON.stringify({ estado, comentario: estado === 'aprobado' ? 'Certificado validado v30.0.' : 'Rechazado.' })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        setMsg({ text: 'Certificado emitido exitosamente', type: 'success' });
        setIsAddModalOpen(false);
        setNewJustification({ ...newJustification, comentario: '' });
        fetchData();
      }
    } catch (e) { setMsg({ text: 'Error de conexión con el núcleo', type: 'error' }); }
    finally { 
        setSubmitting(false);
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const exportSinglePDF = (j) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Certificado de Justificación", 105, 40, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Unidad Educativa Andrés Bello • Apple Glass v30.0", 105, 50, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    doc.setFontSize(12);
    doc.text(`Estudiante: ${j.nombre}`, 20, 80);
    doc.text(`Sección: ${j.seccion}`, 20, 90);
    doc.text(`Fecha: ${new Date(j.fecha).toLocaleDateString()}`, 20, 100);
    doc.text(`Motivo: ${j.motivo}`, 20, 110);
    doc.text("Observación:", 20, 130);
    doc.setFontSize(10);
    doc.text(j.comentario || "N/A", 20, 140, { maxWidth: 170 });
    doc.setFontSize(14);
    doc.text("ESTADO: " + j.estado.toUpperCase(), 105, 180, { align: 'center' });
    doc.save(`Justificativo_${j.nombre}.pdf`);
  };

  const filteredJustifications = Array.isArray(justifications) ? justifications.filter(j => 
    ((j.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
     (j.motivo?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Todos' || j.estado === activeFilter.toLowerCase())
  ) : [];

  if (loading) return <div className="max-w-7xl mx-auto py-16 px-6 space-y-24">
    <div className="h-40 bg-white/5 rounded-[3rem] animate-pulse" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {[1,2,3,4].map(i => <div key={i} className="h-96 bg-white/5 rounded-[4rem] animate-pulse" />)}
    </div>
  </div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-6 sm:py-12 space-y-6 px-4 sm:px-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
              <p className="text-xs text-muted-foreground mb-1">Módulo de Certificación</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Justificativos</h1>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-200">
                <FileCheck className="w-3.5 h-3.5 mr-2" />
                Emitir certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 p-6 sm:p-8 rounded-xl max-w-lg">
               <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-semibold text-white tracking-tight">Emitir Certificado</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">Registrar nueva justificación en el sistema</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs text-muted-foreground font-medium">Alumno</label>
                     <select 
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg h-10 px-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                        value={newJustification.estudiante_id}
                        onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                        required
                     >
                        <option value="" className="bg-zinc-900">Seleccionar...</option>
                        {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.nombre} ({s.seccion})</option>)}
                     </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">Fecha</label>
                        <Input 
                           type="date"
                           className="h-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-white text-sm"
                           value={newJustification.fecha}
                           onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">Motivo</label>
                        <select 
                          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg h-10 px-3 text-sm text-white outline-none appearance-none"
                          value={newJustification.motivo}
                          onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                        >
                          <option value="Médico" className="bg-zinc-900">Médico</option>
                          <option value="Personal" className="bg-zinc-900">Personal</option>
                          <option value="Institucional" className="bg-zinc-900">Institucional</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-muted-foreground font-medium">Evidencia (URL)</label>
                     <Input 
                        placeholder="https://..."
                        className="h-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-white text-sm"
                        value={newJustification.evidencia_url}
                        onChange={(e) => setNewJustification({...newJustification, evidencia_url: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-muted-foreground font-medium">Observación</label>
                     <textarea 
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[100px] resize-none"
                        placeholder="Detalles adicionales..."
                        value={newJustification.comentario}
                        onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                     />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full h-10 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-sm font-medium">
                     {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                     {submitting ? "Generando..." : "Emitir certificado"}
                  </Button>
               </form>
            </DialogContent>
          </Dialog>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input 
              placeholder="Buscar por nombre o motivo..." 
              className="h-10 pl-10 bg-white/[0.03] border-white/[0.06] rounded-lg text-sm text-white placeholder:text-muted-foreground/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
           {['Todos', 'Pendiente', 'Aprobado'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f 
                    ? 'bg-white text-black' 
                    : 'bg-white/[0.03] text-muted-foreground hover:text-white border border-white/[0.06]'
                }`}
              >
                {f}
              </button>
           ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredJustifications.length > 0 ? (
            filteredJustifications.map((j, i) => (
               <motion.div
                key={j.id || i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-xl p-5 sm:p-6 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors flex flex-col h-full"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/[0.03] ${
                         j.estado === 'aprobado' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                         {j.estado === 'aprobado' ? <FileCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                         <h3 className="text-sm font-semibold text-white truncate">{j.nombre}</h3>
                         <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{j.seccion}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(j.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         </div>
                      </div>
                   </div>
                   <Badge className={`h-5 px-1.5 text-[9px] font-medium border-transparent shrink-0 ${
                      j.estado === 'aprobado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                   }`}>
                      {j.estado}
                   </Badge>
                </div>

                <div className="flex-1 bg-black/20 rounded-lg p-4 border border-white/[0.02] mb-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Stamp className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[10px] font-medium text-blue-500 uppercase tracking-wider">{j.motivo}</span>
                   </div>
                   <p className="text-sm text-white/70 italic leading-relaxed">
                      "{j.comentario || 'Sin observación técnica.'}"
                   </p>
                   
                   {j.evidencia_url && (
                     <a 
                         href={j.evidencia_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="mt-3 inline-flex items-center gap-2 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                     >
                         <Download className="w-3.5 h-3.5" />
                         Ver evidencia digital
                     </a>
                   )}
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <Button 
                        onClick={() => exportSinglePDF(j)}
                        variant="outline"
                        className="flex-1 h-9 rounded-lg text-xs font-medium bg-transparent border-white/10 text-white hover:bg-white/5"
                    >
                        <Printer className="w-3.5 h-3.5 mr-2" />
                        Imprimir
                    </Button>
                    
                    {j.estado !== 'aprobado' && (
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                            className="flex-1 h-9 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                            Aprobar
                        </Button>
                    )}

                    {j.estado === 'pendiente' && (
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                        >
                            <XCircle className="w-4 h-4" />
                        </Button>
                    )}
                </div>
              </motion.div>
            ))
          ) : (
             <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01] text-muted-foreground space-y-4">
                <FileText className="w-8 h-8 opacity-20" />
                <div className="text-center">
                   <h4 className="text-sm font-medium text-white">Sin justificativos</h4>
                   <p className="text-xs">No hay registros pendientes detectados</p>
                </div>
             </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-lg text-sm font-medium shadow-xl flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Justifications;
