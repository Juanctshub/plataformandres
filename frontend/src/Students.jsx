import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Search, 
  IdCard, 
  Phone, 
  User, 
  GraduationCap,
  Trash2,
  Filter,
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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cedula: '', nombre: '', seccion: '1er Año A', representante: '', contacto: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStudents(data);
    } catch (e) { 
      console.error('Error fetching students:', e); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
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
      setLoading(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cedula.includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            Control de Matrícula
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Gestión de Alumnos • Periodo Escolar 2026
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <Input 
            placeholder="Buscar por nombre o CI..." 
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-200 focus:ring-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form */}
        <Card className="lg:col-span-4 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-28">
          <CardHeader className="border-b border-zinc-500/10 pb-6">
            <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-500" />
              Nueva Inscripción
            </CardTitle>
            <CardDescription className="text-zinc-500 text-xs font-medium uppercase tracking-tight">
              Ingrese los datos oficiales del alumno
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
                    placeholder="Andrés Bello"
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
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md h-11 px-3 text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  value={formData.seccion}
                  onChange={(e) => setFormData({...formData, seccion: e.target.value})}
                >
                  <option>1er Año A</option><option>1er Año B</option>
                  <option>2do Año A</option><option>2do Año B</option>
                  <option>3er Año A</option><option>4to Año A</option>
                  <option>5to Año A</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Representante</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-600 font-bold text-xs uppercase">REP</span>
                  <Input 
                    placeholder="Nombre del Tutor"
                    value={formData.representante}
                    onChange={(e) => setFormData({...formData, representante: e.target.value})}
                    className="bg-zinc-950/50 border-zinc-800 pl-12 h-11 text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contacto Telefónico</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                  <Input 
                    placeholder="+58 412..."
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    className="bg-zinc-950/50 border-zinc-800 pl-10 h-11 text-zinc-200"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-black uppercase tracking-widest text-[11px] mt-4"
              >
                {loading ? "Inscribiendo..." : "Validar e Inscribir Estudiante"}
              </Button>

              <AnimatePresence>
                {msg.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-md flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${
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

        {/* Student Records Table */}
        <Card className="lg:col-span-8 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-500/10 pb-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Matrícula Registrada
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs font-medium uppercase tracking-tight">
                Consolidado de alumnos inscritos en el sistema
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-black">
              {filteredStudents.length} ALUMNOS
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4 pl-6">ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4">Datos del Alumno</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4">Sección</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4">Representante</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4 pr-6">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
                        <TableCell className="font-black text-zinc-600 text-xs pl-6">#{s.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-100 tracking-tight">{s.nombre}</span>
                            <span className="text-[10px] font-medium text-zinc-500">CI: {s.cedula}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700 text-[10px] font-bold">
                            {s.seccion}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{s.representante || "N/A"}</span>
                            <span className="text-[10px] font-medium text-zinc-600 italic">{s.contacto || "Sin teléfono"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
                <Filter className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">No se encontraron coincidencias</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
