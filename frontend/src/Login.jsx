import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      // Usamos el prefijo de Vercel si estamos en producción, de lo contrario localhost
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
          setSuccess('Usuario registrado con éxito. Ya puedes iniciar sesión.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        setError(data.error || 'Error en la operación');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-dark)',
      perspective: '1000px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-effect" 
        style={{
          padding: '40px',
          width: '420px',
          textAlign: 'center',
          display: 'flex',
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect"
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '60px 48px',
          textAlign: 'center'
        }}
      >
        <header style={{ marginBottom: '48px' }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '800', 
            color: 'var(--primary)', 
            letterSpacing: '5px', 
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            Andrés Bello Dashboard
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
            {isLogin ? 'Iniciar Sesión' : 'Registro Institucional'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '15px' }}>
            {isLogin ? 'Acceso al núcleo de gestión administrativa' : 'Cree su cuenta de docente o administrativo'}
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              className="glass-input" 
              placeholder="Nombre de Usuario" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="Contraseña" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Confirmar Contraseña</label>
                <input 
                  type="password" 
                  className="glass-effect" 
                  style={{ width: '100%', padding: '12px', border: 'none', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--danger)', fontSize: '12px', textAlign: 'center' }}>{error}</motion.p>}
          {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--accent)', fontSize: '12px', textAlign: 'center' }}>{success}</motion.p>}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="nav-item active" 
            style={{ width: '100%', border: 'none', marginTop: '10px', justifyContent: 'center', height: '48px', fontSize: '16px' }}
          >
            {isLogin ? 'Entrar al Panel' : 'Registrarse Ahora'}
          </motion.button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya eres parte?'} 
          </span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '8px', cursor: 'pointer' }}
          >
            {isLogin ? 'Crea una aquí' : 'Inicia sesión'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
