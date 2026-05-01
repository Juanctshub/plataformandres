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
    const [recoveryData, setRecoveryData] = useState({ email: '', type: 'password' }); // type: password, username
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

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
        <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-4 relative font-sans">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-[640px] z-10"
                >
                    <div 
                        className="bg-white rounded-[32px] p-10 sm:p-14 relative flex flex-col justify-center min-h-[610px]"
                        style={{
                            border: '1px solid #FFFFFF',
                            boxShadow: '0px 12px 28px #C5CBD0'
                        }}
                    >
                        
                        {/* Branding */}
                        <div className="flex flex-col items-center text-center space-y-4 mb-10">
                            <motion.div className="w-20 h-20 mb-2">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                            </motion.div>
                            
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Iniciar Sesión</h1>
                                <p className="text-[13px] text-[#86868b] font-medium">U.E. Andrés Bello</p>
                            </div>
                        </div>

                        {/* Views Container */}
                        <div className="flex-1 max-w-[320px] mx-auto w-full">
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                placeholder="Nombre de usuario"
                                                value={credentials.username}
                                                onChange={e => setCredentials({...credentials, username: e.target.value})}
                                                className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="Contraseña"
                                                value={credentials.password}
                                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                                className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 mt-8">
                                        <div className="flex items-center justify-center gap-4 text-[13px] mb-4">
                                            <button 
                                                type="button"
                                                onClick={() => setView('signup')}
                                                className="text-[#0071e3] hover:underline"
                                            >
                                                Crear cuenta
                                            </button>
                                            <span className="text-[#d2d2d7]">|</span>
                                            <button 
                                                type="button"
                                                onClick={() => setView('recovery')}
                                                className="text-[#0071e3] hover:underline"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-12 w-full bg-[#0071e3] text-white hover:bg-[#0077ed] rounded-full font-medium text-[15px] transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /></>}
                                        </Button>
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
                                            className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                            required
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Correo electrónico"
                                            value={signupData.email}
                                            onChange={e => setSignupData({...signupData, email: e.target.value})}
                                            className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                            required
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Contraseña"
                                            value={signupData.password}
                                            onChange={e => setSignupData({...signupData, password: e.target.value})}
                                            className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 mt-8">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-12 w-full bg-[#0071e3] text-white hover:bg-[#0077ed] rounded-full font-medium text-[15px] transition-all flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar'}
                                        </Button>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('login')}
                                            className="text-[13px] text-[#0071e3] hover:underline flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Volver
                                        </button>
                                    </div>
                                </form>
                            )}

                            {view === 'recovery' && (
                                <form onSubmit={handleRecovery} className="space-y-6">
                                    <div className="flex bg-[#f5f5f7] p-1 rounded-[12px] mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setRecoveryData({...recoveryData, type: 'password'})}
                                            className={`flex-1 py-2 text-[13px] font-medium rounded-[8px] transition-all ${recoveryData.type === 'password' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'}`}
                                        >
                                            Contraseña
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecoveryData({...recoveryData, type: 'username'})}
                                            className={`flex-1 py-2 text-[13px] font-medium rounded-[8px] transition-all ${recoveryData.type === 'username' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'}`}
                                        >
                                            Usuario
                                        </button>
                                    </div>

                                    <Input
                                        type="email"
                                        placeholder="Correo electrónico asociado"
                                        value={recoveryData.email}
                                        onChange={e => setRecoveryData({...recoveryData, email: e.target.value})}
                                        className="h-14 bg-white border border-[#d2d2d7] rounded-[12px] text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 px-4 placeholder:text-[#86868b]"
                                        required
                                    />

                                    <div className="flex flex-col gap-4 mt-8">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-12 w-full bg-[#0071e3] text-white hover:bg-[#0077ed] rounded-full font-medium text-[15px] transition-all flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Restablecer'}
                                        </Button>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('login')}
                                            className="text-[13px] text-[#0071e3] hover:underline flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Divider Line near bottom */}
                        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 w-[302px] h-[1px] bg-[#d2d2d7]/50" />

                        {/* Status Message */}
                        <AnimatePresence>
                            {msg.text && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="absolute bottom-6 left-0 right-0 flex justify-center"
                                >
                                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-[13px] font-medium shadow-sm ${msg.type === 'success' ? 'bg-[#e3f5eb] text-[#1a7f37]' : 'bg-[#fce8e6] text-[#c92a2a]'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Footer Footer */}
            <div className="absolute bottom-6 text-[#86868b] text-[12px] flex flex-col items-center gap-2">
                <div className="flex gap-4">
                    <span>Plataforma segura</span>
                    <span>Ayuda</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
