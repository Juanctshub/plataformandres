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
        staggerChildren: 0.08,
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
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6 font-sans relative overflow-hidden selection:bg-zinc-900 selection:text-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.08)] border border-zinc-100 flex flex-col items-center">
          
          <motion.div 
             variants={itemVariants}
             className="w-24 h-24 rounded-[2.5rem] bg-zinc-950 flex items-center justify-center mb-8 shadow-2xl shadow-zinc-900/10"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <div className="text-center mb-12">
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl font-bold tracking-tight text-zinc-900 mb-2 uppercase"
            >
              Andrés Bello
            </motion.h1>
            <motion.p 
              variants={itemVariants} 
              className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400"
            >
              {isLogin ? 'Acceso Administrativo' : 'Registro Institucional'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <motion.div variants={itemVariants} className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Identificación</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Usuario institucional"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl pl-16 pr-6 text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 outline-none focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Cifrado de Acceso</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                  <input 
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl pl-16 pr-6 text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 outline-none focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all"
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-3 pt-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Verificar Cifrado</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                    <input 
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl pl-16 pr-6 text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 outline-none focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all"
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-16 text-xs font-black uppercase tracking-widest bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-[2.5px] border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? 'Entrar al Núcleo' : 'Registrar Credenciales'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="w-full mt-12 pt-10 border-t border-zinc-50 flex flex-col items-center">
             <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-3 active:scale-95"
              >
                {isLogin ? '¿No tienes acceso? Solicitalo aqui' : 'Ya tengo credenciales registradas'}
              </button>
          </motion.div>
        </div>
        
        <motion.div 
            variants={itemVariants}
            className="mt-16 flex flex-col items-center gap-4 opacity-50 select-none"
        >
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Protocolo de Seguridad v10.0</span>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
