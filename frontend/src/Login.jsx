import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Lock,
  User,
  Fingerprint
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
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!credentials.username || !credentials.password) return;
        
        setLoading(true);
        setIsAuthenticating(true);
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
                setMsg({ text: 'Identidad Validada', type: 'success' });
                setTimeout(() => onLogin(data), 1200);
            } else {
                setMsg({ text: data.error || 'Acceso Denegado', type: 'error' });
                setIsAuthenticating(false);
            }
        } catch (e) {
            setMsg({ text: 'Error de Sincronización', type: 'error' });
            setIsAuthenticating(false);
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
                setMsg({ text: 'Cuenta Registrada con Éxito', type: 'success' });
                setTimeout(() => setView('login'), 1500);
            } else {
                setMsg({ text: data.error || 'Fallo en el Registro', type: 'error' });
            }
        } catch (e) {
            setMsg({ text: 'Error de Protocolo', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse-gentle" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse-gentle" style={{ animationDelay: '1.5s' }} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.08, y: -30 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[440px] z-10"
                >
                    <div className="apple-glass rounded-[3.5rem] p-8 sm:p-14 flex flex-col items-center">
                        
                        {/* Biometric Header */}
                        <div className="mb-12 relative">
                            <motion.div 
                                animate={isAuthenticating ? { 
                                    scale: [1, 1.1, 1], 
                                    boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 30px rgba(59,130,246,0.3)", "0 0 0px rgba(59,130,246,0)"] 
                                } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner relative overflow-hidden"
                            >
                                {isAuthenticating ? (
                                    <Fingerprint className="w-12 h-12 text-blue-400" />
                                ) : (
                                    <img src={logo} alt="AB" className="w-14 h-14 object-contain filter brightness-125" />
                                )}
                                {isAuthenticating && (
                                    <motion.div 
                                        initial={{ y: "-100%" }}
                                        animate={{ y: "100%" }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="absolute inset-0 bg-blue-500/10 h-1"
                                    />
                                )}
                            </motion.div>
                        </div>

                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold tracking-tighter text-white mb-3 italic">
                                {view === 'login' ? 'Bienvenido' : view === 'signup' ? 'Registro' : 'Recuperación'}
                            </h1>
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px w-4 bg-white/10" />
                                <p className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.3em]">
                                    {view === 'login' ? 'Nodo Andrés Bello' : 'Sincronización ID'}
                                </p>
                                <div className="h-px w-4 bg-white/10" />
                            </div>
                        </div>

                        <div className="w-full space-y-8">
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="ios-list-group">
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="text"
                                                placeholder="Usuario o Correo"
                                                className="w-full h-16 bg-transparent pl-14 pr-5 text-[17px] focus:outline-none font-bold text-white placeholder:text-white/20"
                                                value={credentials.username}
                                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="h-px bg-white/5 mx-5" />
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="password"
                                                placeholder="Contraseña"
                                                className="w-full h-16 bg-transparent pl-14 pr-5 text-[17px] focus:outline-none font-bold text-white placeholder:text-white/20"
                                                value={credentials.password}
                                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-16 rounded-[1.5rem] bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all font-black text-[16px] shadow-2xl flex items-center justify-center gap-3 mt-6"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>AUTENTICAR <ArrowRight className="w-5 h-5" /></>}
                                    </Button>

                                    <div className="flex justify-between items-center px-4 pt-6">
                                        <button type="button" onClick={() => setView('signup')} className="text-[13px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">Crear Cuenta</button>
                                        <button type="button" onClick={() => setView('recovery')} className="text-[13px] font-black text-[#86868b] hover:text-white uppercase tracking-widest">Soporte</button>
                                    </div>
                                </form>
                            )}

                            {view === 'signup' && (
                                <form onSubmit={handleSignup} className="space-y-5">
                                    <div className="ios-list-group">
                                        <input 
                                            placeholder="Nombre Completo"
                                            className="w-full h-16 bg-transparent px-6 text-[17px] focus:outline-none font-bold text-white"
                                            value={signupData.username}
                                            onChange={e => setSignupData({...signupData, username: e.target.value})}
                                            required
                                        />
                                        <div className="h-px bg-white/5 mx-5" />
                                        <input 
                                            type="email"
                                            placeholder="Correo Institucional"
                                            className="w-full h-16 bg-transparent px-6 text-[17px] focus:outline-none font-bold text-white"
                                            value={signupData.email}
                                            onChange={e => setSignupData({...signupData, email: e.target.value})}
                                            required
                                        />
                                        <div className="h-px bg-white/5 mx-5" />
                                        <input 
                                            type="password"
                                            placeholder="Contraseña de Nodo"
                                            className="w-full h-16 bg-transparent px-6 text-[17px] focus:outline-none font-bold text-white"
                                            value={signupData.password}
                                            onChange={e => setSignupData({...signupData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black text-[16px] shadow-xl active:scale-[0.98] transition-all">
                                        VINCULAR IDENTIDAD
                                    </Button>
                                    <button type="button" onClick={() => setView('login')} className="w-full text-center text-[12px] text-[#86868b] font-black uppercase tracking-widest">Ya tengo cuenta</button>
                                </form>
                            )}
                        </div>

                        {/* Status Message */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`mt-10 px-8 py-4 rounded-[1.5rem] flex items-center gap-4 text-[13px] font-black shadow-2xl border backdrop-blur-xl ${
                                        msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                                >
                                    {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    {msg.text.toUpperCase()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-16 text-[#86868b] text-[10px] font-black uppercase tracking-[0.4em] opacity-40 z-10 pointer-events-none flex items-center gap-4">
                <div className="h-px w-8 bg-white/20" />
                U.E. Andrés Bello • Sistema Seguro
                <div className="h-px w-8 bg-white/20" />
            </div>
        </div>
    );
};

export default Login;

