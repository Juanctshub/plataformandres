import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  GraduationCap, 
  Phone,
  ShieldCheck,
  Building2,
  Trash2,
  IdCard,
  User,
  CheckCircle2,
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
import { Skeleton } from "@/components/ui/skeleton";

const StudentsSkeleton = () => (
  <div className="space-y-8 pb-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-zinc-900" />
        <Skeleton className="h-4 w-48 bg-zinc-900" />
      </div>
      <Skeleton className="h-10 w-full md:w-80 bg-zinc-900 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4">
        <Skeleton className="h-[500px] w-full bg-zinc-900 rounded-xl" />
      </div>
      <div className="lg:col-span-8">
        <Skeleton className="h-[600px] w-full bg-zinc-900 rounded-xl" />
      </div>
    </div>
  </div>
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cedula: '', nombre: '', seccion: '1er Año A', representante: '', contacto: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const res = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Artificial delay to show skeleton polish
      setTimeout(() => {
        setStudents(data);
        setLoading(false);
      }, 800);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setMsg({ text: 'Estudiante inscrito exitosamente', type: 'success' });
        setFormData({ cedula: '', nombre: '', seccion: '1er Año A', representante: '', contacto: '' });
        fetchStudents();
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (e) { 
      setMsg({ text: 'Error de servidor. Verifique conexión.', type: 'error' }); 
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cedula.includes(searchTerm)
  );

  if (loading) return <StudentsSkeleton />;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3 italic uppercase">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            Control de Matrícula
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-1">
            Gestión de Expedientes Académicos • {students.length} Inscritos
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <Input 
            placeholder="Buscar por nombre o CI..." 
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-200 focus:ring-zinc-700 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
        >
            <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm sticky top-28">
            <CardHeader className="border-b border-zinc-800/50 pb-6">
                <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 uppercase italic">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                Nueva Inscripción
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">
                Ingreso de Datos Oficiales
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Cédula de Identidad</Label>
                    <div className="relative">
                    <IdCard className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                    <Input 
                        placeholder="V-00000000"
                        value={formData.cedula}
                        onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 pl-10 h-11 text-zinc-200"
                        required
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nombre Completo</Label>
                    <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                    <Input 
                        placeholder="Nombre y Apellido"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 pl-10 h-11 text-zinc-200"
                        required
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Sección Asignada</Label>
                    <select 
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl h-11 px-3 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 appearance-none"
                    value={formData.seccion}
                    onChange={(e) => setFormData({...formData, seccion: e.target.value})}
                    >
                    <option className="bg-zinc-950">1er Año A</option><option className="bg-zinc-950">1er Año B</option>
                    <option className="bg-zinc-950">2do Año A</option><option className="bg-zinc-950">2do Año B</option>
                    <option className="bg-zinc-950">3er Año A</option><option className="bg-zinc-950">4to Año A</option>
                    <option className="bg-zinc-950">5to Año A</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Representante</Label>
                    <Input 
                        placeholder="Nombre del Tutor"
                        value={formData.representante}
                        onChange={(e) => setFormData({...formData, representante: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 h-11 text-zinc-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contacto</Label>
                    <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                    <Input 
                        placeholder="+58 4XX-XXXXXXX"
                        value={formData.contacto}
                        onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 pl-10 h-11 text-zinc-200"
                    />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-12 bg-zinc-100 text-zinc-950 hover:bg-white font-black uppercase tracking-widest text-[11px] mt-4 rounded-xl transition-all active:scale-95"
                >
                    {submitting ? "Inscribiendo..." : "Validar e Inscribir"}
                </Button>

                <AnimatePresence>
                    {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider ${
                        msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                    >
                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {msg.text}
                    </motion.div>
                    )}
                </AnimatePresence>
                </form>
            </CardContent>
            </Card>
        </motion.div>

        {/* Student Records Table */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
        >
            <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-zinc-950/20 border-b border-zinc-800/50 flex flex-row items-center justify-between pb-6">
                    <div className="space-y-1">
                    <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 uppercase italic">
                        <Users className="w-5 h-5 text-blue-500" />
                        Historial de Matrícula
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        Registros Sincronizados con NeonDB
                    </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-800 font-black px-3 py-1">
                        {filteredStudents.length} ALUMNOS
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-zinc-800/50">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4 pl-6">Estudiante</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4">Sección</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4">Familiar</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4 pr-6">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                        {filteredStudents.map((s, idx) => (
                            <motion.tr 
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group cursor-default"
                            >
                            <TableCell className="pl-6 py-4">
                                <div className="flex flex-col">
                                <span className="font-bold text-zinc-100 tracking-tight">{s.nombre}</span>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">CI: {s.cedula}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] font-black">
                                {s.seccion}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-400">{s.representante || "N/A"}</span>
                                <span className="text-[10px] font-medium text-zinc-600 italic tracking-tight">{s.contacto || "Sin teléfono"}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-full h-8 w-8 transition-all">
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                            </motion.tr>
                        ))}
                        </AnimatePresence>
                    </TableBody>
                    </Table>
                    {filteredStudents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-zinc-800">
                        <Filter className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-20 italic">Sin resultados encriptados</p>
                    </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 opacity-20 grayscale saturate-0 pointer-events-none mt-10">
        <div className="flex items-center gap-2 text-zinc-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Protocolo de Matrícula Seguro</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Archivo Institucional UPEL-2026</span>
        </div>
      </div>
    </div>
  );
};

export default Students;
