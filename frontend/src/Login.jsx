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
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          onLogin(data.user);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 font-sans relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10"
      >
        <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-8 text-center pt-10">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 shadow-lg group">
                <ShieldCheck className="w-8 h-8 text-zinc-100 transition-transform group-hover:scale-110" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-zinc-100">
              {isLogin ? 'Acceso Institucional' : 'Registro Docente'}
            </CardTitle>
            <CardDescription className="text-zinc-400 font-medium">
              Andrés Bello Attendance System v2.0
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-400 text-xs font-bold uppercase tracking-widest pl-1">
                  Usuario
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                  <Input 
                    id="username"
                    placeholder="DocenteID / Admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 pl-10 focus:ring-zinc-400 focus:border-zinc-500 text-zinc-200 transition-all py-6"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400 text-xs font-bold uppercase tracking-widest pl-1">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 pl-10 focus:ring-zinc-400 focus:border-zinc-500 text-zinc-200 transition-all py-6"
                    required 
                  />
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-zinc-400 text-xs font-bold uppercase tracking-widest pl-1">
                        Confirmar
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                        <Input 
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-zinc-800/50 border-zinc-700 pl-10 focus:ring-zinc-400 focus:border-zinc-500 text-zinc-200 transition-all py-6"
                          required 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full py-7 text-base font-bold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-zinc-950/20 active:scale-[0.98] transition-all rounded-xl mt-4"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {isLogin ? (
                      <>Ingresar al Sistema <LogIn className="w-5 h-5 ml-1" /></>
                    ) : (
                      <>Crear Cuenta de Acceso <UserPlus className="w-5 h-5 ml-1" /></>
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
                  className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                    error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                  }`}
                >
                  {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  <span className="text-sm font-semibold">{error || success}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="bg-zinc-950/50 py-6 flex flex-col items-center border-t border-zinc-800/50">
            <Button 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-transparent text-sm font-bold group"
            >
              {isLogin ? (
                <>¿Es nuevo en la institución? <span className="text-zinc-200 ml-1 group-hover:underline">Regístrese aquí</span> <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></>
              ) : (
                <>¿Ya posee credenciales? <span className="text-zinc-200 ml-1 group-hover:underline">Identifíquese</span></>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="mt-8 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest opacity-50">
          Unidad Educativa Andrés Bello © 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
