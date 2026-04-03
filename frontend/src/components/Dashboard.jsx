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
  LayoutGrid
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
    { label: 'Matrícula Total', value: stats.students, sub: 'Estudiantes Activos', icon: Users, color: 'text-blue-500', trend: '+2%' },
    { label: 'Asistencia Promedio', value: stats.attendance, sub: 'Mes de Abril', icon: TrendingUp, color: 'text-emerald-500', trend: '+0.5%' },
    { label: 'Alertas IA', value: stats.risks, sub: 'Casos en Seguimiento', icon: Activity, color: 'text-red-500', trend: '-14%' },
    { label: 'Reposos Médicos', value: '12', sub: 'Certificados Hoy', icon: FileText, color: 'text-amber-500', trend: 'Estable' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight text-white/90 italic">Panel Institucional</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Resumen operativo sincronizado con el núcleo de datos.</p>
        </div>
        
        <div className="flex items-center gap-4 no-print">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Sistema Activo</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase italic">v8.4.2 stable</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div key={stat.label} variants={item} className="apple-card p-8 relative overflow-hidden group cursor-default">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
                <stat.icon className="w-20 h-20" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center ${stat.color} shadow-inner`}>
                    <stat.icon className="h-6 w-6" />
                </div>
                <Badge className="bg-white/5 text-zinc-500 border-none font-bold text-[9px] uppercase tracking-widest px-2 py-1">
                    {stat.trend}
                </Badge>
            </div>
            
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-1">{stat.label}</p>
                <div className="text-4xl font-semibold text-white tracking-tighter transition-all duration-700 group-hover:scale-[1.02] origin-left">
                    {stat.value}
                </div>
                <p className="text-[10px] font-medium text-zinc-500 mt-2 uppercase tracking-widest opacity-60">
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
        </motion.div>
      </div>

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
