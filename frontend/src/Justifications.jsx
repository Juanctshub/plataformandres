import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSearch,
  ShieldCheck,
  Building2,
  XCircle,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const JustificationsSkeleton = () => (
  <div className="space-y-8 pb-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-zinc-900" />
        <Skeleton className="h-4 w-48 bg-zinc-900" />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Skeleton className="h-10 w-full md:w-64 bg-zinc-900 rounded-xl" />
        <Skeleton className="h-10 w-32 bg-zinc-900 rounded-xl" />
      </div>
    </div>
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead className="pl-8"><Skeleton className="h-4 w-32 bg-zinc-800" /></TableHead>
              <TableHead><Skeleton className="h-4 w-40 bg-zinc-800" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20 bg-zinc-800" /></TableHead>
              <TableHead className="text-right pr-8"><Skeleton className="h-4 w-12 ml-auto bg-zinc-800" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <TableRow key={i} className="border-zinc-800">
                <TableCell className="pl-8 py-5"><Skeleton className="h-4 w-48 bg-zinc-800" /></TableCell>
                <TableCell><Skeleton className="h-4 w-60 bg-zinc-800" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 bg-zinc-800" /></TableCell>
                <TableCell className="text-right pr-8"><Skeleton className="h-8 w-8 ml-auto bg-zinc-800" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const Justifications = () => {
  const [justifications, setJustifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    comentario: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resJust, resStd] = await Promise.all([
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/estudiantes`, { headers })
      ]);

      const justs = await resJust.json();
      const stds = await resStd.json();

      // Simulated delay for skeleton
      setTimeout(() => {
        setJustifications(justs);
        setStudents(stds);
        setLoading(false);
      }, 800);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/justificaciones`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setOpen(false);
        setLoading(true);
        fetchData();
        setFormData({
            estudiante_id: '',
            fecha: new Date().toISOString().split('T')[0],
            motivo: '',
            comentario: ''
        });
      }
    } catch (e) {
      console.error('Error saving justification:', e);
    }
  };

  const filtered = justifications.filter(j => 
    j.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'aprobado': 
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black uppercase text-[9px] tracking-widest px-3 italic">Aprobado</Badge>;
      case 'rechazado': 
        return <Badge className="bg-red-500/10 text-red-500 border-none font-black uppercase text-[9px] tracking-widest px-3 italic">Rechazado</Badge>;
      default: 
        return <Badge className="bg-zinc-800 text-zinc-400 border-none font-black uppercase text-[9px] tracking-widest px-3 italic">Pendiente</Badge>;
    }
  };

  if (loading) return <JustificationsSkeleton />;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3 italic uppercase">
            <FileText className="w-8 h-8 text-amber-500" />
            Certificados Médicos
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-1 italic">
            Validación de Justificativos Administrativos • {justifications.length} Documentos
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Buscar por alumno o motivo..." 
              className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 h-11 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-zinc-100 text-black hover:bg-white font-black uppercase tracking-widest text-[11px] h-11 px-6 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Registrar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-100 max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Nuevo Justificativo</DialogTitle>
                <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  Protocolo de Validación Institucional 2026
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Estudiante Asociado</Label>
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-11 px-3 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 appearance-none pt-2.5 pb-2"
                      required 
                      value={formData.estudiante_id}
                      onChange={e => setFormData({ ...formData, estudiante_id: e.target.value })}
                    >
                      <option value="" className="bg-zinc-950">Seleccione un alumno...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id} className="bg-zinc-950">{s.nombre} ({s.seccion})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fecha Ausencia</Label>
                      <Input 
                        type="date" 
                        className="bg-zinc-900 border-zinc-800 h-11 text-zinc-200 rounded-xl"
                        required 
                        value={formData.fecha}
                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Motivo</Label>
                      <Input 
                        placeholder="Médico / Personal"
                        className="bg-zinc-900 border-zinc-800 h-11 text-zinc-200 rounded-xl"
                        required 
                        value={formData.motivo}
                        onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descripción Detallada</Label>
                    <textarea 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm min-h-[100px] text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      placeholder="Indique detalles adicionales del certificado..."
                      value={formData.comentario}
                      onChange={e => setFormData({ ...formData, comentario: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-zinc-100 text-black hover:bg-white font-black uppercase tracking-widest text-[11px] h-12 rounded-xl mt-4">
                    Almacenar en Archivo Seguro
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-5 pl-8">Expediente</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Motivo & Descripción</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Estado</TableHead>
                <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filtered.map((j, idx) => (
                  <motion.tr 
                    key={j.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-zinc-800 hover:bg-zinc-800/30 group"
                  >
                    <TableCell className="pl-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-100 tracking-tight">{j.nombre}</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-0.5 italic">
                           <Calendar className="w-3 h-3" /> 
                           {new Date(j.fecha).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[350px]">
                        <span className="text-xs font-bold text-zinc-300 uppercase italic tracking-tighter">{j.motivo}</span>
                        <span className="text-[10px] text-zinc-500 font-medium line-clamp-1 mt-0.5">{j.comentario || "Sin observaciones adicionales"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        {getStatusBadge(j.estado)}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-zinc-100 group-hover:bg-zinc-800 rounded-full">
                         <FileSearch className="w-4 h-4" />
                       </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-800">
               <FileText className="w-12 h-12 mb-4 opacity-10" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Bóveda Vacía</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-8 opacity-20 mt-10 pointer-events-none grayscale">
        <div className="flex items-center gap-2 text-zinc-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Protocolo de Archivo Auditado</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Archivo Digital • Andrés Bello 2026</span>
        </div>
      </div>
    </div>
  );
};

export default Justifications;
