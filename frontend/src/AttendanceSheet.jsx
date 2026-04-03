import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceSkeleton = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-zinc-900" />
        <Skeleton className="h-4 w-48 bg-zinc-900" />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Skeleton className="h-10 w-full md:w-48 bg-zinc-900" />
        <Skeleton className="h-10 w-48 bg-zinc-900" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} className="h-32 w-full bg-zinc-900 rounded-2xl" />
      ))}
    </div>
  </div>
);

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [seccion, setSeccion] = useState('1er Año A');
  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStudents(data.filter(s => s.seccion === seccion));
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  const handleToggle = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const submitAttendance = async () => {
    setLoading(true);
    setMsg({ text: 'Sincronizando con NeonDB...', type: 'info' });
    const date = new Date().toISOString().split('T')[0];
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const promises = Object.entries(attendance).map(([id, status]) => 
        fetch(`${baseUrl}/api/asistencia`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify({ estudiante_id: parseInt(id), fecha: date, estado: status, observacion: '' })
        })
      );
      await Promise.all(promises);
      setMsg({ text: 'Lista auditada y almacenada con éxito', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    } catch (e) {
      setMsg({ text: 'Fallo en la comunicación con el servidor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const auditCount = Object.keys(attendance).length;
  const presentCount = Object.values(attendance).filter(v => v === 'presente').length;
  const absentCount = Object.values(attendance).filter(v => v === 'ausente').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-emerald-500" />
            Pase de Lista Diaria
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <Calendar className="w-3.5 h-3.5 text-zinc-500" />
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
               Sesión Administrativa: {new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
          </div>
        </div>
        
        <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl gap-1">
          {['1er Año A', '2do Año A', '3er Año A', '4to Año A', '5to Año A'].map(opt => (
            <Button 
              key={opt}
              size="sm"
              variant={seccion === opt ? "default" : "ghost"}
              onClick={() => setSeccion(opt)}
              className={`text-[10px] h-8 font-black uppercase tracking-wider ${
                seccion === opt ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistics Summary */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-widest">Resumen de Sesión</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-4xl font-black text-zinc-100 tracking-tighter">{auditCount}/{students.length}</div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px]">Auditados</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 font-bold">{presentCount} PRES</Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-none px-2 py-0.5 font-bold">{absentCount} AUS</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status / Info */}
        <Card className="lg:col-span-3 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex flex-row items-center px-8 relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
           <div className="flex-1">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-zinc-200 uppercase tracking-tight italic">Protocolo de Asistencia Activo</h3>
                   <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Verifique cada registro antes de la sincronización final con la base de datos.</p>
                </div>
             </div>
           </div>
           <Button 
            onClick={submitAttendance}
            disabled={auditCount === 0 || loading}
            className="h-12 px-8 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-500/5"
           >
             {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
             Sincronizar con NeonDB
           </Button>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-5 pl-8 w-24">Identificador</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Datos Institucionales del Estudiante</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Control de Presencia</TableHead>
                <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className="border-zinc-800 hover:bg-zinc-800/30 group">
                  <TableCell className="font-black text-zinc-600 text-xs pl-8">#{s.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-100 tracking-tight text-base">{s.nombre}</span>
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Documento: {s.cedula}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                       <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(s.id, 'presente')}
                        className={`h-9 px-6 font-black uppercase tracking-widest text-[10px] border-zinc-800 transition-all ${
                          attendance[s.id] === 'presente' 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-zinc-950 text-zinc-500 hover:text-zinc-200'
                        }`}
                       >
                         <UserCheck className="w-3.5 h-3.5 mr-2" />
                         Presente
                       </Button>
                       <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(s.id, 'ausente')}
                        className={`h-9 px-6 font-black uppercase tracking-widest text-[10px] border-zinc-800 transition-all ${
                          attendance[s.id] === 'ausente' 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'bg-zinc-950 text-zinc-500 hover:text-zinc-200'
                        }`}
                       >
                         <UserX className="w-3.5 h-3.5 mr-2" />
                         Ausente
                       </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-zinc-300">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-700">
                      <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-sm font-black uppercase tracking-widest opacity-50 italic">Sin registros matriculados en {seccion}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AnimatePresence>
        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 z-50 ${
              msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-black tracking-tight uppercase tracking-widest">{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceSheet;
