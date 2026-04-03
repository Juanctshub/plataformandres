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
  XCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = ({ stats, aiData }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const statCards = [
    { label: 'Matrícula Total', value: stats.students, sub: 'Media General', icon: Users, color: 'text-blue-500' },
    { label: 'Asistencia Hoy', value: stats.attendance, sub: 'Promedio Mensual', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Riesgo Crítico', value: stats.risks, sub: 'Casos Críticos', icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Justificaciones', value: '12', sub: 'Pendientes', icon: FileText, color: 'text-amber-500' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-zinc-100 tracking-tight">{stat.value}</div>
                <p className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-widest">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Análisis Predictivo de Deserción
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs font-medium uppercase tracking-tight">
                Motor de Inteligencia Artificial v3.8 • Basado en NeonDB
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold tracking-tighter">
              LIVE • AUDITADO
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border flex items-center gap-4 ${
                    alert.type === 'danger' 
                      ? 'bg-red-500/5 border-red-500/10 text-red-400' 
                      : 'bg-amber-500/5 border-amber-500/10 text-amber-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${alert.type === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    {alert.type === 'danger' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-none mb-1">Alerta de Riesgo Identificada</h4>
                    <p className="text-xs font-medium opacity-80">{alert.msg}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-700">
                  <Search className="w-12 h-12 mb-4 animate-pulse" />
                  <p className="text-sm font-bold uppercase tracking-widest italic opacity-50">Sincronizando patrones con la red institucional...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Métrica por Año
            </CardTitle>
            <CardDescription className="text-zinc-500 text-xs font-medium uppercase tracking-tight">
              Tasa de Retención Estudiantil 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {[
              { label: '1er Año', val: 98, color: 'bg-blue-500' },
              { label: '2do Año', val: 94, color: 'bg-blue-500' },
              { label: '3er Año', val: 82, color: 'bg-amber-500' },
              { label: '4to Año', val: 91, color: 'bg-blue-500' },
              { label: '5to Año', val: 76, color: 'bg-red-500' },
            ].map(row => (
              <div key={row.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{row.label}</span>
                  <span className={`text-sm font-black ${row.val < 80 ? 'text-red-400' : 'text-zinc-100'}`}>{row.val}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-800/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${row.val}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${row.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
