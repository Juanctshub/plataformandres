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
  Command,
  ArrowRight
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
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
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
    { label: 'Matrícula', value: stats.students || 0, sub: 'Estudiantes Registrados', icon: Users, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Asistencia', value: stats.attendance || '98.5%', sub: 'Asistencia Global', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'IA Risks', value: stats.risks || 0, sub: 'Alertas Predictivas', icon: Sparkles, color: 'bg-indigo-500/10 text-indigo-400' },
    { label: 'Justificativos', value: stats.justifications || 0, sub: 'Pendientes por Validar', icon: Clock, color: 'bg-amber-500/10 text-amber-400' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="space-y-6">
        <div className="flex items-center gap-3">
           <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-4 py-1 text-[10px] font-semibold uppercase tracking-widest">
              Sesión Iniciada v15.0
           </Badge>
        </div>
        <h2 className="text-6xl font-semibold tracking-tight text-white leading-tight">
          Hola, <span className="text-[#86868b]">Control de Gestión</span>
        </h2>
        <p className="text-xl text-[#86868b] font-medium max-w-2xl leading-relaxed">
          Bienvenido al centro operativo de la Unidad Educativa Andrés Bello. Aquí tienes un resumen del pulso académico institucional.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            className="apple-card group"
          >
            <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white transition-all">
                   <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b] mb-2">{stat.label}</p>
                <div className="text-4xl font-semibold text-white tracking-tight">
                    {stat.value}
                </div>
                <p className="text-xs text-[#86868b] mt-4 font-medium">
                    {stat.sub}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={item} className="lg:col-span-8 apple-card">
           <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Activity className="w-5 h-5" />
                 </div>
                 <h3 className="text-2xl font-semibold text-white tracking-tight">Monitoreo IA</h3>
              </div>
              <Button 
                onClick={() => onTabChange('analytics')}
                className="bg-white/5 hover:bg-white/10 text-white rounded-full px-6 py-2 text-xs font-semibold transition-all"
              >
                 Ver Analíticas Completas
              </Button>
           </div>

           <div className="space-y-6">
              {aiData.alerts && aiData.alerts.length > 0 ? (
                aiData.alerts.map((alert, i) => (
                   <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-6">
                         <div className={`p-3 rounded-2xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {alert.type === 'danger' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                         </div>
                         <div>
                            <h4 className="text-base font-semibold text-white tracking-tight">{alert.msg}</h4>
                            <p className="text-xs text-[#86868b] mt-1 font-medium italic">Acción sugerida por el motor predictivo</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all -translate-x-2 group-hover:translate-x-0" />
                   </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-[#86868b] space-y-6 opacity-30 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <ShieldCheck className="w-12 h-12" />
                   <p className="text-sm font-semibold tracking-widest uppercase">Sistema en Condiciones Óptimas</p>
                </div>
              )}
           </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 apple-card">
           <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                 <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">Actividad</h3>
           </div>

           <div className="space-y-8">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log, i) => (
                  <div key={i} className="flex gap-5 group">
                     <div className="flex flex-col items-center gap-2 pt-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <div className="w-[1.5px] h-full bg-white/5 rounded-full" />
                     </div>
                     <div className="pb-8">
                        <p className="text-sm font-medium text-white/90 leading-relaxed mb-1">{log.event}</p>
                        <span className="text-[10px] font-semibold text-[#86868b] tracking-wider uppercase">{log.time}</span>
                     </div>
                  </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-[#86868b] space-y-4 opacity-10">
                   <Activity className="w-12 h-12" />
                   <span className="text-xs font-semibold tracking-widest uppercase">Sin Actividad Reciente</span>
                </div>
              )}
           </div>
        </motion.div>
      </div>

      {/* Action Footnotes */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-6 pt-10">
         <Button 
            onClick={generateAttendanceReport}
            className="apple-glass hover:bg-white/5 text-white/80 rounded-full px-8 h-12 flex gap-3 text-xs font-semibold transition-all border border-white/5"
         >
            <Printer className="w-4 h-4" />
            Descargar Reporte Pro
         </Button>
         <Button 
            onClick={() => onTabChange('students')}
            className="apple-glass hover:bg-white/5 text-white/80 rounded-full px-8 h-12 flex gap-3 text-xs font-semibold transition-all border border-white/5"
         >
            <UserPlus className="w-4 h-4" />
            Nuevo Registro Estudiantil
         </Button>
         <div className="ml-auto flex items-center gap-4 text-[#86868b] select-none opacity-20">
            <Command className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Protocolo Andrés Bello 2026</span>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
