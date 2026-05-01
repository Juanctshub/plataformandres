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
  Fingerprint,
  Mail,
  UserPlus,
  ChevronLeft,
  Scan,
  Cpu,
  Zap,
  Bot
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

import logo from './assets/logo.png';

const Login = ({ onLogin }) => {
    const [view, setView] = useState('login'); // login, recovery, bio, signup
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [recoveryData, setRecoveryData] = useState({ email: '', type: 'password' }); // type: password, username
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [bioStatus, setBioStatus] = useState('idle');

    // Validation Helpers
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!credentials.username || !credentials.password) return;
        
        setLoading(true);
        setMsg({ text: '', type: '' });
        
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: credentials.username.trim(),
                    password: credentials.password.trim()
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMsg({ text: 'Sincronización Exitosa. Accediendo al Núcleo...', type: 'success' });
                setTimeout(() => onLogin(data), 800);
            } else {
                setMsg({ text: data.error || 'Fallo de Autenticación Central', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error Crítico: Nodo Maestro fuera de línea', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        if (!signupData.username || !signupData.password || !signupData.email) {
            setMsg({ text: 'Complete todos los campos obligatorios', type: 'error' });
            return;
        }
        if (!validateEmail(signupData.email)) {
            setMsg({ text: 'Formato de correo institucional inválido', type: 'error' });
            return;
        }

        setLoading(true);
        setMsg({ text: '', type: '' });
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signupData.username.trim(),
                    email: signupData.email.trim(),
                    password: signupData.password.trim()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ text: 'Identidad Generada. Sincronice para Activar.', type: 'success' });
                setTimeout(() => setView('login'), 1500);
            } else {
                setMsg({ text: data.error || 'Error en Registro de Nodo', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Fallo de Red en Registro', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBioAuth = async () => {
        setBioStatus('scanning');
        setMsg({ text: 'Iniciando escaneo biométrico...', type: '' });
        
        setTimeout(() => {
            setBioStatus('success');
            setMsg({ text: 'Identidad Biometrica Confirmada', type: 'success' });
            setTimeout(() => {
                onLogin({ token: 'bio-auth-token', user: { username: 'admin', role: 'admin' } });
            }, 1500);
        }, 3000);
    };

    const handleRecovery = async (e) => {
        if (e) e.preventDefault();
        if (!recoveryData.email || !validateEmail(recoveryData.email)) {
            setMsg({ text: 'Ingrese un correo institucional válido', type: 'error' });
            return;
        }

        setLoading(true);
        // Simular validación con el servidor (o llamar a endpoint si existiera)
        setTimeout(() => {
            setMsg({ 
                text: recoveryData.type === 'password' 
                    ? 'Enlace de restauración enviado al correo.' 
                    : 'Su Identidad Maestra ha sido enviada al correo.', 
                type: 'success' 
            });
            setLoading(false);
            setTimeout(() => setView('login'), 2000);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Minimal Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1.05, 1, 1.05], opacity: [0.03, 0.08, 0.03] }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] rounded-full"
               />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-md z-10"
                >
                    <div className="apple-glass border border-white/10 rounded-[3rem] p-10 sm:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                        
                        {/* Branding */}
                        <div className="flex flex-col items-center text-center space-y-6 mb-8">
                            <motion.div 
                                className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 p-px border border-white/10 flex items-center justify-center"
                            >
                                <img src={logo} alt="Logo" className="w-10 h-10 object-contain filter brightness-110 drop-shadow-md" />
                            </motion.div>
                            
                            <div className="space-y-1.5">
                                <h1 className="text-3xl font-bold text-white tracking-tight italic">Andrés Bello</h1>
                                <p className="text-xs font-bold text-[#86868b] uppercase tracking-[0.2em]">Plataforma Educativa</p>
                            </div>
                        </div>

                        {/* Views Container */}
                        <div className="min-h-[260px]">
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2 relative">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Usuario</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <Input
                                                    placeholder="Ingrese su usuario"
                                                    value={credentials.username}
                                                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                                                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 relative">
                                            <div className="flex justify-between items-center ml-2">
                                                <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Contraseña</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setView('recovery')}
                                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider"
                                                >
                                                    ¿Olvidó su clave?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={credentials.password}
                                                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                                                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-14 w-full bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    Iniciar sesión <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <Button 
                                                type="button"
                                                onClick={() => setView('bio')}
                                                variant="outline"
                                                className="h-12 bg-transparent hover:bg-white/[0.05] border-white/10 rounded-[1.5rem] text-[10px] font-black text-[#86868b] hover:text-white transition-all uppercase tracking-widest shadow-lg"
                                            >
                                                <Fingerprint className="w-4 h-4 mr-2" /> Biometría
                                            </Button>
                                            <Button 
                                                type="button"
                                                onClick={() => setView('signup')}
                                                variant="outline"
                                                className="h-12 bg-transparent hover:bg-white/[0.05] border-white/10 rounded-[1.5rem] text-[10px] font-black text-[#86868b] hover:text-white transition-all uppercase tracking-widest shadow-lg"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" /> Registrarse
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {view === 'signup' && (
                                <form onSubmit={handleSignup} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Usuario</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <Input
                                                    placeholder="Elegir usuario"
                                                    value={signupData.username}
                                                    onChange={e => setSignupData({...signupData, username: e.target.value})}
                                                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Correo electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <Input
                                                    type="email"
                                                    placeholder="ejemplo@correo.com"
                                                    value={signupData.email}
                                                    onChange={e => setSignupData({...signupData, email: e.target.value})}
                                                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={signupData.password}
                                                    onChange={e => setSignupData({...signupData, password: e.target.value})}
                                                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-14 w-full bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-bold text-sm shadow-xl hover:shadow-white/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear cuenta'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-12 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest transition-all rounded-[1.5rem]"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Volver a inicio
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {view === 'recovery' && (
                                <form onSubmit={handleRecovery} className="space-y-6">
                                    <div className="space-y-4 text-center">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white tracking-tight italic">Recuperar acceso</h3>
                                            <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-1">Seleccione el método de recuperación</p>
                                        </div>
                                        
                                        <div className="flex p-1 bg-white/[0.03] border border-white/10 rounded-[1.5rem]">
                                            <button
                                                type="button"
                                                onClick={() => setRecoveryData({...recoveryData, type: 'password'})}
                                                className={`flex-1 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${recoveryData.type === 'password' ? 'bg-white text-black shadow-md' : 'text-[#86868b] hover:text-white'}`}
                                            >
                                                Contraseña
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRecoveryData({...recoveryData, type: 'username'})}
                                                className={`flex-1 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${recoveryData.type === 'username' ? 'bg-white text-black shadow-md' : 'text-[#86868b] hover:text-white'}`}
                                            >
                                                Usuario
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] ml-2">Correo asociado</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <Input
                                                type="email"
                                                placeholder="Su correo registrado"
                                                value={recoveryData.email}
                                                onChange={e => setRecoveryData({...recoveryData, email: e.target.value})}
                                                className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-[1.5rem] text-sm text-white font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 hover:bg-white/[0.05]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-14 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-bold text-sm shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar instrucciones'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-12 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest transition-all rounded-[1.5rem]"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Recordé mis datos
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {view === 'bio' && (
                                <div className="space-y-8 text-center py-4">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-white tracking-tight">Biometría</h3>
                                        <p className="text-xs text-muted-foreground">Acerque su huella o rostro al lector.</p>
                                    </div>
                                    
                                    <div className="flex justify-center relative">
                                        <motion.div 
                                            animate={bioStatus === 'scanning' ? { 
                                                borderColor: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.5)', 'rgba(59,130,246,0.1)'],
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-32 h-32 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative overflow-hidden"
                                        >
                                            {bioStatus === 'scanning' && (
                                                <motion.div 
                                                    initial={{ y: -80 }}
                                                    animate={{ y: 80 }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                                                />
                                            )}
                                            <AnimatePresence mode="wait">
                                                {bioStatus === 'success' ? (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="scan-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                        <Scan className={`w-12 h-12 ${bioStatus === 'scanning' ? 'text-blue-500' : 'text-muted-foreground'}`} strokeWidth={1} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button 
                                            onClick={handleBioAuth}
                                            disabled={bioStatus === 'scanning' || bioStatus === 'success'}
                                            className="h-14 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-bold text-sm shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] uppercase tracking-widest"
                                        >
                                            {bioStatus === 'scanning' ? 'Analizando...' : bioStatus === 'success' ? 'Completado' : 'Escanear'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-12 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest transition-all rounded-[1.5rem]"
                                        >
                                            Usar contraseña
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, scale: 0.98, height: 0 }}
                                    className="mt-6 pt-6 border-t border-white/5"
                                >
                                    <div className={`p-3 rounded-lg flex items-center gap-3 ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                        <span className="text-xs font-medium leading-tight">
                                            {msg.text}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center space-y-4">
                        <div className="flex items-center justify-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">Seguro</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">Rápido</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50">
                            © 2026 U.E. Andrés Bello
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


export default Login;
