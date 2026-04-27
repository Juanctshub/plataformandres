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
                body: JSON.stringify(signupData)
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ text: 'Identidad creada. Inicie sesión para activar el nodo.', type: 'success' });
                setTimeout(() => setView('login'), 2000);
            } else {
                setMsg({ text: data.msg || 'Error en registro', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de red', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRecovery = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setMsg({ text: 'Token enviado al correo institucional.', type: 'success' });
            setLoading(false);
            setTimeout(() => setView('login'), 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"
               />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -30 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-lg z-10"
                >
                    <div className="apple-glass border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden">
                        {/* Top Line Glow */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                        
                        {/* Institutional Branding */}
                        <div className="flex flex-col items-center text-center space-y-8 mb-12">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="w-24 h-24 rounded-[2.8rem] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 p-0.5 border border-white/10 shadow-2xl"
                            >
                                <div className="w-full h-full bg-black/40 backdrop-blur-xl rounded-[2.7rem] flex items-center justify-center p-4">
                                    <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-125 contrast-125" />
                                </div>
                            </motion.div>
                            
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Andrés Bello</h1>
                                <div className="flex items-center justify-center gap-3">
                                    <Badge className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1 text-[9px] font-black tracking-widest uppercase italic">Platinum v26.6</Badge>
                                    <Badge className="bg-white/5 text-white/40 border-none px-3 py-1 text-[8px] font-bold uppercase tracking-tighter">Nodo Maestro</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Login View */}
                        {view === 'login' && (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-blue-500 transition-colors">
                                            <User className="w-5 h-5" strokeWidth={2.5} />
                                        </div>
                                        <Input
                                            placeholder="Identidad Maestra"
                                            value={credentials.username}
                                            onChange={e => setCredentials({...credentials, username: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.03] border-white/5 hover:bg-white/[0.06] focus:bg-white/[0.08] focus:border-blue-500/50 rounded-[1.8rem] text-base font-medium transition-all placeholder:text-[#86868b]/50"
                                            required
                                        />
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-blue-500 transition-colors">
                                            <Lock className="w-5 h-5" strokeWidth={2.5} />
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="Clave de Encriptación"
                                            value={credentials.password}
                                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.03] border-white/5 hover:bg-white/[0.06] focus:bg-white/[0.08] focus:border-blue-500/50 rounded-[1.8rem] text-base font-medium transition-all placeholder:text-[#86868b]/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="h-16 w-full bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                Sincronizar <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button 
                                            type="button"
                                            onClick={() => setView('bio')}
                                            variant="ghost"
                                            className="h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest gap-2 border border-white/5"
                                        >
                                            <Fingerprint className="w-4 h-4" /> Bio-Auth
                                        </Button>
                                        <Button 
                                            type="button"
                                            onClick={() => setView('signup')}
                                            variant="ghost"
                                            className="h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest gap-2 border border-white/5"
                                        >
                                            <UserPlus className="w-4 h-4" /> Registro
                                        </Button>
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => setView('recovery')}
                                    className="w-full text-center text-[10px] font-bold text-[#86868b] hover:text-white uppercase tracking-[0.3em] transition-colors"
                                >
                                    ¿Olvidó su Llave de Acceso? <span className="text-blue-500 ml-1">Restaurar</span>
                                </button>
                            </form>
                        )}

                        {/* Biometric View */}
                        {view === 'bio' && (
                            <div className="space-y-12 text-center">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight">Validación Biométrica</h3>
                                    <p className="text-sm text-[#86868b] font-medium leading-relaxed px-6">Identidad Maestro Nivel 4 requerida. Posicione su huella digital en el sensor institucional.</p>
                                </div>
                                
                                <div className="flex justify-center relative">
                                    <motion.div 
                                        animate={bioStatus === 'scanning' ? { 
                                            borderColor: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,0.1)']
                                        } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-48 h-48 rounded-[3.5rem] bg-white/[0.02] border-2 border-white/10 flex items-center justify-center relative overflow-hidden"
                                    >
                                        {bioStatus === 'scanning' && (
                                            <motion.div 
                                                initial={{ y: -100 }}
                                                animate={{ y: 100 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-x-0 h-[3px] bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,1)] z-20"
                                            />
                                        )}
                                        <AnimatePresence mode="wait">
                                            {bioStatus === 'success' ? (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle2 className="w-20 h-20 text-emerald-500" strokeWidth={1.5} />
                                                </motion.div>
                                            ) : (
                                                <motion.div key="scan-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <Scan className={`w-20 h-20 ${bioStatus === 'scanning' ? 'text-blue-500' : 'text-[#86868b]'}`} strokeWidth={1} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <Button 
                                        onClick={handleBioAuth}
                                        disabled={bioStatus === 'scanning'}
                                        className="h-16 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]"
                                    >
                                        {bioStatus === 'scanning' ? 'Analizando Patrones...' : 'Iniciar Escaneo Maestro'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setView('login')}
                                        className="h-14 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest"
                                    >
                                        Acceso Manual por Clave
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Sign Up View */}
                        {view === 'signup' && (
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
                                        <Input
                                            placeholder="Usuario Maestro"
                                            value={signupData.username}
                                            onChange={e => setSignupData({...signupData, username: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-base font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="group relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
                                        <Input
                                            type="email"
                                            placeholder="Correo Institucional"
                                            value={signupData.email}
                                            onChange={e => setSignupData({...signupData, email: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-base font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="group relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
                                        <Input
                                            type="password"
                                            placeholder="Clave de Encriptación"
                                            value={signupData.password}
                                            onChange={e => setSignupData({...signupData, password: e.target.value})}
                                            className="h-16 pl-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-base font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="h-16 w-full bg-white text-black hover:bg-zinc-200 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generar Identidad Maestra'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setView('login')}
                                        className="h-14 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest"
                                    >
                                        Ya poseo una identidad validada
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Recovery View */}
                        {view === 'recovery' && (
                            <form onSubmit={handleRecovery} className="space-y-8 text-center">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight">Restauración de Nodo</h3>
                                    <p className="text-sm text-[#86868b] font-medium leading-relaxed px-6">Se enviará una llave temporal al correo vinculado para restaurar la sincronización.</p>
                                </div>
                                <div className="group relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
                                    <Input
                                        type="email"
                                        placeholder="Ingrese su Correo"
                                        value={recoveryEmail}
                                        onChange={e => setRecoveryEmail(e.target.value)}
                                        className="h-16 pl-16 bg-white/[0.03] border-white/5 rounded-[1.8rem] text-base font-medium"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="h-16 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Solicitar Llave de Emergencia'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setView('login')}
                                        className="h-14 text-[10px] font-black text-[#86868b] hover:text-white uppercase tracking-widest"
                                    >
                                        Recordé mi Clave Institucional
                                    </Button>
                                </div>
                            </form>
                        )}
                        
                        {/* Interactive Message Node */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mt-10 p-6 rounded-[1.8rem] bg-white/[0.02] border border-white/5 flex items-center gap-5"
                                >
                                    <div className={`p-2.5 rounded-full ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#86868b] mb-1">Estatus del Sistema</span>
                                        <span className={`text-[12px] font-bold tracking-tight ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {msg.text}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-center space-y-6">
                        <div className="flex items-center justify-center gap-6 text-[#86868b]">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Criptografía Maestra</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-indigo-500" strokeWidth={2.5} />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Núcleo Activo</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase">
                            © 2026 U.E. Andrés Bello — Platinum Institution
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Login;
