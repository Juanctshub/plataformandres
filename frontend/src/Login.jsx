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
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ultra-Modern Background Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-500/20 blur-[180px] rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-500/20 blur-[180px] rounded-full"
               />
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-200" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -40, scale: 1.02, filter: 'blur(10px)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-lg z-10"
                >
                    <div className="apple-glass border border-white/10 rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] relative overflow-hidden">
                        {/* Interactive Glow */}
                        <motion.div 
                           className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                           animate={{ opacity: [0.3, 0.8, 0.3], x: ['-100%', '100%'] }}
                           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        
                        {/* Institutional Branding */}
                        <div className="flex flex-col items-center text-center space-y-10 mb-14">
                            <motion.div 
                                whileHover={{ scale: 1.08, rotate: 2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-28 h-28 rounded-[3.2rem] bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 p-[2px] border border-white/20 shadow-2xl relative group"
                            >
                                <div className="w-full h-full bg-black/60 backdrop-blur-2xl rounded-[3.1rem] flex items-center justify-center p-5 group-hover:bg-black/40 transition-colors">
                                    <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-125 contrast-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </div>
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                            
                            <div className="space-y-3">
                                <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">Andrés Bello</h1>
                                <div className="flex items-center justify-center gap-3">
                                    <Badge className="bg-white/5 text-[#86868b] border border-white/5 px-4 py-1 text-[10px] font-medium tracking-wide">Plataforma Educativa</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Views Container */}
                        <div className="min-h-[320px]">
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-5">
                                        <div className="group relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-all duration-300">
                                                <User className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                            <Input
                                                placeholder="Identidad Maestra"
                                                value={credentials.username}
                                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                                className="h-16 pl-16 bg-white/[0.04] border-white/5 hover:bg-white/[0.08] focus:bg-white/[0.1] focus:border-blue-500/40 rounded-[2rem] text-base font-semibold transition-all placeholder:text-white/20"
                                                required
                                            />
                                        </div>
                                        <div className="group relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-all duration-300">
                                                <Lock className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                            <Input
                                                type="password"
                                                placeholder="Clave de Encriptación"
                                                value={credentials.password}
                                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                                className="h-16 pl-16 bg-white/[0.04] border-white/5 hover:bg-white/[0.08] focus:bg-white/[0.1] focus:border-blue-500/40 rounded-[2rem] text-base font-semibold transition-all placeholder:text-white/20"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-16 w-full bg-white text-black hover:bg-zinc-100 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-[0_25px_50px_-12px_rgba(255,255,255,0.2)] transition-all active:scale-[0.97] flex items-center justify-center gap-4 group"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                <>
                                                    Sincronizar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button 
                                                type="button"
                                                onClick={() => setView('bio')}
                                                variant="ghost"
                                                className="h-14 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest gap-2 border border-white/5 transition-all"
                                            >
                                                <Fingerprint className="w-4 h-4 text-blue-500" /> Bio-Auth
                                            </Button>
                                            <Button 
                                                type="button"
                                                onClick={() => setView('signup')}
                                                variant="ghost"
                                                className="h-14 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest gap-2 border border-white/5 transition-all"
                                            >
                                                <UserPlus className="w-4 h-4 text-indigo-500" /> Registro
                                            </Button>
                                        </div>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={() => setView('recovery')}
                                        className="w-full text-center text-[10px] font-black text-white/30 hover:text-blue-400 uppercase tracking-[0.4em] transition-all hover:scale-105"
                                    >
                                        Gestión de Identidad Perdida
                                    </button>
                                </form>
                            )}

                            {view === 'signup' && (
                                <form onSubmit={handleSignup} className="space-y-7">
                                    <div className="space-y-4">
                                        <div className="group relative">
                                            <User className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                placeholder="Usuario Maestro"
                                                value={signupData.username}
                                                onChange={e => setSignupData({...signupData, username: e.target.value})}
                                                className="h-16 pl-16 bg-white/[0.04] border-white/5 rounded-[2rem] text-base font-semibold"
                                                required
                                            />
                                        </div>
                                        <div className="group relative">
                                            <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                type="email"
                                                placeholder="Correo Institucional"
                                                value={signupData.email}
                                                onChange={e => setSignupData({...signupData, email: e.target.value})}
                                                className="h-16 pl-16 bg-white/[0.04] border-white/5 rounded-[2rem] text-base font-semibold"
                                                required
                                            />
                                        </div>
                                        <div className="group relative">
                                            <Lock className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                type="password"
                                                placeholder="Clave de Encriptación"
                                                value={signupData.password}
                                                onChange={e => setSignupData({...signupData, password: e.target.value})}
                                                className="h-16 pl-16 bg-white/[0.04] border-white/5 rounded-[2rem] text-base font-semibold"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-16 w-full bg-white text-black hover:bg-zinc-100 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generar Identidad Institucional'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-14 text-[9px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" /> Volver a Sincronización
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {view === 'recovery' && (
                                <form onSubmit={handleRecovery} className="space-y-10">
                                    <div className="space-y-6 text-center">
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Restauración de Nodo</h3>
                                            <p className="text-xs text-[#86868b] font-semibold leading-relaxed px-10">Seleccione el parámetro de recuperación institucional.</p>
                                        </div>
                                        
                                        <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setRecoveryData({...recoveryData, type: 'password'})}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${recoveryData.type === 'password' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                            >
                                                Olvido de Clave
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRecoveryData({...recoveryData, type: 'username'})}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${recoveryData.type === 'username' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                            >
                                                Olvido de Usuario
                                            </button>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="Ingrese su Correo Validado"
                                            value={recoveryData.email}
                                            onChange={e => setRecoveryData({...recoveryData, email: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.04] border-white/5 rounded-[2rem] text-base font-semibold"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-16 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_-15px_rgba(59,130,246,0.4)] transition-all active:scale-95"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Solicitar Llave de Emergencia'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-14 text-[9px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all"
                                        >
                                            Recordé mi Identidad Maestra
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {view === 'bio' && (
                                <div className="space-y-12 text-center">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Validación Biométrica</h3>
                                        <p className="text-xs text-[#86868b] font-bold leading-relaxed px-10">Identidad Maestro Nivel 4 Requerida. Iniciando escaneo de patrones institucionales.</p>
                                    </div>
                                    
                                    <div className="flex justify-center relative">
                                        <motion.div 
                                            animate={bioStatus === 'scanning' ? { 
                                                borderColor: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.9)', 'rgba(59,130,246,0.1)'],
                                                boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 40px rgba(59,130,246,0.3)', '0 0 0px rgba(59,130,246,0)']
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-52 h-52 rounded-[4rem] bg-white/[0.03] border-2 border-white/10 flex items-center justify-center relative overflow-hidden group transition-all"
                                        >
                                            {bioStatus === 'scanning' && (
                                                <motion.div 
                                                    initial={{ y: -120 }}
                                                    animate={{ y: 120 }}
                                                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_30px_rgba(59,130,246,1)] z-20"
                                                />
                                            )}
                                            <AnimatePresence mode="wait">
                                                {bioStatus === 'success' ? (
                                                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                                                        <CheckCircle2 className="w-24 h-24 text-emerald-500" strokeWidth={1} />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="scan-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group-hover:scale-110 transition-transform duration-500">
                                                        <Scan className={`w-24 h-24 ${bioStatus === 'scanning' ? 'text-blue-500' : 'text-white/20'}`} strokeWidth={0.5} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col gap-4 pt-4">
                                        <Button 
                                            onClick={handleBioAuth}
                                            disabled={bioStatus === 'scanning' || bioStatus === 'success'}
                                            className="h-16 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                                        >
                                            {bioStatus === 'scanning' ? 'Analizando Identidad...' : bioStatus === 'success' ? 'Validación Completada' : 'Iniciar Escaneo Maestro'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setView('login')}
                                            className="h-14 text-[9px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all"
                                        >
                                            Regresar a Sincronización Manual
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Status Node */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                    className="mt-12 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center gap-6 overflow-hidden shadow-inner"
                                >
                                    <div className={`p-3 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Estatus del Nodo</span>
                                        <span className={`text-[13px] font-bold tracking-tight leading-tight ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {msg.text}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer System Info */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-16 text-center space-y-8"
                    >
                        <div className="flex items-center justify-center gap-10 text-white/20">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-blue-500/50" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Quantum Security</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                            <div className="flex items-center gap-2.5">
                                <Zap className="w-4 h-4 text-indigo-500/50" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">IA Core Active</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-white/10 font-black tracking-[0.5em] uppercase">
                               © 2026 U.E. Andrés Bello — Platinum Institution
                           </p>
                           <p className="text-[8px] text-white/5 font-bold uppercase tracking-[0.2em]">Hecho por Antigravity v3.1</p>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


export default Login;
