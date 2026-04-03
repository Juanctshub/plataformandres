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
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="apple-card p-12 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div 
               animate={{ 
                 scale: [1, 1.05, 1],
                 opacity: [0.8, 1, 0.8]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-inner"
            >
              <Building2 className="w-9 h-9 text-white/90" />
            </motion.div>
            
            <h1 className="text-4xl font-semibold tracking-tight text-white mb-3 italic">Andrés Bello</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
              {isLogin ? 'Acceso Institucional' : 'Registro de Personal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600 pl-4">Identificación</label>
                <div className="relative group/field">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-white/40 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Usuario / ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-700 outline-none"
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
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-700 outline-none"
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
                      className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-700 outline-none"
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-[2rem] shadow-2xl transition-all active:scale-[0.97] group"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full"
                />
              ) : (
                <div className="flex items-center gap-3">
                  {isLogin ? (
                    <>Entrar al Sistema <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Registrar Acceso <UserPlus className="w-5 h-5" /></>
                  )}
                </div>
              )}
            </Button>
          </form>

          <AnimatePresence>
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-8 p-5 rounded-2xl flex items-center gap-4 text-xs font-semibold ${
                  error ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                }`}
              >
                {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 group"
            >
              {isLogin ? (
                <>Solicitar registro institucional <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></>
              ) : (
                <>Volver a identificación segura</>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-4 opacity-30 select-none">
            <div className="flex items-center gap-2 text-zinc-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cifrado Protocolo UPEL-2026</span>
            </div>
            <p className="text-center text-zinc-800 text-[9px] font-black uppercase tracking-[0.3em]">
                Unidad Educativa Andrés Bello • Núcleo Administrativo
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
