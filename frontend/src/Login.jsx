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
  Fingerprint
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        
        try {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/auth/login`, {
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
                    {/* Brand Identity */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div 
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          className="w-20 h-20 rounded-[1.75rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30"
                        >
                            <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2} />
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
                           <button type="button" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Recuperar credenciales
                           </button>
                           <button type="button" className="text-xs font-semibold text-[#86868b] hover:text-white transition-colors flex items-center gap-2 group">
                              <Fingerprint className="w-3.5 h-3.5" />
                              Bio-Autenticación
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
                        </div>
                    </form>

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

export default Login;
