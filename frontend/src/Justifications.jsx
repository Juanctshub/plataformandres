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
        body: JSON.stringify({ estado, comentario: estado === 'aprobado' ? 'Certificado validado v15.0.' : 'Rechazado.' })
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
    doc.text("Unidad Educativa Andrés Bello • Apple Glass v15.0", 105, 50, { align: 'center' });
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

  const filteredJustifications = justifications.filter(j => 
    (j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
     j.motivo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Todos' || j.estado === activeFilter.toLowerCase())
  );

  if (loading) return <div className="h-80 apple-glass rounded-[2rem] animate-pulse" />;

  return (
    <div className="space-y-12">
      {/* Search & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] apple-glass">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative flex-1 max-w-lg group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
             <Input 
                placeholder="Filtrar por estudiante o motivo..." 
                className="pl-16 h-14 bg-white/5 border-white/5 rounded-2xl text-white text-sm font-medium focus:ring-1 focus:ring-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
             {['Todos', 'Pendiente', 'Aprobado'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all ${
                    activeFilter === f 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-[#86868b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
             ))}
          </div>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-10 bg-blue-600 text-white hover:bg-blue-500 rounded-2xl font-semibold text-xs flex gap-3 shadow-lg shadow-blue-600/20 transition-all">
              <FileCheck className="w-5 h-5" />
              Nuevo Justificativo
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-glass border-white/10 p-16 rounded-[3rem] max-w-xl">
             <DialogHeader className="mb-10">
                <DialogTitle className="text-3xl font-semibold text-white tracking-tight">Emisión de Certificado</DialogTitle>
                <DialogDescription className="text-[#86868b] font-medium mt-3">Validación de inasistencia v15.0</DialogDescription>
             </DialogHeader>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Estudiante</label>
                   <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                      value={newJustification.estudiante_id}
                      onChange={(e) => setNewJustification({...newJustification, estudiante_id: e.target.value})}
                      required
                   >
                      <option value="" className="text-black">Seleccionar alumno...</option>
                      {students.map(s => <option key={s.id} value={s.id} className="text-black">{s.nombre} ({s.seccion})</option>)}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Fecha</label>
                      <Input 
                         type="date"
                         className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                         value={newJustification.fecha}
                         onChange={(e) => setNewJustification({...newJustification, fecha: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Motivo</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-sm text-white outline-none appearance-none"
                        value={newJustification.motivo}
                        onChange={(e) => setNewJustification({...newJustification, motivo: e.target.value})}
                      >
                        <option value="Médico" className="text-black">Médico</option>
                        <option value="Personal" className="text-black">Personal</option>
                        <option value="Institucional" className="text-black">Institucional</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Link de Evidencia (Opcional)</label>
                   <Input 
                      placeholder="https://imgur.com/foto-reposo"
                      className="h-14 bg-white/5 border-white/5 rounded-xl text-white font-medium"
                      value={newJustification.evidencia_url}
                      onChange={(e) => setNewJustification({...newJustification, evidencia_url: e.target.value})}
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Observación</label>
                   <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[120px]"
                      placeholder="Detalles adicionales..."
                      value={newJustification.comentario}
                      onChange={(e) => setNewJustification({...newJustification, comentario: e.target.value})}
                   />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all shadow-2xl">
                   {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generar y Firmar"}
                </Button>
             </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredJustifications.length > 0 ? (
            filteredJustifications.map((j, i) => (
              <motion.div
                key={j.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="apple-card group p-10"
              >
                <div className="flex justify-between items-start mb-10">
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 bg-white/5 border border-white/10 ${
                         j.estado === 'aprobado' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                         {j.estado === 'aprobado' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                      </div>
                      <div>
                         <h3 className="text-2xl font-semibold text-white tracking-tight">{j.nombre}</h3>
                         <p className="text-xs text-[#86868b] font-medium mt-1">Sección {j.seccion} • {new Date(j.fecha).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <Badge className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest ${
                      j.estado === 'aprobado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                   }`}>
                      {j.estado}
                   </Badge>
                </div>

                <div className="bg-white/[0.03] rounded-3xl p-8 mb-10 border border-white/5 relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{j.motivo}</span>
                         <div className="w-1 h-1 rounded-full bg-white/10" />
                         <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">Observación</span>
                      </div>
                      <p className="text-sm font-medium text-white/70 italic leading-relaxed">
                         "{j.comentario || 'Evaluación de sistema pendiente.'}"
                      </p>
                      {j.evidencia_url && (
                        <a 
                            href={j.evidencia_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group/link"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                                <Download className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Soporte Médico</span>
                                <span className="text-[9px] text-[#86868b] font-medium">Click para visualizar documento</span>
                            </div>
                        </a>
                      )}
                   </div>
                   <MessageSquare className="absolute -right-8 -top-8 w-32 h-32 text-white/[0.02]" />
                </div>

                <div className="flex items-center gap-4">
                   {j.estado === 'pendiente' ? (
                      <>
                         <Button 
                            onClick={() => handleUpdateStatus(j.id, 'aprobado')}
                            className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs shadow-xl transition-all"
                         >
                            Validar
                         </Button>
                         <Button 
                            onClick={() => handleUpdateStatus(j.id, 'rechazado')}
                            className="w-14 h-14 apple-glass text-red-400 hover:bg-red-400/10 rounded-2xl flex items-center justify-center transition-all bg-transparent"
                         >
                            <XCircle className="w-6 h-6" />
                         </Button>
                      </>
                   ) : (
                      <Button 
                        onClick={() => exportSinglePDF(j)}
                        className="w-full h-14 apple-glass hover:bg-white/5 text-white/50 hover:text-white rounded-full font-semibold text-xs flex gap-3 transition-all bg-transparent border-white/5"
                      >
                         <Printer className="w-4 h-4" />
                         Imprimir Certificado Pro
                      </Button>
                   )}
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-30">
                <FileText className="w-16 h-16" />
                <p className="text-sm font-semibold tracking-widest uppercase">Sin trámites pendientes</p>
             </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-32 right-12 z-[110]"
          >
             <div className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl border-white/10">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Control Académico</span>
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

export default Justifications;
