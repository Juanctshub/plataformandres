import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn,
  AlertCircle,
  CheckCircle2,
  Building2,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Fingerprint
} from 'lucide-react';
import { Button } from "./components/ui/button";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!isLogin && password !== confirmPassword) {
      setError('Discrepancia en el cifrado de datos');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin(data);
        } else {
          setSuccess('Identidad Registrada. Sincronizando nucleo...');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
            setLoading(false);
          }, 2000);
        }
      } else {
        setError(data.error || 'Autenticación Fallida');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de enlace con el servidor central');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-8 font-sans relative overflow-hidden selection:bg-white selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] right-[-10%] w-[80%] h-[80%] bg-[#0A84FF]/[0.05] blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#5E5CE6]/[0.05] blur-[150px] rounded-full" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[540px] z-10"
      >
        <div className="apple-pro-card p-16 flex flex-col items-center bg-black/40 border-white/[0.03] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          
          <motion.div 
             variants={itemVariants}
             className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(255,255,255,0.15)] group relative overflow-hidden"
          >
            <Building2 className="w-10 h-10 text-black relative z-10" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-100 to-zinc-400 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          
          <div className="text-center mb-16 space-y-4">
            <motion.h1 
              variants={itemVariants} 
              className="text-5xl font-black tracking-tighter text-white leading-none italic uppercase"
            >
              Andrés Bello
            </motion.h1>
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
               <div className="h-[1px] w-8 bg-white/20" />
               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#0A84FF] italic">
                  {isLogin ? 'Protocolo de Acceso v14.0' : 'Registro de Identidad Pro'}
               </p>
               <div className="h-[1px] w-8 bg-white/20" />
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Identificación de Usuario</label>
                <div className="relative group/field">
                  <User className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/10 group-focus-within/field:text-[#0A84FF] transition-colors" />
                  <input 
                    type="text"
                    placeholder="USUARIO INSTITUCIONAL"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-18 bg-black border border-white/5 rounded-2xl pl-18 pr-8 text-sm font-black text-white italic tracking-widest placeholder:text-white/5 outline-none focus:ring-1 focus:ring-[#0A84FF]/40 transition-all shadow-inner uppercase"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Cifrado de Acceso (Token)</label>
                <div className="relative group/field">
                  <Fingerprint className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/10 group-focus-within/field:text-[#0A84FF] transition-colors" />
                  <input 
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-18 bg-black border border-white/5 rounded-2xl pl-18 pr-8 text-sm font-black text-white tracking-[0.4em] placeholder:text-white/5 outline-none focus:ring-1 focus:ring-[#0A84FF]/40 transition-all shadow-inner"
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-4 pt-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-4">Re-Validación de Cifrado</label>
                  <div className="relative group/field">
                    <Lock className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/10 group-focus-within/field:text-[#0A84FF] transition-colors" />
                    <input 
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-18 bg-black border border-white/5 rounded-2xl pl-18 pr-8 text-sm font-black text-white tracking-[0.4em] placeholder:text-white/5 outline-none focus:ring-1 focus:ring-[#0A84FF]/40 transition-all shadow-inner"
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <AnimatePresence>
                {(error || success) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-6 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] border ${
                            error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}
                    >
                        {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        {error || success}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-20 text-[11px] font-black uppercase tracking-[0.5em] bg-white text-black hover:bg-zinc-200 rounded-[2rem] shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-6 group"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-[3px] border-black/10 border-t-black rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? 'Sincronizar Acceso' : 'Registrar Identidad'}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="w-full mt-16 pt-12 border-t border-white/5 flex flex-col items-center">
             <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all flex items-center gap-4 active:scale-95 group/sw"
              >
                {isLogin ? (
                    <>
                        <UserPlus className="w-4 h-4 group-hover/sw:text-[#0A84FF]" />
                        Solicitar Acceso al Núcleo de Datos
                    </>
                ) : (
                    <>
                        <LogIn className="w-4 h-4 group-hover/sw:text-[#0A84FF]" />
                        Volver al Portal de Identificación
                    </>
                )}
              </button>
          </motion.div>
        </div>
        
        <motion.div 
            variants={itemVariants}
            className="mt-20 flex flex-col items-center gap-6 opacity-10 select-none pb-12"
        >
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Apple Pro Security</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Andrés Bello Terminal v14.0</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
               <Zap className="w-4 h-4 text-white" />
               <span className="text-[8px] font-black uppercase tracking-[1em] text-white/50">High Performance Infrastructure</span>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
