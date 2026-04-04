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
  Zap
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const InstitutionalSettings = () => {
    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-xl">
                            <SettingsIcon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-[0.3em]">
                            Configuración de Núcleo • v10.0
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-tighter text-zinc-900 leading-none italic uppercase underline decoration-zinc-100 decoration-8 underline-offset-8">Configuración</h2>
                        <p className="text-zinc-400 font-bold tracking-tight text-lg mt-4 max-w-2xl">
                            Personalización del entorno operativo, gestión de seguridad de nodos y parámetros institucionales.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 pr-6 border-r border-zinc-100">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">Última Sincronización</span>
                      <span className="text-xs font-black text-zinc-900 uppercase">Hoy, 12:45 PM</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                      <Zap className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 relative z-10">
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em] mb-8 px-6 italic">Arquitectura</h3>
                        {[
                            { name: 'Perfil Institucional', icon: Building2, active: true, desc: 'Identidad corporativa y logos' },
                            { name: 'Seguridad y Nodos', icon: ShieldCheck, active: false, desc: 'Cifrado cuántico y accesos' },
                            { name: 'Notificaciones IA', icon: Bell, active: false, desc: 'Alertas automáticas a representantes' },
                            { name: 'Base de Datos', icon: Database, active: false, desc: 'Neon Postgres & Backups' },
                            { name: 'Cuenta de Usuario', icon: User, active: false, desc: 'Perfil administrativo' },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full group flex items-center justify-between p-8 px-10 rounded-[2.5rem] transition-all duration-700 ${
                                    item.active 
                                        ? 'bg-zinc-950 text-white shadow-2xl shadow-zinc-900/20' 
                                        : 'bg-white border border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:shadow-xl'
                                }`}
                            >
                                <div className="flex items-center gap-6 italic tracking-tighter">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${item.active ? 'bg-white/10 text-white' : 'bg-zinc-50 text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white'}`}>
                                       <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span className="font-black uppercase text-xs">{item.name}</span>
                                      <span className={`text-[10px] font-bold ${item.active ? 'text-zinc-500' : 'text-zinc-300'}`}>{item.desc}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-30" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white border border-zinc-100 rounded-[3.5rem] p-16 shadow-sm relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-zinc-200">
                    <div className="absolute top-[-5rem] right-[-5rem] w-64 h-64 bg-zinc-50 rounded-full group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-zinc-50 pb-12 gap-8 relative z-10">
                        <div className="space-y-2">
                           <h3 className="text-4xl font-black text-zinc-900 italic uppercase tracking-tighter underline decoration-zinc-50 decoration-4 underline-offset-8">Perfil Institucional</h3>
                           <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Identidad del núcleo académico v10.0</p>
                        </div>
                        <Button className="h-16 px-10 bg-zinc-950 text-white hover:bg-zinc-800 rounded-3xl font-black transition-all flex gap-4 active:scale-95 shadow-xl shadow-zinc-900/20 uppercase tracking-widest text-[10px]">
                            Publicar Sincronización
                        </Button>
                    </div>

                    <div className="space-y-16 relative z-10">
                        <div className="grid gap-12 md:grid-cols-2">
                             <div className="space-y-4">
                                 <label className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.3em] ml-6">Razón Social</label>
                                 <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 text-sm font-black text-zinc-900 italic uppercase underline decoration-zinc-200 underline-offset-4 tracking-tight">UNIDAD EDUCATIVA ANDRÉS BELLO</div>
                             </div>
                             <div className="space-y-4">
                                 <label className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.3em] ml-6">Periodo Académico Actual</label>
                                 <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 text-sm font-black text-zinc-900 italic tracking-widest">2026 PROSPECTIVE — v10 (ACTIVE)</div>
                             </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.3em] ml-6">Parámetros de Seguridad</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'Cifrado SSL', status: 'Activo', icon: Lock },
                                    { name: 'Nodos Neon', status: 'Cluster A1', icon: Cpu },
                                    { name: 'Auth Multi-v', status: 'Certificado', icon: Fingerprint },
                                ].map((s, i) => (
                                    <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-zinc-50 hover:border-zinc-100 hover:bg-zinc-50 transition-all group flex flex-col gap-4">
                                        <s.icon className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-zinc-300">{s.name}</span>
                                            <span className="text-xs font-black uppercase text-zinc-900 mt-1">{s.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-12 rounded-[3.5rem] bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between group cursor-pointer shadow-2xl shadow-zinc-950/20 overflow-hidden relative">
                             <Globe className="absolute -right-8 top-[-2rem] w-48 h-48 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                             <div className="flex items-center gap-10 relative z-10">
                                 <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-white shadow-xl shadow-white/5">
                                     <Cloud className="w-8 h-8" />
                                 </div>
                                 <div className="flex flex-col">
                                     <h4 className="text-white font-black text-2xl mb-1 italic uppercase tracking-tighter">Bóveda de Respaldo Pro</h4>
                                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Sincronización Neon Quantum • Cada 60 Minutos</p>
                                 </div>
                             </div>
                             <Badge className="bg-emerald-500 text-white border-none px-8 py-3 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-xl shadow-emerald-500/20 relative z-10">Verificado</Badge>
                        </div>

                        <div className="flex items-center gap-12 opacity-30 select-none pt-12 border-t border-zinc-50">
                            {[
                                { tooltip: 'Modo Apple Zen', icon: Moon },
                                { tooltip: 'Safe Node Host', icon: ShieldCheck },
                                { tooltip: 'Full Mobile Suite', icon: Smartphone }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <s.icon className="w-4 h-4 text-zinc-900" />
                                    <span className="text-[9px] font-black text-zinc-900 uppercase tracking-[0.4em] leading-none">{s.tooltip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 opacity-30 text-zinc-300 select-none pt-20">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocolo Andrés Bello Suite v10.0</span>
                </div>
                <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Config Host: Neon.Tech Enterprise</span>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalSettings;
