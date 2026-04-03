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
  Sparkles
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
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
          setSuccess('Registro completado. Iniciando sesión...');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
            setLoading(false);
          }, 2000);
        }
      } else {
        setError(data.error || 'Error de credenciales');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-6 font-sans relative overflow-hidden selection:bg-white selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600 blur-[180px] rounded-full" 
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[460px] z-10"
      >
        <div className="apple-card p-12 border-white/10 apple-shadow-soft relative overflow-hidden group">
          {/* Subtle Shine Effect */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine transition-all duration-1000 pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
               variants={itemVariants}
               whileHover={{ scale: 1.05 }}
               className="w-20 h-20 rounded-[2.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-inner relative"
            >
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <Building2 className="w-9 h-9 text-white/90 relative z-10" />
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl font-semibold tracking-tight text-white mb-2 italic">Andrés Bello</motion.h1>
            <motion.p variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
              {isLogin ? 'Acceso Institucional' : 'Registro de Personal'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600 pl-4">Identificación</label>
                <div className="relative group/field">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-white/40 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Usuario / ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium apple-input-focus placeholder:text-zinc-800 outline-none hover:bg-white/[0.05] transition-all"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600 pl-4">Cifrado</label>
                <div className="relative group/field">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-white/40 transition-colors" />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium apple-input-focus placeholder:text-zinc-800 outline-none hover:bg-white/[0.05] transition-all"
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-2 pt-2"
                >
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600 pl-4">Verificación</label>
                  <div className="relative group/field">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-white/40 transition-colors" />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium apple-input-focus placeholder:text-zinc-800 outline-none"
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button 
                type="submit" 
                className="w-full h-16 text-lg font-bold bg-white text-black hover:bg-zinc-100 rounded-[2rem] shadow-2xl transition-all active:scale-[0.97] group/btn overflow-hidden relative"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 -translate-x-[200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center gap-3 relative z-10 w-full px-4">
                    <span className="flex-1 text-center">
                        {isLogin ? 'Entrar al Sistema' : 'Registrar Acceso'}
                    </span>
                    {isLogin && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          <AnimatePresence>
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className={`mt-8 p-5 rounded-3xl flex items-center gap-4 text-xs font-semibold ${
                  error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <div className={`p-2 rounded-xl ${error ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                    {error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group"
            >
              {isLogin ? (
                <>Solicitar registro institucional <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></>
              ) : (
                <>Volver a identificación segura</>
              )}
            </button>
          </motion.div>
        </div>
        
        <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-col items-center gap-4 opacity-30 select-none"
        >
            <div className="flex items-center gap-2 text-zinc-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cifrado Protocolo UPEL-2026</span>
            </div>
            <p className="text-center text-zinc-800 text-[9px] font-black uppercase tracking-[0.3em]">
                Unidad Educativa Andrés Bello • Núcleo Administrativo
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
