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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
             </div>
             <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest">
                Núcleo Administrativo v12.0
             </Badge>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase">Gestión Institucional</h2>
            <p className="text-zinc-400 font-bold tracking-tight text-sm max-w-xl">
              Sistema Central de Control y Monitoreo Académico • Unidad Educativa Andrés Bello.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="px-5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-700 tracking-widest uppercase">Sistema Activo</span>
                </div>
            </div>
            <div className="h-8 w-[1px] bg-zinc-100" />
            <div className="px-4 pr-6 flex flex-col items-start translate-y-[1px]">
              <span className="text-[9px] font-black text-zinc-300 tracking-widest uppercase">ID-Terminal</span>
              <span className="text-[10px] font-bold text-zinc-900 uppercase mt-0.5 tracking-tighter">AB-2026-XN</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            className="bg-white border border-zinc-100 rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                    <stat.icon className="h-5 w-5" />
                </div>
                <Badge className="bg-zinc-50 text-zinc-400 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg">
                    {stat.trend}
                </Badge>
            </div>
            
            <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mb-2">{stat.label}</p>
                <div className="text-4xl font-black text-zinc-950 tracking-tighter">
                    {stat.value}
                </div>
                <p className="text-[9px] font-bold text-zinc-400 mt-4 uppercase tracking-widest opacity-60">
                    {stat.sub}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics & Retention Summary */}
        <motion.div variants={item} className="lg:col-span-12 apple-card p-10">
          <div className="flex flex-row items-center justify-between mb-10 border-b border-zinc-50 pb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-zinc-900 flex items-center gap-4 italic uppercase tracking-tighter">
                <Activity className="w-6 h-6 text-indigo-600" />
                Vigilancia del Núcleo
              </h3>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Análisis de integridad y actividad institucional en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                  onClick={() => onTabChange('analytics')}
                  variant="outline" 
                  className="border-zinc-100 text-zinc-500 hover:text-black text-[9px] font-black uppercase tracking-widest px-5 rounded-xl h-10 transition-all"
              >
                  Auditoría General
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Alertas Académicas</span>
                  </div>
                  {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
                    <div 
                      key={i}
                      className="p-6 rounded-2xl border border-zinc-50 bg-zinc-50/30 flex items-center justify-between group hover:border-zinc-200 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-3 rounded-xl ${alert.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                          {alert.type === 'danger' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-900 tracking-tight">{alert.msg}</h4>
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1 italic">Protocolo Institucional</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-200" />
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-200 border-2 border-dashed border-zinc-100 rounded-3xl">
                      <LayoutGrid className="w-8 h-8 mb-4 opacity-50" />
                      <p className="text-[9px] font-black uppercase tracking-widest italic opacity-50">Sincronización Limpia</p>
                    </div>
                  )}
              </div>

              <div className="space-y-4 border-l border-zinc-50 pl-10">
                 <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Actividad del Núcleo</span>
                 </div>
                 {stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((log, i) => (
                    <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
                       <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 shrink-0" />
                       <p className="text-[9px] text-zinc-600 font-bold tracking-tight uppercase">{log.event}</p>
                    </div>
                 )) : (
                    <div className="py-20 flex flex-col items-center justify-center opacity-20 space-y-4">
                        <Activity className="w-8 h-8 text-zinc-300" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Sincronizado • Esperando Datos</span>
                    </div>
                 )}
              </div>
          </div>
        </motion.div>

      {/* Action Suite (Signature Onyx Icons) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
                title: 'Reportes', 
                desc: 'Análisis Mensual', 
                icon: Printer, 
                action: generateAttendanceReport,
                color: 'bg-zinc-950 text-white'
            },
            { 
                title: 'Matrícula', 
                desc: 'Acreditación Directa', 
                icon: UserPlus, 
                action: () => onTabChange('students'),
                color: 'bg-zinc-800 text-white'
            },
            { 
                title: 'Institución', 
                desc: 'Configuración', 
                icon: SettingsIcon, 
                action: () => onTabChange('settings'),
                color: 'bg-zinc-700 text-white'
            }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white border border-zinc-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-6 group transition-all duration-500 hover:shadow-xl hover:border-zinc-200 min-h-[280px]"
            >
              <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 ${action.color}`}>
                <action.icon className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xl font-black text-black tracking-tighter uppercase italic">{action.title}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-zinc-500 transition-colors">
                    {action.desc}
                </p>
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
