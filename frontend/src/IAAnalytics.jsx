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
import { Skeleton } from "@/components/ui/skeleton";

const IAAnalyticsSkeleton = () => (
  <div className="space-y-8 pb-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-80 bg-zinc-900" />
        <Skeleton className="h-4 w-60 bg-zinc-900" />
      </div>
      <Skeleton className="h-10 w-40 bg-zinc-900 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full bg-zinc-900 rounded-xl" />
        ))}
      </div>
      <div className="lg:col-span-4">
        <Skeleton className="h-32 w-full bg-zinc-900 rounded-xl" />
      </div>
      <div className="lg:col-span-5">
        <Skeleton className="h-[500px] w-full bg-zinc-900 rounded-xl" />
      </div>
      <div className="lg:col-span-7">
        <Skeleton className="h-[500px] w-full bg-zinc-900 rounded-xl" />
      </div>
    </div>
  </div>
);

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
        
        // Simular latencia de procesamiento neural para mostrar el skeleton
        setTimeout(() => {
          setData(json);
          setLoading(false);
        }, 1000);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <IAAnalyticsSkeleton />;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 tracking-tighter flex items-center gap-3 italic uppercase">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            Dashboard Predictivo IA
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-1 italic">
            Análisis de Deserción • Algoritmos de Intervención Temprana
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 font-black uppercase tracking-widest text-[11px] h-10 px-6 hover:bg-zinc-900 transition-all active:scale-95"
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
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
                <ShieldCheck className="w-3 h-4 text-emerald-500" /> Precisión Modelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter italic">94.2%</div>
              <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 italic tracking-widest">Sincronizado 2026</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
                <Zap className="w-3 h-3 text-amber-500" /> Latencia Inferencial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter italic">12ms</div>
              <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 italic tracking-widest">Tiempo Real Core</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
                <Database className="w-3 h-3 text-blue-500" /> Integridad Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 tracking-tighter italic">100%</div>
              <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 italic tracking-widest">Neon Cloud Sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Neural Activity Card */}
        <Card className="lg:col-span-4 border-zinc-800 bg-zinc-950/20 backdrop-blur-sm flex flex-col justify-center px-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-4 py-8">
                <div className="relative">
                    <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-zinc-100 uppercase tracking-tighter italic">Motor Neural ACTIVO</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Análisis Multivariante v3.8</p>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] pointer-events-none" />
        </Card>

        {/* Risk Alerts List */}
        <Card className="lg:col-span-12 xl:col-span-5 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-500/10 pb-4">
            <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 tracking-tighter italic uppercase">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Riesgo de Deserción
            </CardTitle>
            <CardDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              Detecciones Automatizadas Institucionales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            <AnimatePresence>
                {data?.alerts?.map((alert, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border bg-zinc-950/40 transition-all hover:bg-zinc-900 group ${
                        alert.type === 'danger' ? 'border-red-500/20 hover:border-red-500/40' : 'border-amber-500/20 hover:border-amber-500/40'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <Badge className={`font-black uppercase text-[8px] tracking-widest px-2 py-0.5 pointer-events-none ${
                             alert.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                            {alert.type === 'danger' ? 'ALTA PRIORIDAD' : 'SUGESTIÓN IA'}
                        </Badge>
                        <span className="text-[9px] font-black text-zinc-700 tracking-widest">S-REC: 2026-X</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-300 leading-relaxed pr-2">{alert.msg}</p>
                    <div className="flex gap-3 mt-5">
                       <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 bg-zinc-950 px-4 rounded-xl">
                         <UserCircle2 className="w-3.5 h-3.5 mr-2" /> Perfil
                       </Button>
                       <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 bg-zinc-950 px-4 rounded-xl">
                         <Mail className="w-3.5 h-3.5 mr-2" /> Notificar
                       </Button>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            {!data?.alerts?.length && (
                <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20">
                    <ShieldCheck className="w-12 h-12 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sin riesgos detectados</span>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Projection Chart & Trends */}
        <Card className="lg:col-span-12 xl:col-span-7 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-500/10 pb-4">
            <div className="space-y-1">
                <CardTitle className="text-xl font-black text-zinc-100 flex items-center gap-2 tracking-tighter italic uppercase">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Proyección Semanal
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  Tendencia Predictiva Multinodal
                </CardDescription>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-emerald-500">
                    <TrendingDown className="w-3 h-3 rotate-180" />
                    <span className="text-xs font-black">+4.2%</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Incremento esperado</span>
            </div>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="flex items-end gap-3 md:gap-6 h-48 md:h-64 px-4 bg-zinc-950/20 rounded-2xl p-6 border border-zinc-800/10">
              {[65, 80, 45, 90, 85, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-4 items-center group relative">
                    <div className={`absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-zinc-100 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md mb-2 z-10`}>
                        {h}%
                    </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                    className={`w-full max-w-[32px] md:max-w-[48px] rounded-t-2xl transition-all ${
                      h < 50 
                        ? 'bg-gradient-to-t from-red-600/80 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                        : 'bg-gradient-to-t from-indigo-600/80 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    } group-hover:brightness-125 group-hover:scale-x-110`}
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-zinc-600 group-hover:text-zinc-200 transition-colors uppercase tracking-[0.2em]">
                        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 pt-8 opacity-40">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Crítico</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                    <Database className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sync Neon</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] select-none">
        <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-zinc-800" />
            <span>Andrés Bello Neural Engine v3.8 • {data?.security || 'RSA-4096'}</span>
        </div>
        <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-950" />
            <span>Última Interferencia: {data?.timestamp || 'Justo ahora'}</span>
        </div>
      </div>
    </div>
  );
};

export default IAAnalytics;
