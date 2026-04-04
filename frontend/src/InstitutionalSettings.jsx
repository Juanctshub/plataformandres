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
  X,
  CreditCard,
  History
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const InstitutionalSettings = () => {
    return (
        <div className="space-y-12">
            {/* Header Mini */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                     <SettingsIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Configuración del Sistema</h2>
               </div>
               <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  v15.0 Enterprise
               </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    {[
                       { name: 'Institución', icon: Building2, active: true },
                       { name: 'Seguridad', icon: ShieldCheck, active: false },
                       { name: 'Notificaciones', icon: Bell, active: false },
                       { name: 'Plan de Pago', icon: CreditCard, active: false },
                       { name: 'Historial', icon: History, active: false },
                    ].map((item, i) => (
                       <button
                          key={i}
                          className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${
                             item.active 
                               ? 'bg-white/10 text-white border border-white/20' 
                               : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                       >
                          <div className="flex items-center gap-4">
                             <item.icon className="w-5 h-5" strokeWidth={1.5} />
                             <span className="text-sm font-semibold">{item.name}</span>
                          </div>
                          {item.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                       </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-8 apple-card p-12">
                   <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                      <div>
                         <h3 className="text-2xl font-semibold text-white tracking-tight">Perfil Institucional</h3>
                         <p className="text-sm text-[#86868b] mt-1">Información base de la entidad académica</p>
                      </div>
                      <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs">
                         Guardar Cambios
                      </Button>
                   </div>

                   <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Denominación</label>
                            <div className="h-14 bg-white/5 border border-white/5 rounded-xl px-6 flex items-center text-white font-medium">
                               U.E. Andrés Bello
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest pl-2">Código SICE</label>
                            <div className="h-14 bg-white/5 border border-white/5 rounded-xl px-6 flex items-center text-white font-medium">
                               AB-2026-X99
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-xs font-bold text-white uppercase tracking-widest">Nodos de Red</h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                               { label: 'Cloud SQL', status: 'Inyectado', icon: Cloud, color: 'text-blue-400' },
                               { label: 'Seguridad', status: 'SSL v3', icon: Lock, color: 'text-emerald-400' },
                               { label: 'IA Engine', status: 'Core v2', icon: Cpu, color: 'text-purple-400' },
                            ].map((n, i) => (
                               <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                                  <n.icon className={`w-6 h-6 ${n.color}`} />
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{n.label}</span>
                                     <span className="text-xs font-bold text-white mt-1">{n.status}</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer hover:bg-blue-600/20 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                               <Cloud className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                               <h4 className="text-lg font-semibold text-white tracking-tight">Respaldo en la Nube</h4>
                               <p className="text-xs text-blue-400 font-medium">Sincronizado hace 12 minutos</p>
                            </div>
                         </div>
                         <Button className="bg-white text-black hover:bg-zinc-100 rounded-full px-8 text-[11px] font-bold uppercase tracking-widest h-10">
                            Respaldar Ahora
                         </Button>
                      </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalSettings;
