import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search,
  Filter,
  User,
  MoreVertical,
  FileCheck,
  FileX,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const Justifications = () => {
  const [justifications, setJustifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    comentario: ''
  });
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

      setJustifications(justs);
      setStudents(stds);
      setLoading(false);
    } catch (e) {
      console.error('Error fetching data:', e);
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
        fetchData();
        setFormData({
          estudiante_id: '',
          fecha: new Date().toISOString().split('T')[0],
          motivo: '',
          comentario: ''
        });
      }
    } catch (e) {
      console.error('Error saving:', e);
    }
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('es-VE', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'aprobado': 
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black uppercase text-[10px] tracking-widest flex w-fit gap-1 items-center">
            <CheckCircle2 className="w-3 h-3" /> Aprobado
          </Badge>
        );
      case 'rechazado': 
        return (
          <Badge className="bg-red-500/10 text-red-500 border-none font-black uppercase text-[10px] tracking-widest flex w-fit gap-1 items-center">
            <XCircle className="w-3 h-3" /> Rechazado
          </Badge>
        );
      default: 
        return (
          <Badge className="bg-zinc-800 text-zinc-400 border-none font-black uppercase text-[10px] tracking-widest flex w-fit gap-1 items-center">
            <Clock className="w-3 h-3" /> Pendiente
          </Badge>
        );
    }
  };

  const filteredJusts = justifications.filter(j => 
    j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            Certificados Administrativos
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Gestión Docente • Protocolo de Justificación v2.0
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Filtrar por estudiante o motivo..." 
              className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="font-black uppercase tracking-widest text-[11px] bg-zinc-100 text-zinc-950 hover:bg-zinc-200 h-10 px-6">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic tracking-tighter">Protocolo de Registro</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                  Validación institucional de inasistencias
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Estudiante Asociado</Label>
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md h-12 px-3 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      required 
                      value={formData.estudiante_id}
                      onChange={e => setFormData({ ...formData, estudiante_id: e.target.value })}
                    >
                      <option value="">Seleccione un alumno...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre} ({s.seccion})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fecha Ausencia</Label>
                      <Input 
                        type="date" 
                        className="bg-zinc-900 border-zinc-800 h-12 text-zinc-200"
                        required 
                        value={formData.fecha}
                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Motivo Principal</Label>
                      <Input 
                        placeholder="Médico / Personal"
                        className="bg-zinc-900 border-zinc-800 h-12 text-zinc-200"
                        required 
                        value={formData.motivo}
                        onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descripción Detallada</Label>
                    <textarea 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 min-h-[100px] resize-none"
                      placeholder="Indique detalles adicionales del reposo o certificado..."
                      value={formData.comentario}
                      onChange={e => setFormData({ ...formData, comentario: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest text-[11px] h-12 mb-2">
                    Almacenar en Historial Seguro
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-5 pl-8">Expediente</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Motivo & Descripción</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fecha Validada</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estado</TableHead>
                <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Auditoría</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-60 text-center text-zinc-600 font-bold uppercase text-xs tracking-widest">
                    Consultando Archivos...
                  </TableCell>
                </TableRow>
              ) : filteredJusts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-700">
                      <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-sm font-black uppercase tracking-widest opacity-50 italic">Sin certificados registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredJusts.map((item) => (
                  <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/30 group">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-100 tracking-tight">{item.nombre}</span>
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{item.seccion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[250px]">
                        <span className="text-xs font-bold text-zinc-300 italic">{item.motivo}</span>
                        <span className="text-[10px] text-zinc-600 truncate">{item.comentario || "Sin comentarios"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <Calendar className="w-3 h-3 text-zinc-600" />
                        {formatDate(item.fecha)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.estado)}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-zinc-200">
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-6 opacity-30 grayscale saturate-0 pointer-events-none">
        <FileText className="w-6 h-6 text-zinc-500" />
        <FileCheck className="w-6 h-6 text-zinc-500" />
        <FileX className="w-6 h-6 text-zinc-500" />
      </div>
    </div>
  );
};

export default Justifications;

