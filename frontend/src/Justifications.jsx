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
      setJustifications(await resJ.json());
      setStudents(await resS.json());
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6"
    >
      {/* Premium Header: Apple Style v30.0 */}
      <motion.div className="space-y-8 sm:space-y-10">
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
           <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-5 py-1.5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em]">
              Módulo de Certificación v30.0
           </Badge>
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
            <div className="space-y-6">
                <h2 className="text-5xl sm:text-8xl font-black tracking-tighter text-white italic uppercase leading-[0.9] sm:leading-none">
                  Gestión de <br className="sm:hidden" />
                  <span className="text-blue-500">Justificativos</span>
                </h2>
                <p className="text-base sm:text-2xl text-[#86868b] font-medium max-w-2xl leading-relaxed italic uppercase tracking-tight">
                  Validación y certificación de inasistencias. Nodo de <span className="text-white">Protocolo Institucional</span>.
                </p>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="h-20 sm:h-24 px-12 sm:px-16 bg-white text-black hover:bg-zinc-200 rounded-[2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] transition-all flex gap-6 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] active:scale-95 w-full xl:w-auto border border-white/10">
                  <FileCheck className="w-6 h-6" />
                  Emitir Certificado Maestro
                </Button>
              </DialogTrigger>
              <DialogContent className="apple-glass border-white/10 p-10 sm:p-20 rounded-[3rem] sm:rounded-[4rem] max-w-2xl overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
                 <DialogHeader className="mb-12">
                    <DialogTitle className="text-3xl sm:text-5xl font-black text-white tracking-tighter italic uppercase">Emisión de Certificado</DialogTitle>
                    <DialogDescription className="text-[10px] sm:text-xs text-blue-400 font-black uppercase tracking-[0.4em] mt-4 italic">Protocolo de Validación v30.0</DialogDescription>
                 </DialogHeader>
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Nodo Estudiantil</label>
                       <select 
                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] h-16 px-8 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none font-bold"
                          value={newJustification.estudiante_id}
                          onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                          required
                       >
                          <option value="" className="bg-zinc-900">Seleccionar Alumno...</option>
                          {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.nombre} ({s.seccion})</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Fecha de Evento</label>
                          <Input 
                             type="date"
                             className="h-16 bg-white/5 border-white/10 rounded-[2rem] text-white font-black uppercase text-xs px-8"
                             value={newJustification.fecha}
                             onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Naturaleza / Motivo</label>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] h-16 px-8 text-sm text-white outline-none appearance-none font-bold"
                            value={newJustification.motivo}
                            onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                          >
                            <option value="Médico" className="bg-zinc-900">Médico</option>
                            <option value="Personal" className="bg-zinc-900">Personal</option>
                            <option value="Institucional" className="bg-zinc-900">Institucional</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Nodo de Evidencia Digital (URL)</label>
                       <Input 
                          placeholder="https://imgur.com/evidencia-reposo"
                          className="h-16 bg-white/5 border-white/10 rounded-[2rem] text-white font-bold px-8"
                          value={newJustification.evidencia_url}
                          onChange={(e) => setNewJustification({...newJustification, evidencia_url: e.target.value})}
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] ml-6">Observación Técnica</label>
                       <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[140px]"
                          placeholder="Detalles adicionales del caso..."
                          value={newJustification.comentario}
                          onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                       />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-20 bg-blue-600 text-white hover:bg-blue-500 rounded-full font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95">
                       {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : "Generar y Firmar Certificado"}
                    </Button>
                 </form>
              </DialogContent>
            </Dialog>
        </div>
      </motion.div>

      {/* Action Bar: Glassmorphism Search & Filter */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-8 flex-1 relative z-10">
          <div className="relative w-full md:flex-1 md:max-w-2xl group/search">
             <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868b] group-focus-within/search:text-blue-500 transition-colors" />
             <Input 
                placeholder="Localizar registro por nombre o motivo..." 
                className="pl-24 h-18 sm:h-20 bg-white/5 border-white/5 rounded-[2.5rem] text-white text-base font-black italic tracking-tighter focus:ring-1 focus:ring-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto bg-white/5 p-2 rounded-full border border-white/5">
             {['Todos', 'Pendiente', 'Aprobado'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-10 py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    activeFilter === f 
                      ? 'bg-white text-black shadow-2xl' 
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
             ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </div>

      {/* Results Grid: Premium Certification Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
        <AnimatePresence mode="popLayout">
          {filteredJustifications.length > 0 ? (
            filteredJustifications.map((j, i) => (
               <motion.div
                key={j.id || i}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-[4rem] p-10 sm:p-16 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-700 group overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-12 sm:mb-16 relative z-10">
                   <div className="flex items-center gap-8">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 bg-white/5 border border-white/10 shadow-2xl ${
                         j.estado === 'aprobado' ? 'text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 'text-amber-400 border-amber-500/20 shadow-amber-500/10'
                      }`}>
                         {j.estado === 'aprobado' ? <FileCheck className="w-10 h-10 sm:w-12 sm:h-12" /> : <Clock className="w-10 h-10 sm:w-12 sm:h-12" />}
                      </div>
                      <div className="overflow-hidden">
                         <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase italic truncate leading-none">{j.nombre}</h3>
                         <div className="flex items-center gap-4 mt-4">
                            <Badge className="bg-white/5 text-[#86868b] border-none rounded-lg px-4 py-1 text-[10px] font-black uppercase tracking-widest">{j.seccion}</Badge>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="text-[10px] text-[#86868b] font-black uppercase tracking-[0.3em]">{new Date(j.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         </div>
                      </div>
                   </div>
                   <Badge className={`rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] shrink-0 italic shadow-xl ${
                      j.estado === 'aprobado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                   }`}>
                      {j.estado}
                   </Badge>
                </div>

                <div className="bg-black/40 rounded-[3.5rem] p-10 sm:p-14 mb-12 sm:mb-16 border border-white/5 relative overflow-hidden shadow-inner">
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <Stamp className="w-5 h-5 text-blue-500" />
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic">{j.motivo}</span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-white/70 italic leading-relaxed uppercase tracking-tighter">
                         "{j.comentario || 'Protocolo de validación por sistema pendiente.'}"
                      </p>
                      
                      {j.evidencia_url && (
                        <a 
                            href={j.evidencia_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-10 inline-flex items-center gap-6 bg-white/5 border border-white/10 rounded-full px-8 py-4 hover:bg-blue-600 hover:text-white transition-all duration-500 group/link"
                        >
                            <Download className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Acceder a Evidencia Digital</span>
                        </a>
                      )}
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
                </div>

                <div className="flex flex-wrap items-center gap-6 relative z-10">
                    <Button 
                        onClick={() => exportSinglePDF(j)}
                        className="flex-1 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-full h-18 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex gap-4 shadow-xl"
                    >
                        <Printer className="w-5 h-5" />
                        Imprimir Certificado
                    </Button>
                    
                    {j.estado !== 'aprobado' && (
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full h-18 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex gap-4 shadow-2xl shadow-emerald-600/20"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Aprobar
                        </Button>
                    )}

                    {j.estado === 'pendiente' && (
                        <Button 
                            onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                            variant="ghost"
                            className="w-18 h-18 rounded-full border border-white/5 text-red-500 hover:bg-red-500/10 p-0 flex items-center justify-center transition-all"
                        >
                            <XCircle className="w-7 h-7" />
                        </Button>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </motion.div>
            ))
          ) : (
             <div className="lg:col-span-2 py-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[5rem] opacity-30 space-y-12 bg-white/[0.01]">
                <div className="w-36 h-36 rounded-[3.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
                   <FileText className="w-18 h-18" />
                </div>
                <div className="text-center space-y-4">
                   <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Cero Anomalías</h4>
                   <p className="text-[11px] font-black tracking-[0.5em] uppercase text-[#86868b]">Sin certificaciones pendientes detectadas</p>
                </div>
             </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-32 sm:bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0 z-[2000] w-[calc(100%-2rem)] sm:w-auto"
          >
             <div className="apple-glass p-10 rounded-[3rem] flex items-center gap-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                   {msg.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div className="flex flex-col flex-1">
                   <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] italic leading-none">Inyección de Datos Maestro</span>
                   <span className="text-xl font-black text-white mt-2 italic uppercase tracking-tighter leading-none">{msg.text}</span>
                </div>
                <button onClick={() => setMsg({text:'', type:''})} className="p-4 hover:bg-white/5 rounded-full transition-colors opacity-30 group">
                   <X className="w-8 h-8 group-hover:text-white" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-6 text-[#86868b] select-none opacity-20 pt-16">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[11px] font-black uppercase tracking-[0.6em] italic">Andrés Bello Kernel v30.0 — Seguridad Nivel 2</span>
      </div>
    </motion.div>
  );
};

export default Justifications;
