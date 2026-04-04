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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-6">
                <Building2 className="w-6 h-6 text-black" />
             </div>
             <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                Núcleo Institucional v14.0
             </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter text-white leading-none italic uppercase">Gestión de Control</h2>
            <p className="text-white/40 font-bold tracking-tight text-base max-w-2xl leading-relaxed">
              Terminal Central de Monitoreo Académico • Unidad Educativa Andrés Bello.
              <span className="block mt-2 text-white/20 select-none">Protocolo Pro Dark Activado.</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-[#1C1C1E] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-5">
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Sistema Activo</span>
                </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="px-5 pr-8 flex flex-col items-start">
              <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase italic">ID-Terminal</span>
              <span className="text-[11px] font-bold text-white uppercase mt-1.5 tracking-tighter">AB-PRO-2026</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            className="stat-card-pro"
          >
            <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                    <stat.icon className="h-6 w-6" />
                </div>
                <Badge className="bg-white/5 text-white/20 border-none font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg">
                    {stat.trend}
                </Badge>
            </div>
            
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{stat.label}</p>
                <div className="text-5xl font-black text-white tracking-tighter leading-none">
                    {stat.value}
                </div>
                <p className="text-[10px] font-bold text-white/30 mt-6 uppercase tracking-widest opacity-60 italic">
                    {stat.sub}
                </p>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mb-16 blur-3xl transition-all group-hover:bg-white/[0.05]" />
          </motion.div>
        ))}
      </div>

      {/* Analytics & Retention Summary */}
        <motion.div variants={item} className="lg:col-span-12 apple-pro-card p-12">
          <div className="flex flex-row items-center justify-between mb-12 border-b border-white/5 pb-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white flex items-center gap-5 italic uppercase tracking-tighter">
                <Activity className="w-8 h-8 text-white" />
                Vigilancia del Núcleo
              </h3>
              <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em]">
                Análisis de integridad y actividad en tiempo real v14.0
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Button 
                  onClick={() => onTabChange('analytics')}
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-8 rounded-2xl h-12 transition-all"
              >
                  Auditoría General
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <AlertTriangle className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Alertas Críticas</span>
                  </div>
                  {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
                    <div 
                      key={i}
                      className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-white/10 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-8">
                        <div className={`p-4 rounded-2xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {alert.type === 'danger' ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white tracking-tight">{alert.msg}</h4>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Protocolo Institucional Pro</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all" />
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-16 text-white/10 border-2 border-dashed border-white/5 rounded-[3rem]">
                      <LayoutGrid className="w-12 h-12 mb-6 opacity-30" />
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] italic opacity-30">Sincronización Limpia</p>
                    </div>
                  )}
              </div>

              <div className="space-y-6 border-l border-white/5 pl-16">
                 <div className="flex items-center gap-4 mb-6">
                    <Clock className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Actividad Reciente</span>
                 </div>
                 {stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((log, i) => (
                    <div key={i} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                       <div className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
                       <p className="text-[10px] text-white/60 font-bold tracking-tight uppercase leading-relaxed">{log.event}</p>
                    </div>
                 )) : (
                    <div className="py-24 flex flex-col items-center justify-center opacity-10 space-y-6">
                        <Activity className="w-12 h-12 text-white" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Esperando Datos del Núcleo</span>
                    </div>
                 )}
              </div>
          </div>
        </motion.div>

      {/* Action Suite (Signature Onyx Icons) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
                title: 'Reportes', 
                desc: 'Inteligencia Mensual', 
                icon: Printer, 
                action: generateAttendanceReport,
                color: 'bg-white text-black'
            },
            { 
                title: 'Matrícula', 
                desc: 'Carga Masiva Pro', 
                icon: UserPlus, 
                action: () => onTabChange('students'),
                color: 'bg-[#1C1C1E] text-white border border-white/10'
            },
            { 
                title: 'Núcleo', 
                desc: 'Configuración de Sistema', 
                icon: SettingsIcon, 
                action: () => onTabChange('settings'),
                color: 'bg-[#2C2C2E] text-white border border-white/5'
            }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-[#1C1C1E] border border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-8 group transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[320px] relative overflow-hidden"
            >
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-6 group-hover:scale-110 ${action.color}`}>
                <action.icon className="w-10 h-10" strokeWidth={1.5} />
              </div>
              
              <div className="space-y-3 relative z-10">
                <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">{action.title}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-white/60 transition-colors">
                    {action.desc}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
