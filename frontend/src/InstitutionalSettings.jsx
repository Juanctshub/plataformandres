import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  ShieldCheck, 
  Database, 
  ChevronRight, 
  Bell, 
  Cloud,
  Moon,
  Smartphone,
  Lock,
  Globe,
  Cpu,
  Fingerprint,
  Zap,
  Table,
  Terminal,
  Activity,
  X
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const InstitutionalSettings = () => {
    return (
        <div className="space-y-16 pb-20 relative">
            {/* Background Dynamic Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0A84FF]/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5E5CE6]/5 blur-[120px] rounded-full -ml-80 -mb-80 pointer-events-none" />

            {/* Header Pro */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-16 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-700 hover:rotate-12">
                            <SettingsIcon className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-white/5 text-white/40 border border-white/10 rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.4em]">
                            Configuración de Núcleo v14.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase underline decoration-white/10 decoration-8 underline-offset-8 transition-all hover:decoration-white/20 cursor-default">Ecosistema</h2>
                        <p className="text-white/40 font-bold tracking-tight text-lg mt-6 max-w-2xl leading-relaxed">
                            Personalización del entorno operativo y gestión de seguridad de nodos. 
                            <span className="block mt-2 text-[#0A84FF] select-none italic uppercase tracking-[0.2em] text-[11px] font-black underline underline-offset-4 decoration-[#0A84FF]/20">Parámetros de integridad global activos.</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 bg-[#1C1C1E] border border-white/5 p-4 pl-10 rounded-[2.5rem] shadow-2xl">
                    <div className="flex flex-col items-end gap-2 pr-8 border-r border-white/10">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none italic">Último Heartbeat</span>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#32D74B] shadow-[0_0_15px_rgba(50,215,75,0.5)] animate-pulse" />
                        <span className="text-xs font-black text-white leading-none uppercase tracking-widest">Sincronizado</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                      <Zap className="w-6 h-6" strokeWidth={1} />
                    </div>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 relative z-10">
                {/* Sidebar Settings Noir */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-10 px-8 italic border-b border-white/5 pb-6">Arquitectura del Nodo</h3>
                        {[
                            { name: 'Perfil Institucional', icon: Building2, active: true, desc: 'Identidad y Semántica' },
                            { name: 'Seguridad y Cifrado', icon: ShieldCheck, active: false, desc: 'Nodos de Acceso Secure' },
                            { name: 'Motor IA Analytics', icon: Activity, active: false, desc: 'Parámetros de Inferencia' },
                            { name: 'Base de Datos Síncrona', icon: Database, active: false, desc: 'Neon Postgres Cluster' },
                            { name: 'Administración Pro', icon: User, active: false, desc: 'Privilegios de Núcleo' },
                        ].map((item, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-full group flex items-center justify-between p-8 px-10 rounded-[2.5rem] transition-all duration-700 border ${
                                    item.active 
                                        ? 'bg-white text-black border-transparent shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] scale-[1.02]' 
                                        : 'bg-black/40 border-white/[0.03] text-white/40 hover:border-white/10 hover:bg-white/[0.02]'
                                }`}
                            >
                                <div className="flex items-center gap-8 italic tracking-tighter">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl ${item.active ? 'bg-black text-white' : 'bg-white/5 text-white/10 group-hover:text-white'}`}>
                                       <item.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                      <span className="font-black uppercase text-sm tracking-tighter text-inherit">{item.name}</span>
                                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.active ? 'text-black/30' : 'text-white/10 group-hover:text-white/30'}`}>{item.desc}</span>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 transition-all duration-700 ${item.active ? 'translate-x-2' : 'opacity-10 group-hover:opacity-40'}`} strokeWidth={3} />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Settings Panel Noir */}
                <div className="lg:col-span-8 apple-pro-card bg-black/40 border-white/[0.03] p-16 shadow-2xl relative overflow-hidden transition-all duration-700 hover:border-white/10">
                    <div className="absolute top-[-8rem] right-[-8rem] w-80 h-80 bg-white shadow-[0_0_150px_rgba(255,255,255,0.05)] rounded-full -z-10 group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-white/5 pb-12 gap-10 relative z-10">
                        <div className="space-y-4">
                           <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter underline decoration-white/10 decoration-8 underline-offset-8">Perfil Institucional</h3>
                           <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.5em] mt-4 italic">Semántica del Núcleo Académico v14.0</p>
                        </div>
                        <Button className="h-20 px-14 bg-white text-black hover:bg-zinc-200 rounded-[2.25rem] font-black transition-all flex gap-6 active:scale-95 shadow-[0_30px_70px_rgba(255,255,255,0.1)] uppercase tracking-[0.4em] text-[12px]">
                            Consolidar Configuración
                        </Button>
                    </div>

                    <div className="space-y-20 relative z-10">
                        <div className="grid gap-12 md:grid-cols-2">
                             <div className="space-y-6">
                                 <label className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] ml-8 italic">Denominación Legal</label>
                                 <div className="p-10 rounded-[2.5rem] bg-white hex-glow border border-transparent text-lg font-black text-black italic uppercase underline decoration-black/10 underline-offset-8 tracking-tighter shadow-2xl">
                                    UNIDAD EDUCATIVA ANDRÉS BELLO
                                 </div>
                             </div>
                             <div className="space-y-6">
                                 <label className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] ml-8 italic">Ciclo Académico Sincronizado</label>
                                 <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 text-sm font-black text-white italic tracking-[0.4em] uppercase leading-none shadow-inner flex items-center gap-5">
                                    <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse" />
                                    2026 PROSPECTIVE — v14.0
                                 </div>
                             </div>
                        </div>

                        <div className="space-y-10">
                            <label className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] ml-8 italic">Estatus de Nodos de Seguridad</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { name: 'Cifrado SSL PRO', status: 'Activo v1.4', icon: Lock, color: '#32D74B' },
                                    { name: 'Nodos Neon.Tech', status: 'Enterprise A1', icon: Terminal, color: '#0A84FF' },
                                    { name: 'Auth Biométrico', status: 'Habilitado', icon: Fingerprint, color: '#5E5CE6' },
                                ].map((s, i) => (
                                    <div key={i} className="p-10 rounded-[3rem] bg-black/40 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                                        <s.icon className="w-8 h-8 text-white/10 group-hover:scale-125 transition-all duration-700" style={{ color: s.color + '40' }} strokeWidth={1} />
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">{s.name}</span>
                                            <span className="text-sm font-black uppercase text-white italic tracking-tighter" style={{ color: s.color }}>{s.status}</span>
                                        </div>
                                        <div className="absolute right-[-1rem] bottom-[-1rem] w-20 h-20 bg-white opacity-0 group-hover:opacity-[0.02] rounded-full blur-2xl" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-14 rounded-[4rem] bg-white text-black flex flex-col lg:flex-row items-center justify-between group cursor-pointer shadow-[0_50px_100px_-20px_rgba(255,255,255,0.1)] overflow-hidden relative active:scale-[0.99] transition-all">
                             <Globe className="absolute -right-12 top-[-3rem] w-64 h-64 text-black/[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                             <div className="flex items-center gap-12 relative z-10">
                                 <div className="w-20 h-20 rounded-[2.5rem] bg-black flex items-center justify-center text-white shadow-2xl">
                                     <Cloud className="w-10 h-10" strokeWidth={1.5} />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <h4 className="text-black font-black text-3xl italic uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-700">Backup Cuántico</h4>
                                     <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.4em] italic">Respaldo Sincronizado cada 60 Minutos</p>
                                 </div>
                             </div>
                             <Badge className="bg-black text-white border-none px-10 py-4 rounded-2xl font-black text-[12px] tracking-[0.5em] uppercase shadow-2xl mt-8 lg:mt-0 relative z-10">Consolidado</Badge>
                        </div>

                        <div className="flex items-center gap-16 opacity-10 select-none pt-12 border-t border-white/5">
                            {[
                                { tooltip: 'Cerebro IA v14.0', icon: Moon },
                                { tooltip: 'Seguridad Neon Enterprise', icon: ShieldCheck },
                                { tooltip: 'Andrés Bello Mobile Suite', icon: Smartphone }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <s.icon className="w-5 h-5 text-white" strokeWidth={1} />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] leading-none italic">{s.tooltip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 opacity-10 text-white select-none pt-32 no-print">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Protocolo Andrés Bello Suite v14.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <Database className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Config Host: Neon.Tech Enterprise Quantum Cluster</span>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalSettings;
