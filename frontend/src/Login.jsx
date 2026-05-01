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
  Mail,
  UserPlus,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

import logo from './assets/logo.png';

const Login = ({ onLogin }) => {
    const [view, setView] = useState('login'); // login, recovery, signup
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [recoveryData, setRecoveryData] = useState({ email: '', type: 'password' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

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
                setMsg({ text: 'Acceso autorizado', type: 'success' });
                setTimeout(() => onLogin(data), 800);
            } else {
                setMsg({ text: data.error || 'Credenciales incorrectas', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        if (!signupData.username || !signupData.password || !signupData.email) {
            setMsg({ text: 'Complete todos los campos', type: 'error' });
            return;
        }
        if (!validateEmail(signupData.email)) {
            setMsg({ text: 'Formato de correo inválido', type: 'error' });
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
                setMsg({ text: 'Cuenta creada exitosamente.', type: 'success' });
                setTimeout(() => setView('login'), 1500);
            } else {
                setMsg({ text: data.error || 'Error en el registro', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de red', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRecovery = async (e) => {
        if (e) e.preventDefault();
        if (!recoveryData.email || !validateEmail(recoveryData.email)) {
            setMsg({ text: 'Ingrese un correo válido', type: 'error' });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setMsg({ 
                text: recoveryData.type === 'password' 
                    ? 'Instrucciones enviadas al correo.' 
                    : 'Su usuario ha sido enviado al correo.', 
                type: 'success' 
            });
            setLoading(false);
            setTimeout(() => setView('login'), 2000);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-4 relative font-sans overflow-hidden">
            {/* Minimal Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[480px] z-10"
                >
                    <div className="apple-glass bg-[#1c1c1e]/40 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-10 sm:p-14 relative flex flex-col justify-center min-h-[580px] shadow-[0_0_80px_-20px_rgba(0,0,0,1)]">
                        
                        {/* Branding */}
                        <div className="flex flex-col items-center text-center space-y-5 mb-10">
                            <motion.div className="w-[72px] h-[72px]">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                            </motion.div>
                            
                            <div className="space-y-1.5">
                                <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white/95 leading-tight">Iniciar Sesión</h1>
                                <p className="text-[13px] font-medium tracking-wide text-[#86868b]">U.E. Andrés Bello</p>
                            </div>
                        </div>

                        {/* Views Container */}
                        <div className="flex-1 w-full">
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Input
                                                placeholder="Nombre de usuario"
                                                value={credentials.username}
                                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                                className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 focus:bg-white/[0.06] px-5 placeholder:text-[#86868b] shadow-inner"
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Input
                                                type="password"
                                                placeholder="Contraseña"
                                                value={credentials.password}
                                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                                className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 focus:bg-white/[0.06] px-5 placeholder:text-[#86868b] shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 mt-8">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-[52px] w-full bg-white text-black hover:bg-zinc-200 rounded-full font-semibold text-[15px] tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /></>}
                                        </Button>

                                        <div className="flex items-center justify-center gap-4 text-[13px] font-medium pt-2">
                                            <button 
                                                type="button"
                                                onClick={() => setView('signup')}
                                                className="text-[#2997ff] hover:text-[#41a1ff] transition-colors"
                                            >
                                                Crear cuenta
                                            </button>
                                            <span className="text-white/20">|</span>
                                            <button 
                                                type="button"
                                                onClick={() => setView('recovery')}
                                                className="text-[#2997ff] hover:text-[#41a1ff] transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {view === 'signup' && (
                                <form onSubmit={handleSignup} className="space-y-6">
                                    <div className="space-y-4">
                                        <Input
                                            placeholder="Nombre de usuario"
                                            value={signupData.username}
                                            onChange={e => setSignupData({...signupData, username: e.target.value})}
                                            className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 px-5 placeholder:text-[#86868b]"
                                            required
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Correo electrónico"
                                            value={signupData.email}
                                            onChange={e => setSignupData({...signupData, email: e.target.value})}
                                            className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 px-5 placeholder:text-[#86868b]"
                                            required
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Contraseña"
                                            value={signupData.password}
                                            onChange={e => setSignupData({...signupData, password: e.target.value})}
                                            className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 px-5 placeholder:text-[#86868b]"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-5 mt-8">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-[52px] w-full bg-white text-black hover:bg-zinc-200 rounded-full font-semibold text-[15px] tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar'}
                                        </Button>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('login')}
                                            className="text-[13px] font-medium text-[#86868b] hover:text-white transition-colors flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Volver
                                        </button>
                                    </div>
                                </form>
                            )}

                            {view === 'recovery' && (
                                <form onSubmit={handleRecovery} className="space-y-6">
                                    <div className="flex bg-white/[0.04] border border-white/[0.05] p-1 rounded-[14px] mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setRecoveryData({...recoveryData, type: 'password'})}
                                            className={`flex-1 py-2.5 text-[13px] font-medium rounded-[10px] transition-all ${recoveryData.type === 'password' ? 'bg-white text-black shadow-md' : 'text-[#86868b] hover:text-white'}`}
                                        >
                                            Contraseña
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecoveryData({...recoveryData, type: 'username'})}
                                            className={`flex-1 py-2.5 text-[13px] font-medium rounded-[10px] transition-all ${recoveryData.type === 'username' ? 'bg-white text-black shadow-md' : 'text-[#86868b] hover:text-white'}`}
                                        >
                                            Usuario
                                        </button>
                                    </div>

                                    <Input
                                        type="email"
                                        placeholder="Correo electrónico asociado"
                                        value={recoveryData.email}
                                        onChange={e => setRecoveryData({...recoveryData, email: e.target.value})}
                                        className="h-14 bg-white/[0.04] border border-white/[0.08] rounded-[1rem] text-[15px] text-white font-medium transition-all focus:border-white/20 focus:ring-4 focus:ring-white/5 px-5 placeholder:text-[#86868b]"
                                        required
                                    />

                                    <div className="flex flex-col gap-5 mt-8">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-[52px] w-full bg-white text-black hover:bg-zinc-200 rounded-full font-semibold text-[15px] tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Restablecer'}
                                        </Button>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('login')}
                                            className="text-[13px] font-medium text-[#86868b] hover:text-white transition-colors flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Status Message */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="absolute bottom-8 left-0 right-0 flex justify-center"
                                >
                                    <div className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-[13px] font-medium shadow-2xl backdrop-blur-md ${msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="absolute bottom-8 text-[#86868b] text-[12px] font-medium flex flex-col items-center gap-3">
                <div className="flex items-center gap-6">
                    <span className="hover:text-white cursor-pointer transition-colors">Plataforma Segura</span>
                    <span className="w-1 h-1 rounded-full bg-[#86868b]/30"></span>
                    <span className="hover:text-white cursor-pointer transition-colors">Ayuda</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
