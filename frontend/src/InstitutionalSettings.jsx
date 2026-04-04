import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  History,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { useState } from 'react';

const InstitutionalSettings = () => {
    const [activeSection, setActiveSection] = useState('Institución');

    const sections = [
        { name: 'Institución', icon: Building2 },
        { name: 'Seguridad', icon: ShieldCheck },
        { name: 'Notificaciones', icon: Bell },
        { name: 'Plan de Pago', icon: CreditCard },
        { name: 'Historial', icon: History },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header Mini */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                     <SettingsIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Configuración del Sistema</h2>
               </div>
               <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                  v15.0 Enterprise
               </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-3">
                    {sections.map((item, i) => (
                       <button
                          key={i}
                          onClick={() => setActiveSection(item.name)}
                          className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] transition-all duration-300 border ${
                             activeSection === item.name
                               ? 'bg-white/10 text-white border-white/20 shadow-xl' 
                               : 'text-[#86868b] hover:text-white hover:bg-white/5 border-transparent'
                          }`}
                       >
                          <div className="flex items-center gap-4">
                             <item.icon className={`w-5 h-5 ${activeSection === item.name ? 'text-blue-400' : ''}`} strokeWidth={activeSection === item.name ? 2 : 1.5} />
                             <span className="text-sm font-semibold">{item.name}</span>
                          </div>
                          {activeSection === item.name && (
                            <motion.div layoutId="settingDot" className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                          )}
                       </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-8 apple-card p-12 min-h-[600px]">
                   <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-12"
                      >
                         <div className="flex items-center justify-between border-b border-white/5 pb-8">
                            <div>
                               <h3 className="text-3xl font-semibold text-white tracking-tight">{activeSection}</h3>
                               <p className="text-sm text-[#86868b] mt-1 font-medium">Gestiona los parámetros de {activeSection.toLowerCase()} del sistema</p>
                            </div>
                            <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs shadow-xl active:scale-95 transition-all">
                               Guardar Cambios
                            </Button>
                         </div>

                         {activeSection === 'Institución' && (
                            <div className="space-y-10">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                     <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-2">Denominación</label>
                                     <input defaultValue="U.E. Andrés Bello" className="w-full h-14 bg-white/5 border border-white/5 rounded-xl px-6 text-white font-semibold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all" />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-2">Código SICE</label>
                                     <input defaultValue="AB-2026-X99" className="w-full h-14 bg-white/5 border border-white/5 rounded-xl px-6 text-white font-semibold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all" />
                                  </div>
                               </div>

                               <div className="space-y-6">
                                  <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Nodos de Red Activos</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     {[
                                        { label: 'Cloud SQL', status: 'Sincronizado', icon: Cloud, color: 'text-blue-400' },
                                        { label: 'Seguridad', status: 'SSL AES-256', icon: Lock, color: 'text-emerald-400' },
                                        { label: 'IA Engine', status: 'Groq v15.0', icon: Cpu, color: 'text-purple-400' },
                                     ].map((n, i) => (
                                        <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4 hover:bg-white/[0.05] transition-all">
                                           <n.icon className={`w-7 h-7 ${n.color}`} />
                                           <div className="flex flex-col">
                                              <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{n.label}</span>
                                              <span className="text-sm font-black text-white mt-1">{n.status}</span>
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="p-8 rounded-[2rem] bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 group hover:from-blue-600/20 transition-all">
                                  <div className="flex items-center gap-6">
                                     <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                                        <Cloud className="w-8 h-8" />
                                     </div>
                                     <div className="flex flex-col">
                                        <h4 className="text-lg font-bold text-white tracking-tight">Copia de Seguridad Proactiva</h4>
                                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Sincronizado hace 12m</p>
                                     </div>
                                  </div>
                                  <Button className="bg-white text-black hover:bg-zinc-100 rounded-full px-10 text-[11px] font-black tracking-widest h-12 shadow-2xl">
                                     RESPALDAR NODO
                                  </Button>
                               </div>
                            </div>
                         )}

                         {activeSection === 'Seguridad' && (
                            <div className="space-y-12">
                               <div className="space-y-6">
                                  <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Autenticación Avanzada</h4>
                                  <div className="space-y-4">
                                     {[
                                        { title: 'Doble Factor (2FA)', desc: 'Requiere código SMS para el Master Root', enabled: true, icon: Smartphone },
                                        { title: 'Bio-Autenticación', desc: 'Permite acceso mediante sensores externos', enabled: true, icon: Fingerprint },
                                     ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                           <div className="flex gap-6 items-center">
                                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                                                 <s.icon className="w-6 h-6" />
                                              </div>
                                              <div>
                                                 <h5 className="text-sm font-bold text-white">{s.title}</h5>
                                                 <p className="text-xs text-[#86868b]">{s.desc}</p>
                                              </div>
                                           </div>
                                           <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${s.enabled ? 'bg-blue-600' : 'bg-white/10'}`}>
                                              <div className={`w-4 h-4 bg-white rounded-full transition-all ${s.enabled ? 'translate-x-6' : ''}`} />
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="p-8 rounded-[2rem] bg-red-600/5 border border-red-500/10 space-y-4">
                                  <div className="flex items-center gap-3 text-red-400">
                                     <AlertTriangle className="w-5 h-5" />
                                     <h5 className="text-sm font-bold uppercase tracking-widest">Zona de Riesgo Master</h5>
                                  </div>
                                  <p className="text-xs text-[#86868b] leading-relaxed">Si detectas una anomalía en el nodo principal, puedes revocar todos los tokens activos e iniciar un protocolo de bloqueo total.</p>
                                  <Button variant="ghost" className="text-red-400 hover:bg-red-400/10 px-8 rounded-full text-[11px] font-black tracking-widest mt-4">
                                     REVOCAR ACCESOS
                                  </Button>
                               </div>
                            </div>
                         )}

                         {activeSection === 'Plan de Pago' && (
                            <div className="space-y-12">
                               <div className="apple-card bg-gradient-to-br from-zinc-900 to-black border-white/10 p-10 relative overflow-hidden">
                                  <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-blue-600/10 blur-[80px] rounded-full rotate-12" />
                                  <div className="relative z-10 space-y-8">
                                     <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                           <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Enterprise</Badge>
                                           <h4 className="text-4xl font-black text-white">$499 <span className="text-lg text-[#86868b]">/mes</span></h4>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                           <Globe className="w-8 h-8 text-white/20" />
                                        </div>
                                     </div>
                                     <div className="space-y-3">
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                           <div className="h-full w-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                                        </div>
                                        <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest flex justify-between">
                                           Suscripción Activa <span>Siguiente cobro: May 04</span>
                                        </p>
                                     </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                   {[
                                      { label: 'Método de Pago', value: 'Visa ending 4202', icon: CreditCard },
                                      { label: 'Facturación', value: 'Electrónica (SICE)', icon: FileText },
                                   ].map((m, i) => (
                                      <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col gap-4">
                                         <m.icon className="w-6 h-6 text-blue-400" />
                                         <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{m.label}</span>
                                            <span className="text-sm font-bold text-white mt-1">{m.value}</span>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                            </div>
                         )}

                         {activeSection === 'Historial' && (
                            <div className="space-y-8">
                               {[
                                  { event: 'Bio-Auth Validado', user: 'Admin Root', time: 'hace 5 min', color: 'bg-emerald-500' },
                                  { event: 'Sincronización Neon', user: 'System IA', time: 'hace 15 min', color: 'bg-blue-500' },
                                  { event: 'Intento Fallido Login', user: 'IP 192.168.0.1', time: 'hace 1 hora', color: 'bg-red-500' },
                                  { event: 'Reporte PDF Generado', user: 'Admin Root', time: 'ayer 14:30', color: 'bg-indigo-500' },
                                  { event: 'Nuevos Estudiantes', user: 'Sección 3B', time: 'ayer 10:15', color: 'bg-blue-500' },
                               ].map((log, i) => (
                                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border-l-4 border-l-transparent hover:border-l-blue-600 hover:bg-white/5 transition-all group">
                                     <div className="flex items-center gap-6">
                                        <div className={`w-2 h-2 rounded-full ${log.color} shadow-lg`} />
                                        <div className="flex flex-col">
                                           <span className="text-sm font-bold text-white leading-none">{log.event}</span>
                                           <span className="text-xs text-[#86868b] mt-1.5">{log.user}</span>
                                        </div>
                                     </div>
                                     <div className="text-[10px] font-black text-[#86868b] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {log.time}
                                     </div>
                                  </div>
                               ))}
                               <Button variant="ghost" className="w-full text-blue-400 hover:bg-blue-400/5 rounded-2xl h-14 font-black tracking-widest uppercase text-xs">
                                  DESCARGAR LOG COMPLETO (PDF)
                               </Button>
                            </div>
                         )}

                         {activeSection === 'Notificaciones' && (
                            <div className="space-y-10 py-10 flex flex-col items-center justify-center opacity-40">
                               <Bell className="w-16 h-16 text-blue-400/20" />
                               <h4 className="text-xl font-bold text-white tracking-tight leading-none mb-2">Protocolo de Notificaciones Activo</h4>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Sincronizado con Nodo Maestro Groq</p>
                            </div>
                         )}
                      </motion.div>
                   </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalSettings;
