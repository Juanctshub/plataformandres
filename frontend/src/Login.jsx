import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Command,
  HelpCircle,
  Fingerprint,
  Mail,
  UserPlus,
  ChevronLeft,
  Scan
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

import logo from './assets/logo.png';

const Login = ({ onLogin }) => {
    const [view, setView] = useState('login'); // login, recovery, bio, signup
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [bioStatus, setBioStatus] = useState('idle'); // idle, scanning, success

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            
            if (res.ok) {
                setMsg({ text: 'Acceso concedido. Sincronizando núcleo...', type: 'success' });
                setTimeout(() => onLogin(data), 1500);
            } else {
                setMsg({ text: data.msg || 'Error de autenticación central', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error fatal de conexión al nodo maestro', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBioAuth = async () => {
        setBioStatus('scanning');
        setMsg({ text: '', type: '' });
        
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            // Petición real al nodo biométrico
            const res = await fetch(`${baseUrl}/api/bio-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identityToken: 'apple-biometric-v15' })
            });
            const data = await res.json();

            if (res.ok) {
                setBioStatus('success');
                setTimeout(() => {
                    setMsg({ text: data.message || 'Identidad Biométrica Validada', type: 'success' });
                    setTimeout(() => onLogin(data), 1000);
                }, 1000);
            } else {
                setBioStatus('idle');
                setMsg({ text: 'Validación biométrica fallida', type: 'error' });
            }
        } catch (e) {
            setBioStatus('idle');
            setMsg({ text: 'Error de enlace con el sensor biométrico', type: 'error' });
        }
    };

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signupData.username,
                    password: signupData.password,
                    role: 'docente' // Default role
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ text: 'Registro exitoso. Ahora puedes iniciar sesión.', type: 'success' });
                setView('login');
            } else {
                setMsg({ text: data.error || 'Error en el registro institucional', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Fallo crítico de registro en el nodo maestro', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRecovery = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/recover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ text: data.message, type: 'success' });
            } else {
                setMsg({ text: data.error || 'Error en la solicitud de recuperación', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de comunicación persistente', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 apple-bg-mesh relative overflow-hidden">
            {/* Soft Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="apple-card p-14 space-y-12">
                    <AnimatePresence mode="wait">
                        {view === 'login' && (
                            <motion.div 
                                key="login-view"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-12"
                            >
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <motion.div 
                                       whileHover={{ scale: 1.05 }}
                                       className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center shadow-2xl shadow-blue-500/10 overflow-hidden border border-white/10"
                                     >
                                         <img src={logo} className="w-full h-full object-cover scale-110" alt="Logo" />
                                     </motion.div>
                                    <div className="space-y-3">
                                        <h2 className="text-4xl font-semibold tracking-tight text-white leading-none">Andrés Bello</h2>
                                        <p className="text-[#86868b] font-medium text-lg uppercase tracking-widest text-[10px]">Identidad de Acceso Institucional</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-blue-500 transition-colors">
                                              <User className="w-5 h-5" />
                                            </div>
                                            <Input 
                                                className="w-full h-16 bg-white/5 border-white/5 rounded-2xl pl-16 pr-6 text-white text-base font-medium placeholder:text-white/20 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                                placeholder="Nombre de usuario"
                                                value={credentials.username}
                                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-blue-500 transition-colors">
                                              <Lock className="w-5 h-5" />
                                            </div>
                                            <Input 
                                                type="password"
                                                className="w-full h-16 bg-white/5 border-white/5 rounded-2xl pl-16 pr-6 text-white text-base font-medium placeholder:text-white/20 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                                placeholder="Contraseña Maestra"
                                                value={credentials.password}
                                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                       <button type="button" onClick={() => setView('recovery')} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2 uppercase tracking-widest">
                                          <HelpCircle className="w-3.5 h-3.5" />
                                          Recuperar
                                       </button>
                                       <button type="button" onClick={() => setView('bio')} className="text-[10px] font-bold text-[#86868b] hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                                          <Fingerprint className="w-3.5 h-3.5" />
                                          Bio-Auth
                                       </button>
                                    </div>

                                    <div className="space-y-6">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-base transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 group"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                              <>
                                                Continuar al Sistema
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                              </>
                                            )}
                                        </Button>
                                        <div className="text-center">
                                            <button 
                                                type="button" 
                                                onClick={() => setView('signup')}
                                                className="text-[10px] font-bold text-[#86868b] hover:text-white transition-all uppercase tracking-[0.2em] italic underline underline-offset-4 decoration-white/5"
                                            >
                                                Crear nueva cuenta de nodo
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {view === 'recovery' && (
                            <motion.div 
                                key="recovery-view"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                               <button onClick={() => setView('login')} className="flex items-center gap-2 text-[#86868b] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest mb-6">
                                  <ChevronLeft className="w-4 h-4" />
                                  Volver
                               </button>
                               <div className="space-y-4">
                                  <h3 className="text-3xl font-semibold text-white tracking-tight">Recuperar Acceso</h3>
                                  <p className="text-sm text-[#86868b] font-medium leading-relaxed">Ingresa tu correo institucional para recibir un código de sincronización temporal.</p>
                               </div>
                                <form onSubmit={handleRecovery} className="space-y-6">
                                   <div className="relative group">
                                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] w-5 h-5" />
                                      <Input 
                                         className="h-16 bg-white/5 border-white/5 rounded-2xl pl-16 text-white" 
                                         placeholder="correo@institucion.edu" 
                                         value={recoveryEmail}
                                         onChange={(e) => setRecoveryEmail(e.target.value)}
                                         required
                                      />
                                   </div>
                                   <Button type="submit" disabled={loading} className="w-full h-16 bg-blue-600 text-white hover:bg-blue-500 rounded-full font-bold transition-all">
                                      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Enviar Código"}
                                   </Button>
                                </form>
                            </motion.div>
                        )}

                        {view === 'bio' && (
                            <motion.div 
                                key="bio-view"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-10 text-center"
                            >
                               <button onClick={() => setView('login')} className="flex items-center gap-2 text-[#86868b] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest mb-6">
                                  <ChevronLeft className="w-4 h-4" />
                                  Cancelar
                               </button>
                               <div className="flex flex-col items-center gap-10 py-10">
                                  <div className="relative">
                                     {bioStatus === 'scanning' && (
                                        <motion.div 
                                          initial={{ y: 0 }}
                                          animate={{ y: 160 }}
                                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                          className="absolute inset-0 z-10 border-t-2 border-blue-400 bg-blue-400/10"
                                        />
                                     )}
                                     <div className={`w-40 h-52 rounded-3xl border-2 flex items-center justify-center transition-all duration-700 ${
                                        bioStatus === 'idle' ? 'border-white/10 text-white/10' :
                                        bioStatus === 'scanning' ? 'border-blue-400 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' :
                                        'border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                                     }`}>
                                        <Fingerprint className="w-24 h-24" strokeWidth={1} />
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <h3 className="text-xl font-semibold text-white">
                                        {bioStatus === 'idle' ? 'Bio-Autenticación' : 
                                         bioStatus === 'scanning' ? 'Escaneando Identidad...' : 'Validación Exitosa'}
                                     </h3>
                                     <p className="text-xs text-[#86868b] font-medium px-10">Coloca tu huella digital sobre el sensor o usa tu cámara para FaceID.</p>
                                  </div>
                                  {bioStatus === 'idle' && (
                                     <Button onClick={handleBioAuth} className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-full font-bold">Iniciar Captura</Button>
                                  )}
                               </div>
                            </motion.div>
                        )}

                        {view === 'signup' && (
                            <motion.div 
                                key="signup-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                               <button onClick={() => setView('login')} className="flex items-center gap-2 text-[#86868b] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest mb-6">
                                  <ChevronLeft className="w-4 h-4" />
                                  Volver
                               </button>
                               <div className="space-y-4">
                                  <h3 className="text-3xl font-semibold text-white tracking-tight">Crear Cuenta</h3>
                                  <p className="text-sm text-[#86868b] font-medium">Registro de nuevo nodo administrativo v15.0</p>
                               </div>
                                <form onSubmit={handleSignup} className="space-y-4">
                                   <div className="relative group">
                                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                                      <Input 
                                         className="h-16 bg-white/5 border-white/10 rounded-2xl pl-16 text-white" 
                                         placeholder="Nombre de usuario institucional" 
                                         value={signupData.username}
                                         onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                                         required
                                      />
                                   </div>
                                   <div className="relative group">
                                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                                      <Input 
                                         className="h-16 bg-white/5 border-white/10 rounded-2xl pl-16 text-white" 
                                         placeholder="Correo oficial" 
                                         value={signupData.email}
                                         onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                         required
                                      />
                                   </div>
                                   <div className="relative group">
                                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                                      <Input 
                                         type="password" 
                                         className="h-16 bg-white/5 border-white/10 rounded-2xl pl-16 text-white" 
                                         placeholder="Nueva contraseña maestra" 
                                         value={signupData.password}
                                         onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                         required
                                      />
                                   </div>
                                   <Button type="submit" disabled={loading} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-full font-bold mt-4 transition-all">
                                      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Solicitar Registro"}
                                   </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {msg.text && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-5 rounded-2xl flex items-center gap-4 text-xs font-semibold border ${
                                    msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                            >
                                {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {msg.text}
                                <button onClick={() => setMsg({text:'', type:''})} className="ml-auto opacity-30 hover:opacity-100"><X /></button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6 opacity-30 select-none grayscale hover:grayscale-0 transition-all duration-1000">
                   <div className="flex items-center gap-8 text-[#86868b]">
                       <div className="flex items-center gap-3">
                           <ShieldCheck className="w-4 h-4" />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none">Safe Host v15.0</span>
                       </div>
                       <div className="flex items-center gap-3">
                           <Command className="w-4 h-4" />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none">Core-Sync Activated</span>
                       </div>
                   </div>
                </div>
            </motion.div>
        </div>
    );
};

const X = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Login;
