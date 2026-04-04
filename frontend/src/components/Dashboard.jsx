import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Activity,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  ChevronRight,
  ArrowUpRight,
  LayoutGrid,
  Clock,
  Settings as SettingsIcon,
  Sparkles,
  Printer,
  UserPlus,
  Plus,
  Command
} from 'lucide-react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = ({ stats, aiData, onTabChange }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const generateAttendanceReport = () => {
    const doc = jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(22);
    doc.text("Reporte Institucional de Asistencia", 14, 25);
    doc.setFontSize(10);
    doc.text(`Unidad Educativa Andrés Bello • Fecha: ${date}`, 14, 32);
    
    const tableData = [
      ["1er Año", "98.5%", "Activo"],
      ["2do Año", "94.0%", "Activo"],
      ["3er Año", "82.5%", "Atención"],
      ["4to Año", "91.2%", "Activo"],
      ["5to Año", "76.8%", "Crítico"]
    ];

    doc.autoTable({
      startY: 45,
      head: [["Sección Académica", "Asistencia Promedio", "Status Lógico"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#18181b', textColor: '#ffffff' }
    });

    doc.save(`Reporte_Asistencia_${date}.pdf`);
  };

  const statCards = [
    { label: 'Matrícula Total', value: stats.students || 0, sub: 'Estudiantes Registrados', icon: Users, color: 'text-zinc-400', trend: 'Sincronizado' },
    { label: 'Asistencia Global', value: stats.attendance || '0.0%', sub: 'Promedio Hoy', icon: CheckCircle2, color: 'text-emerald-500', trend: 'En Vivo' },
    { label: 'Seguimiento IA', value: stats.risks || 0, sub: 'Alertas Predictivas', icon: Sparkles, color: 'text-blue-500', trend: 'IA v.10' },
    { label: 'Por Validar', value: stats.justifications || 0, sub: 'Justificativos Pendientes', icon: Clock, color: 'text-amber-500', trend: 'Prioridad' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20 relative"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-2xl">
                <Building2 className="w-6 h-6 text-white" />
             </div>
             <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Suite Profesional v10.0
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none">Gestión Institucional</h2>
            <p className="text-zinc-400 font-bold tracking-tight text-lg max-w-2xl">
              Panel de control centralizado para el monitoreo de Media General y análisis de datos en tiempo real.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-5">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase leading-none">Servidor Activo</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1.5">Sincronizado</span>
                </div>
            </div>
            <div className="h-10 w-[1px] bg-zinc-100 mx-2" />
            <div className="px-4 pr-8 flex flex-col items-start translate-y-1">
              <span className="text-[10px] font-black text-zinc-400 tracking-[0.3em] uppercase italic">Nucleo Andrés Bello</span>
              <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest mt-1.5 tracking-tighter">ID-2026-XN</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            whileHover={{ y: -8 }}
            className="apple-card p-10 relative overflow-hidden group cursor-default"
          >
            <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100/50 flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge className="bg-zinc-50 text-zinc-400 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 mr-[-10px]">
                    {stat.trend}
                </Badge>
            </div>
            
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-3">{stat.label}</p>
                <div className="text-5xl font-black text-zinc-900 tracking-tighter">
                    {stat.value}
                </div>
                <p className="text-[10px] font-bold text-zinc-400 mt-6 uppercase tracking-widest opacity-60 italic">
                    {stat.sub}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics & Retention Summary */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        <motion.div variants={item} className="lg:col-span-8 apple-card p-12">
          <div className="flex flex-row items-center justify-between mb-12 border-b border-zinc-50 pb-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-zinc-900 flex items-center gap-4 italic uppercase tracking-tighter">
                <Activity className="w-8 h-8 text-blue-500" />
                Análisis Predictivo
              </h3>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Detección de patrones de deserción mediante IA v10
              </p>
            </div>
            <Button 
                onClick={() => onTabChange('analytics')}
                variant="ghost" 
                className="text-zinc-400 hover:text-zinc-900 text-xs font-black uppercase tracking-[0.2em] gap-3 px-6 rounded-2xl transition-all"
            >
                Detalles <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
              {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
                <div 
                  key={i}
                  className={`p-8 rounded-[2rem] border transition-all duration-500 flex items-center justify-between group ${
                    alert.type === 'danger' 
                      ? 'bg-red-50/30 border-red-100' 
                      : 'bg-amber-50/30 border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${alert.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'}`}>
                      {alert.type === 'danger' ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-zinc-900 mb-1 tracking-tight">{alert.msg}</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Protocolo Institucional activado • Prioridad Máxima</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-zinc-300 group-hover:text-zinc-900">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-200 space-y-6">
                  <LayoutGrid className="w-16 h-16 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Procesando Núcleo de Datos...</p>
                </div>
              )}
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 apple-card p-12">
          <div className="mb-12">
            <h3 className="text-2xl font-black text-zinc-900 italic uppercase tracking-tighter mb-1.5 underline underline-offset-8 decoration-zinc-100 decoration-2">Retención</h3>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Nivel de desempeño por grado</p>
          </div>
          
          <div className="space-y-10">
            {[
              { label: '1er Año', val: 98, color: 'bg-emerald-400' },
              { label: '2do Año', val: 94, color: 'bg-emerald-400' },
              { label: '3er Año', val: 82, color: 'bg-amber-400' },
              { label: '4to Año', val: 91, color: 'bg-blue-400' },
              { label: '5to Año', val: 76, color: 'bg-red-400' },
            ].map(row => (
              <div key={row.label} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">{row.label}</span>
                  <span className="text-xs font-black text-zinc-400">{row.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${row.val}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className={`h-full ${row.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 space-y-8">
             <div className="flex items-center gap-3 px-2">
                <Activity className="w-3.5 h-3.5 text-zinc-300" />
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Actividad Reciente</h4>
             </div>
             {stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((log, i) => (
                <div key={i} className="flex gap-5 items-start pl-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 mt-2 shrink-0" />
                   <p className="text-[10px] text-zinc-500 font-bold tracking-tight leading-relaxed uppercase">{log.event}</p>
                </div>
             )) : (
                <div className="py-12 flex flex-col items-center justify-center opacity-30 space-y-4">
                    <Clock className="w-8 h-8 text-zinc-300" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">Monitoreo Pasivo</span>
                </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* Action Suite (Functional Buttons) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
                title: 'Emitir Reporte de Asistencia', 
                desc: 'Generar PDF mensual por sección académica.', 
                icon: Printer, 
                action: generateAttendanceReport,
                variant: 'primary'
            },
            { 
                title: 'Inscribir Nueva Matrícula', 
                desc: 'Añadir estudiante al núcleo de datos.', 
                icon: UserPlus, 
                action: () => onTabChange('students'),
                variant: 'secondary'
            },
            { 
                title: 'Configurar Periodo Escolar', 
                desc: 'Ajustar fechas y parámetros del año.', 
                icon: SettingsIcon, 
                action: () => onTabChange('settings'),
                variant: 'secondary'
            }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`p-10 rounded-[3rem] flex flex-col items-start justify-between group transition-all duration-700 h-[260px] text-left border ${
                action.variant === 'primary' 
                  ? 'bg-zinc-950 text-white border-zinc-900 shadow-2xl shadow-zinc-900/10' 
                  : 'bg-white text-zinc-900 border-zinc-100 shadow-sm hover:shadow-xl hover:border-zinc-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-sm transition-all duration-700 group-hover:rotate-12 ${
                action.variant === 'primary' ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:text-zinc-900'
              }`}>
                <action.icon className="w-7 h-7" />
              </div>
              
              <div>
                <h4 className="text-xl font-black mb-3 tracking-tighter uppercase">{action.title}</h4>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${action.variant === 'primary' ? 'text-zinc-500' : 'text-zinc-300 group-hover:text-zinc-400'}`}>
                    {action.desc}
                </p>
              </div>

              <div className="w-full flex justify-end mt-4">
                 <div className={`p-3 rounded-2xl ${action.variant === 'primary' ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'} opacity-0 group-hover:opacity-100 transition-all duration-500`}>
                    <Plus className="w-5 h-5" />
                 </div>
              </div>
            </motion.button>
          ))}
      </motion.div>

      <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-200 select-none pt-20">
        <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocolo Cifrado UPEL-v10</span>
        </div>
        <div className="flex items-center gap-3">
            <Command className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Núcleo Administrativo Andrés Bello</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
