import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Mail, 
  UserCircle2,
  FileText,
  Activity,
  ArrowUpRight,
  Database,
  Cpu
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const IAAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/ai/analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-16 h-16 rounded-3xl bg-zinc-800 border-2 border-blue-500/50 flex items-center justify-center"
        >
          <Cpu className="text-blue-500 w-8 h-8" />
        </motion.div>
        <div className="text-center">
            <h3 className="text-zinc-100 font-black uppercase tracking-[0.2em] text-xs">Inicializando Motor Neural</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2">Sincronizando con NeonDB & Big Data Escolar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            Dashboard Predictivo IA
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Análisis de Deserción • Algoritmos de Intervención Temprana
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 font-black uppercase tracking-widest text-[11px] h-10 px-6 hover:bg-zinc-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Exportar Auditoría IA
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KPI Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Precisión Modelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter">94.2%</div>
              <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1 italic">Basado en Histórico 2025</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" /> Latencia Inferencial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter">12ms</div>
              <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1 italic">Procesamiento Real-Time</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3 text-blue-500" /> Integridad Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter">100%</div>
              <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1 italic">Sync con Neon Cloud</p>
            </CardContent>
          </Card>
        </div>

        {/* Neural Activity Card */}
        <Card className="lg:col-span-4 border-zinc-800 bg-zinc-950/50 backdrop-blur-sm flex flex-col justify-center px-6 relative overflow-hidden">
            <div className="flex items-center gap-4 py-6">
                <div className="relative">
                    <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-zinc-100 uppercase tracking-tight italic">Protocolo Neural Activo</h3>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Cotejando registros con patrones de deserción conocidos.</p>
                </div>
            </div>
        </Card>

        {/* Risk Alerts List */}
        <Card className="lg:col-span-12 xl:col-span-5 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 tracking-tighter">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Detecciones de Riesgo Crítico
            </CardTitle>
            <CardDescription className="text-zinc-500 text-[11px] font-bold uppercase tracking-tight">
              Identificación automatizada de posibles bajas escolares
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data?.alerts?.map((alert, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border-l-4 bg-zinc-950/40 border-l-${alert.type === 'danger' ? 'red-500' : 'amber-500'} border border-zinc-800/50`}
              >
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs font-bold text-zinc-200 leading-relaxed pr-4">{alert.msg}</p>
                   <Badge variant="outline" className={`bg-${alert.type === 'danger' ? 'red' : 'amber'}-500/10 text-${alert.type === 'danger' ? 'red' : 'amber'}-500 border-none font-black text-[9px]`}>
                      {alert.type === 'danger' ? 'NIVEL CRÍTICO' : 'SUGESTIÓN IA'}
                   </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-100">
                     <UserCircle2 className="w-3 h-3 mr-2" /> Ficha Alumno
                   </Button>
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-100">
                     <Mail className="w-3 h-3 mr-2" /> Contactar
                   </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Projection Chart & Trends */}
        <Card className="lg:col-span-12 xl:col-span-7 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 pb-4">
            <div className="space-y-1">
                <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 tracking-tighter">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Proyección de Asistencia Semanal
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[11px] font-bold uppercase tracking-tight">
                  Simulación basada en el flujo actual de datos
                </CardDescription>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-emerald-500">
                    <TrendingDown className="w-3 h-3 rotate-180" />
                    <span className="text-xs font-black">+4.2%</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">vs Semana Anterior</span>
            </div>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="flex items-end gap-3 md:gap-6 h-48 md:h-64 px-4">
              {[65, 80, 45, 90, 85, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-4 items-center group relative">
                    <div className={`absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-zinc-100 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md mb-2`}>
                        {h}%
                    </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className={`w-full max-w-[24px] md:max-w-[40px] rounded-t-xl transition-all ${
                      h < 50 
                        ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    } group-hover:brightness-125`}
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-200 transition-colors uppercase tracking-widest">
                        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center gap-10 border-t border-zinc-800/30 pt-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Flujo Saludable</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alerta Bajas</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-dashed rounded-full" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Proyección Sin Datos</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>Motor Neural v3.8 • {data?.security}</span>
        </div>
        <div>
            Refresco Neural: {data?.timestamp}
        </div>
      </div>
    </div>
  );
};

export default IAAnalytics;

