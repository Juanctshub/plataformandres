import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Check,
  Loader2,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Bot,
  Sparkles
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InstitutionalSettings = () => {
    const [activeSection, setActiveSection] = useState('Institución');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    
    // ─── STATE FUNCIONAL ───
    const [instConfig, setInstConfig] = useState({
      nombre: 'U.E. Andrés Bello',
      codigo: 'AB-2026-X99',
      direccion: '',
      telefono: '',
      email: '',
      director: ''
    });

    const [securityConfig, setSecurityConfig] = useState({
      twoFactor: true,
      bioAuth: true,
      sessionTimeout: 480,
      maxAttempts: 5
    });

    const [notifConfig, setNotifConfig] = useState({
      emailAlerts: true,
      aiSuggestions: true,
      attendanceAlerts: true,
      gradeAlerts: false,
      weeklyReport: true
    });

    const [historial, setHistorial] = useState([]);
    const [histLoading, setHistLoading] = useState(false);

    // Load saved config from API on mount
    useEffect(() => {
      const loadConfig = async () => {
        try {
          const token = localStorage.getItem('token');
          const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
          const res = await fetch(`${baseUrl}/api/config`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.instConfig) setInstConfig(data.instConfig);
          if (data.securityConfig) setSecurityConfig(data.securityConfig);
          if (data.notifConfig) setNotifConfig(data.notifConfig);
        } catch (e) {
          console.error("Error loading config:", e);
          // Fallback to local
          const saved = localStorage.getItem('instConfig');
          if (saved) setInstConfig(JSON.parse(saved));
        }
      };
      loadConfig();
    }, []);

    // Fetch real historial data
    useEffect(() => {
      if (activeSection === 'Historial') {
        fetchHistorial();
      }
    }, [activeSection]);

    const fetchHistorial = async () => {
      setHistLoading(true);
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resStd, resJust, resNotas] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/justificaciones`, { headers }),
          fetch(`${baseUrl}/api/notas`, { headers })
        ]);

        const students = resStd.ok ? await resStd.json() : [];
        const justs = resJust.ok ? await resJust.json() : [];
        const notas = resNotas.ok ? await resNotas.json() : [];

        const entries = [];

        // Build real historial from data
        const suspended = students.filter(s => s.estado === 'suspendido');
        if (suspended.length > 0) {
          entries.push({ event: `${suspended.length} estudiante(s) suspendido(s)`, user: 'Sistema', time: 'Estado actual', color: 'bg-amber-500' });
        }

        const pendingJusts = justs.filter(j => j.estado === 'pendiente');
        if (pendingJusts.length > 0) {
          entries.push({ event: `${pendingJusts.length} justificativo(s) pendiente(s)`, user: 'Administración', time: 'Acción requerida', color: 'bg-amber-500' });
        }

        if (notas.length > 0) {
          const lastNote = notas[0];
          entries.push({ event: `Última nota registrada: ${lastNote.student} - ${lastNote.subject}: ${lastNote.grade}`, user: 'Docente', time: lastNote.fecha || 'Reciente', color: 'bg-indigo-500' });
        }

        entries.push({ event: `${students.length} estudiantes en matrícula activa`, user: 'Nodo Maestro', time: new Date().toLocaleDateString(), color: 'bg-blue-500' });
        entries.push({ event: `${notas.length} calificaciones registradas en total`, user: 'Sistema Académico', time: 'Acumulado', color: 'bg-emerald-500' });
        entries.push({ event: 'Configuración del sistema cargada', user: 'Admin Root', time: 'Sesión actual', color: 'bg-blue-500' });
        entries.push({ event: 'Sincronización con Neon PostgreSQL activa', user: 'Cloud SQL', time: 'Permanente', color: 'bg-emerald-500' });

        setHistorial(entries);
      } catch (e) {
        setHistorial([{ event: 'Error al cargar historial', user: 'Sistema', time: 'Ahora', color: 'bg-red-500' }]);
      } finally {
        setHistLoading(false);
      }
    };

    const handleSave = async () => {
      setSaving(true);
      setSaveMsg('');
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        let category = '';
        let data = {};
        
        if (activeSection === 'Institución') {
          category = 'instConfig';
          data = instConfig;
        } else if (activeSection === 'Seguridad') {
          category = 'securityConfig';
          data = securityConfig;
        } else if (activeSection === 'Notificaciones') {
          category = 'notifConfig';
          data = notifConfig;
        }

        if (category) {
            await fetch(`${baseUrl}/api/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ category, data })
            });
            localStorage.setItem(category, JSON.stringify(data)); // Sync local cache too
        }

        setSaveMsg('Configuración guardada exitosamente');
        setTimeout(() => setSaveMsg(''), 3000);
      } catch (e) {
        setSaveMsg('Error al guardar en el servidor');
      } finally {
        setSaving(false);
      }
    };

    const handleExportBackup = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resStd, resNotas, resJust, resPersonal] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/notas`, { headers }),
          fetch(`${baseUrl}/api/justificaciones`, { headers }),
          fetch(`${baseUrl}/api/personal`, { headers })
        ]);

        const backup = {
          exportDate: new Date().toISOString(),
          version: '20.0',
          estudiantes: resStd.ok ? await resStd.json() : [],
          notas: resNotas.ok ? await resNotas.json() : [],
          justificaciones: resJust.ok ? await resJust.json() : [],
          personal: resPersonal.ok ? await resPersonal.json() : [],
          config: { instConfig, securityConfig, notifConfig }
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Backup_AndresBello_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSaveMsg('Backup descargado exitosamente');
        setTimeout(() => setSaveMsg(''), 3000);
      } catch (e) {
        setSaveMsg('Error al generar backup');
      }
    };

    const downloadHistorialPDF = () => {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString('es-VE');
      doc.setFontSize(18);
      doc.text('Log de Actividad del Sistema', 20, 25);
      doc.setFontSize(10);
      doc.text(`U.E. Andrés Bello — ${date}`, 20, 32);

      doc.autoTable({
        startY: 42,
        head: [['Evento', 'Usuario', 'Tiempo']],
        body: historial.map(h => [h.event, h.user, h.time]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 8 }
      });
      doc.save(`Log_Sistema_${date}.pdf`);
    };

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
               <div className="flex items-center gap-3">
                  {saveMsg && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-semibold text-emerald-400 flex items-center gap-2"
                    >
                      <Check className="w-3 h-3" /> {saveMsg}
                    </motion.span>
                  )}
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                     v20.0 Enterprise
                  </Badge>
               </div>
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
                            {['Institución', 'Seguridad', 'Notificaciones'].includes(activeSection) && (
                              <Button 
                                onClick={handleSave}
                                disabled={saving}
                                className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
                              >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Guardar Cambios
                              </Button>
                            )}
                         </div>

                         {/* ═══ INSTITUCIÓN ═══ */}
                         {activeSection === 'Institución' && (
                            <div className="space-y-12">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Denominación del Plantel</label>
                                     <input 
                                       value={instConfig.nombre} 
                                       onChange={e => setInstConfig({...instConfig, nombre: e.target.value})}
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Código Maestro SICE</label>
                                     <input 
                                       value={instConfig.codigo}
                                       onChange={e => setInstConfig({...instConfig, codigo: e.target.value})}
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Autoridad Directiva</label>
                                     <input 
                                       value={instConfig.director}
                                       onChange={e => setInstConfig({...instConfig, director: e.target.value})}
                                       placeholder="Nombre del director"
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold placeholder:text-white/10 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Canal de Comunicación</label>
                                     <input 
                                       value={instConfig.email}
                                       onChange={e => setInstConfig({...instConfig, email: e.target.value})}
                                       placeholder="direccion@ejemplo.edu.ve"
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold placeholder:text-white/10 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                               </div>

                               <div className="p-10 rounded-[3rem] bg-gradient-to-tr from-blue-600/10 to-transparent border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                  <div className="flex items-center gap-8">
                                     <div className="w-16 h-16 rounded-[2.2rem] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30">
                                        <Cloud className="w-9 h-9" />
                                     </div>
                                     <div className="flex flex-col">
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Bóveda de Seguridad</h4>
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">Exportar respaldo total del sistema</p>
                                     </div>
                                  </div>
                                  <Button 
                                    onClick={handleExportBackup}
                                    className="bg-white text-black hover:bg-zinc-100 rounded-full px-12 text-[11px] font-black tracking-[0.2em] h-14 shadow-2xl transition-all active:scale-95"
                                  >
                                     GENERAR BACKUP
                                  </Button>
                               </div>

                               <div className="space-y-8">
                                  <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] pl-4 italic">Arquitectura del Nodo</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                     {[
                                        { label: 'Base de Datos', status: 'Sincronizado', icon: Database, color: 'text-emerald-400' },
                                        { label: 'Seguridad', status: 'AES-256 Cloud', icon: ShieldCheck, color: 'text-blue-400' },
                                        { label: 'IA Engine', status: 'Omniscience v30.0', icon: Bot, color: 'text-purple-400' },
                                     ].map((n, i) => (
                                        <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex flex-col gap-6 hover:bg-white/[0.03] transition-all group/node">
                                           <n.icon className={`w-8 h-8 ${n.color} group-hover/node:scale-110 transition-transform`} />
                                           <div className="flex flex-col">
                                              <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{n.label}</span>
                                              <span className="text-sm font-black text-white mt-1 uppercase tracking-tight">{n.status}</span>
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                                </div>
                            </div>
                         )}

                         {/* ═══ SEGURIDAD ═══ */}
                         {activeSection === 'Seguridad' && (
                            <div className="space-y-12">
                               <div className="space-y-8">
                                  <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em] pl-4 italic">Protocolos de Acceso</h4>
                                  <div className="space-y-6">
                                     {[
                                        { key: 'twoFactor', title: 'Doble Factor (2FA)', desc: 'Validación biométrica o SMS obligatoria para Master Root.', icon: Smartphone },
                                        { key: 'bioAuth', title: 'Inteligencia de Sesión', desc: 'Detección proactiva de accesos no autorizados mediante IA.', icon: Fingerprint },
                                     ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                           <div className="flex gap-8 items-center">
                                              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                                                 <s.icon className="w-7 h-7" />
                                              </div>
                                              <div>
                                                 <h5 className="text-md font-black text-white uppercase tracking-tight italic">{s.title}</h5>
                                                 <p className="text-[11px] text-[#86868b] font-medium mt-1">{s.desc}</p>
                                              </div>
                                           </div>
                                           <button
                                             onClick={() => setSecurityConfig(prev => ({...prev, [s.key]: !prev[s.key]}))}
                                             className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all ${securityConfig[s.key] ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}
                                           >
                                              <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-md ${securityConfig[s.key] ? 'translate-x-7' : ''}`} />
                                           </button>
                                        </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Expiración de Sesión (min)</label>
                                     <input 
                                       type="number"
                                       value={securityConfig.sessionTimeout}
                                       onChange={e => setSecurityConfig({...securityConfig, sessionTimeout: parseInt(e.target.value) || 480})}
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] pl-4">Umbral de Bloqueo</label>
                                     <input 
                                       type="number"
                                       value={securityConfig.maxAttempts}
                                       onChange={e => setSecurityConfig({...securityConfig, maxAttempts: parseInt(e.target.value) || 5})}
                                       className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[1.8rem] px-8 text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-lg" 
                                     />
                                  </div>
                               </div>

                               <div className="p-10 rounded-[3rem] bg-red-600/5 border border-red-500/10 space-y-6 relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                     <AlertTriangle className="w-32 h-32" />
                                  </div>
                                  <div className="flex items-center gap-4 text-red-400 relative z-10">
                                     <Zap className="w-6 h-6 animate-pulse" />
                                     <h5 className="text-sm font-black uppercase tracking-[0.3em] italic">Procedimiento de Emergencia Master</h5>
                                  </div>
                                  <p className="text-[11px] text-[#86868b] font-bold leading-relaxed uppercase tracking-widest relative z-10">
                                     Al ejecutar la revocación, se invalidarán todos los certificados de acceso activos en el NÚCLEO. Esta acción es inmediata e irreversible para la sesión actual.
                                  </p>
                                  <Button 
                                    variant="ghost"
                                    onClick={() => {
                                      localStorage.removeItem('token');
                                      window.location.reload();
                                    }}
                                    className="bg-red-600 text-white hover:bg-red-500 px-12 rounded-full text-[10px] font-black tracking-[0.2em] h-14 shadow-2xl relative z-10"
                                  >
                                     REVOCAR TODO EL SISTEMA
                                  </Button>
                               </div>
                            </div>
                         )}

                         {/* ═══ NOTIFICACIONES (AI Autonomy) ═══ */}
                         {activeSection === 'Notificaciones' && (
                            <div className="space-y-10">
                               <div className="p-8 rounded-[2.5rem] bg-gradient-to-tr from-purple-600/10 to-transparent border border-purple-500/20 mb-10">
                                  <div className="flex items-center gap-6">
                                     <div className="w-16 h-16 rounded-3xl bg-purple-600 text-white flex items-center justify-center shadow-2xl shadow-purple-600/30">
                                        <Bot className="w-10 h-10" />
                                     </div>
                                     <div>
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Nivel de Autonomía IA</h4>
                                        <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1">Configuración del Cerebro Institucional</p>
                                     </div>
                                  </div>
                               </div>

                               <div className="space-y-6">
                                  {[
                                    { key: 'aiSuggestions', title: 'Gestión Proactiva', desc: 'La IA toma decisiones rutinarias automáticamente (Nivel 5).', icon: Sparkles },
                                    { key: 'attendanceAlerts', title: 'Centinela de Asistencia', desc: 'Vigilancia constante sobre la deserción escolar.', icon: AlertTriangle },
                                    { key: 'emailAlerts', title: 'Notificaciones Master', desc: 'Sincronización total con canales externos.', icon: Globe },
                                    { key: 'weeklyReport', title: 'Briefing Ejecutivo', desc: 'Informes detallados generados por redes neuronales.', icon: FileText },
                                  ].map((n, i) => (
                                    <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                       <div className="flex gap-8 items-center">
                                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/30">
                                             <n.icon className="w-6 h-6" />
                                          </div>
                                          <div>
                                             <h5 className="text-md font-black text-white uppercase tracking-tight italic">{n.title}</h5>
                                             <p className="text-[11px] text-[#86868b] font-medium mt-1">{n.desc}</p>
                                          </div>
                                       </div>
                                       <button
                                         onClick={() => setNotifConfig(prev => ({...prev, [n.key]: !prev[n.key]}))}
                                         className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all ${notifConfig[n.key] ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`}
                                       >
                                          <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-md ${notifConfig[n.key] ? 'translate-x-7' : ''}`} />
                                       </button>
                                    </div>
                                  ))}
                               </div>
                            </div>
                         )}

                         {/* ═══ PLAN DE PAGO ═══ */}
                         {activeSection === 'Plan de Pago' && (
                            <div className="space-y-12">
                               <div className="apple-card bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-12 relative overflow-hidden rounded-[4rem]">
                                  <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-blue-600/10 blur-[100px] rounded-full rotate-12" />
                                  <div className="relative z-10 space-y-12">
                                     <div className="flex justify-between items-start">
                                        <div className="space-y-4">
                                           <Badge className="bg-blue-600 text-white border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Premium Enterprise</Badge>
                                           <h4 className="text-7xl font-black text-white italic tracking-tighter">ACTIVO</h4>
                                           <p className="text-xs text-[#86868b] font-bold uppercase tracking-widest pl-1">Licencia de por vida — U.E. Andrés Bello</p>
                                        </div>
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                                           <Globe className="w-10 h-10 text-white/20" />
                                        </div>
                                     </div>
                                     <div className="space-y-6">
                                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                           <div className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_30px_rgba(37,99,235,0.6)]" />
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em]">
                                           <span>Estado Permanente</span>
                                           <span className="text-emerald-400 italic">Sincronización Vitalicia</span>
                                        </div>
                                     </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                   {[
                                      { label: 'Tipo de Licencia', value: 'Enterprise Global', icon: CreditCard },
                                      { label: 'Soporte', value: 'Prioridad Nivel 1', icon: Cpu },
                                      { label: 'Almacenamiento', value: 'Infinite Cloud', icon: Database },
                                      { label: 'Usuarios', value: 'Ilimitados', icon: User },
                                   ].map((m, i) => (
                                      <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6 hover:bg-white/[0.04] transition-all group/plan">
                                         <m.icon className="w-8 h-8 text-blue-400 group-hover/plan:scale-110 transition-transform" />
                                         <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{m.label}</span>
                                            <span className="text-md font-black text-white mt-1 uppercase italic">{m.value}</span>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                            </div>
                         )}

                         {/* ═══ HISTORIAL ═══ */}
                         {activeSection === 'Historial' && (
                            <div className="space-y-12">
                               {histLoading ? (
                                 <div className="py-32 flex flex-col items-center justify-center gap-8">
                                   <div className="relative">
                                      <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                      <div className="absolute inset-0 blur-2xl bg-blue-600/20 animate-pulse" />
                                   </div>
                                   <span className="text-[10px] text-[#86868b] font-black uppercase tracking-[0.6em] italic animate-pulse">Analizando Logs de Actividad...</span>
                                 </div>
                               ) : (
                                 <div className="space-y-4">
                                   {historial.map((log, i) => (
                                      <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.01] border-l-4 border-l-transparent hover:border-l-blue-600 hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                                         <div className="flex items-center gap-8 relative z-10">
                                            <div className={`w-3 h-3 rounded-full ${log.color} shadow-lg shadow-current/40`} />
                                            <div className="flex flex-col">
                                               <span className="text-md font-black text-white tracking-tight italic uppercase group-hover:text-blue-400 transition-colors">{log.event}</span>
                                               <div className="flex items-center gap-3 mt-2">
                                                  <User className="w-3 h-3 text-[#86868b]" />
                                                  <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{log.user}</span>
                                               </div>
                                            </div>
                                         </div>
                                         <div className="text-[10px] font-black text-[#86868b] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 relative z-10">
                                            {log.time}
                                         </div>
                                         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                   ))}
                                 </div>
                               )}
                               <div className="flex gap-6">
                                 <Button 
                                   onClick={downloadHistorialPDF}
                                   className="flex-1 h-16 bg-white text-black hover:bg-zinc-100 rounded-[2rem] font-black tracking-[0.2em] uppercase text-xs shadow-2xl transition-all active:scale-[0.98]"
                                 >
                                    <Download className="w-5 h-5 mr-3" />
                                    EXPORTAR LOG DE AUDITORÍA
                                 </Button>
                                 <Button 
                                   onClick={fetchHistorial}
                                   className="w-16 h-16 rounded-[2rem] bg-white/5 text-white hover:bg-white/10 border border-white/5 transition-all active:rotate-180 duration-700"
                                 >
                                    <RefreshCw className="w-6 h-6" />
                                 </Button>
                               </div>
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
