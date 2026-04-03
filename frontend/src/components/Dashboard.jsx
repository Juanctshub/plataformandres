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
  Settings,
  Sparkles
} from 'lucide-react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";


const Dashboard = ({ stats, aiData }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const statCards = [
    { label: 'Matrícula Institucional', value: stats.students, sub: 'Media General Activa', icon: Users, color: 'text-blue-500', trend: 'Actualizado' },
    { label: 'Asistencia Hoy', value: stats.attendance, sub: 'Promedio Secciones', icon: CheckCircle2, color: 'text-emerald-500', trend: 'Alta' },
    { label: 'Protocolos IA', value: stats.risks, sub: 'Casos en Seguimiento', icon: Sparkles, color: 'text-purple-500', trend: 'IA v3' },
    { label: 'Pendientes', value: '12', sub: 'Justificativos por validar', icon: Clock, color: 'text-amber-500', trend: 'Atención' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20 relative"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center apple-shadow-soft">
                <Building2 className="w-5 h-5 text-zinc-500" />
             </div>
             <Badge className="bg-blue-500/10 text-blue-400 border-none rounded-full px-4 py-1.5 font-bold text-[9px] uppercase tracking-[0.3em]">Gestión v2.6.5</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-semibold tracking-tighter text-white/90 italic text-apple-gradient leading-tight">Centro de Control</h2>
            <p className="text-zinc-500 font-medium tracking-tight text-lg">Monitoreo integral del rendimiento académico y operacional institucional.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 no-print bg-zinc-900/30 backdrop-blur-3xl p-3 rounded-[2rem] border border-white/[0.03] shadow-2xl">
            <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 group cursor-help hover:bg-emerald-500/10 transition-all duration-700">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[4px] animate-ping opacity-30" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-400 tracking-[0.2em] uppercase leading-none">Nodos Activos</span>
                  <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mt-1">Sincronizado</span>
                </div>
            </div>
            <div className="h-10 w-[1px] bg-white/5" />
            <div className="px-4 flex flex-col items-end">
              <span className="text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase italic">Nucleo Andres Bello</span>
              <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest mt-1">ID: AB-2026-X4</span>
            </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="apple-card p-8 relative overflow-hidden group cursor-default bg-zinc-900/40 border-white/[0.05]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700">
                <stat.icon className="w-24 h-24" />
            </div>
            
            <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center ${stat.color} shadow-2xl overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <stat.icon className="h-6 w-6 relative z-10" />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-white/5 text-zinc-500 border-none font-bold text-[9px] uppercase tracking-widest px-2 py-1">
                        {stat.trend}
                    </Badge>
                </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-2">{stat.label}</p>
                <div className="text-4xl font-semibold text-white tracking-tighter transition-all duration-700 group-hover:text-apple-gradient">
                    {stat.value}
                </div>
                <p className="text-[10px] font-medium text-zinc-500 mt-4 uppercase tracking-widest opacity-40">
                    {stat.sub}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        <motion.div variants={item} className="lg:col-span-8 apple-card p-10 border-white/10">
          <div className="flex flex-row items-center justify-between mb-10 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white/90 flex items-center gap-3 italic uppercase tracking-tight">
                <Activity className="w-6 h-6 text-blue-500" />
                Análisis Predictivo
              </h3>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-tight">
                Patrones de deserción identificados por IA v3.8
              </p>
            </div>
            <Button variant="ghost" className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest gap-2 hover:bg-white/5 px-4 rounded-xl">
                Ver Detalles <ArrowUpRight className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-4">
              {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className={`p-6 rounded-[1.5rem] border transition-all duration-500 flex items-center justify-between group ${
                    alert.type === 'danger' 
                      ? 'bg-red-500/5 border-red-500/10 hover:bg-red-500/[0.08]' 
                      : 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {alert.type === 'danger' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-0.5 tracking-tight">{alert.msg}</h4>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Prioridad {alert.type === 'danger' ? 'Crítica' : 'Media'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-800 space-y-4 opacity-30 select-none">
                  <LayoutGrid className="w-12 h-12" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">Analizando Flujos de Datos...</p>
                </div>
              )}
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 apple-card p-10">
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white/90 italic uppercase tracking-tight mb-1">Retención</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Estadística por Grado 2026</p>
          </div>
          
          <div className="space-y-8">
            {[
              { label: '1er Año', val: 98, color: 'bg-blue-500' },
              { label: '2do Año', val: 94, color: 'bg-blue-500' },
              { label: '3er Año', val: 82, color: 'bg-amber-500' },
              { label: '4to Año', val: 91, color: 'bg-blue-400' },
              { label: '5to Año', val: 76, color: 'bg-red-500' },
            ].map(row => (
              <div key={row.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{row.label}</span>
                  <span className={`text-xs font-bold ${row.val < 80 ? 'text-red-400' : 'text-zinc-300'}`}>{row.val}%</span>
                </div>
                <div className="h-[3px] w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${row.val}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`h-full ${row.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-10 bg-white/5" />
          
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Actividad del Sistema</h4>
             {[
                { time: '10:45 AM', event: 'Justificativo Aprobado: Alumno J. Maira', type: 'system' },
                { time: '09:12 AM', event: 'Asistencia Sincronizada: 4to Año B', type: 'success' },
                { time: '08:00 AM', event: 'Backup semanal completado', type: 'info' }
             ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <span className="text-[8px] font-bold text-zinc-700 w-16 pt-0.5">{log.time}</span>
                   <p className="text-[10px] text-zinc-400 font-medium tracking-tight leading-relaxed">{log.event}</p>
                </div>
             ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Emitir Reporte de Asistencia', desc: 'Generar PDF mensual por sección académica.', icon: FileText, action: 'Generar' },
            { title: 'Inscribir Nueva Matrícula', desc: 'Añadir estudiante al núcleo de datos.', icon: Users, action: 'Registrar' },
            { title: 'Configurar Periodo Escolar', desc: 'Ajustar fechas y parámetros del año.', icon: Settings, action: 'Ajustar' }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="apple-card p-8 flex items-center justify-between group transition-all duration-700 bg-zinc-900/20 border-white/[0.03] hover:border-white/10"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white/90 mb-1">{action.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{action.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-800" />
            </motion.button>
          ))}
      </motion.div>

      <div className="flex items-center gap-10 opacity-30 text-zinc-700 select-none pt-10">
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cifrado Protocolo UPEL</span>
        </div>
        <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Andrés Bello • Nucleo Académico</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
