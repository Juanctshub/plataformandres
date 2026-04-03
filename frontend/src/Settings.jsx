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
  Smartphone
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const Settings = () => {
    return (
        <div className="space-y-12 pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-5xl font-semibold tracking-tighter text-white/90 text-apple-gradient italic">Configuración</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Personalización del entorno operativo y parámetros institucionales.</p>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 relative z-10">
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 px-4 italic">Categorías</h3>
                        {[
                            { name: 'Perfil Institucional', icon: Building2, active: true },
                            { name: 'Seguridad y Nodos', icon: ShieldCheck, active: false },
                            { name: 'Notificaciones', icon: Bell, active: false },
                            { name: 'Base de Datos', icon: Database, active: false },
                            { name: 'Cuenta de Usuario', icon: User, active: false },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center justify-between p-6 px-8 rounded-[1.75rem] transition-all duration-700 font-semibold text-sm ${
                                    item.active 
                                        ? 'bg-white/[0.08] text-white shadow-xl' 
                                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                                }`}
                            >
                                <div className="flex items-center gap-5 italic tracking-tight">
                                    <item.icon className="w-5 h-5 opacity-80" />
                                    {item.name}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-8 apple-card p-12 bg-zinc-900/40 border-white/[0.05] transition-all duration-700">
                    <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
                        <div className="space-y-2">
                           <h3 className="text-3xl font-semibold text-white/90 italic uppercase tracking-tight">Perfil Institucional</h3>
                           <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest tracking-widest">Identidad del núcleo académico v9.0</p>
                        </div>
                        <Button className="h-11 px-8 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all flex gap-3 active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest text-[9px] italic">
                            Sincronizar Cambios
                        </Button>
                    </div>

                    <div className="space-y-16">
                        <div className="grid gap-12 md:grid-cols-2">
                             <div className="space-y-3">
                                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4">Nombre de la Institución</label>
                                 <div className="p-5 px-8 rounded-2xl bg-zinc-950 border border-white/5 text-sm font-semibold text-white/80 italic">UNIDAD EDUCATIVA ANDRÉS BELLO</div>
                             </div>
                             <div className="space-y-3">
                                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4">Periodo Escolar</label>
                                 <div className="p-5 px-8 rounded-2xl bg-zinc-950 border border-white/5 text-sm font-semibold text-white/80 italic">2026 - 2027 (RESERVADO)</div>
                             </div>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between group cursor-default">
                             <div className="flex items-center gap-8">
                                 <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-all duration-700">
                                     <Cloud className="w-7 h-7" />
                                 </div>
                                 <div className="flex flex-col">
                                     <h4 className="text-white font-bold text-lg mb-1 italic">Backup Automático Premium</h4>
                                     <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Sincronizado cada 12 horas con Vercel Postgres</p>
                                 </div>
                             </div>
                             <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-6 py-2 rounded-2xl font-black text-[9px] tracking-[0.25em] uppercase">Activo</Badge>
                        </div>

                        <div className="flex items-center gap-10 opacity-30 select-none pt-10 border-t border-white/5">
                            {[
                                { tooltip: 'Modo Oscuro', icon: Moon },
                                { tooltip: 'Seguridad', icon: ShieldCheck },
                                { tooltip: 'Mobile Ready', icon: Smartphone }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <s.icon className="w-5 h-5 text-zinc-500" />
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{s.tooltip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
