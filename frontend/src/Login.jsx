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
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div 
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <div style={{ paddingBottom: '20px' }}>
                  <input 
                    type="password" 
                    className="glass-input" 
                    placeholder="Confirmar Contraseña" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="login-btn" style={{ marginTop: '12px', fontSize: '16px' }}>
            {isLogin ? 'Autenticar Acceso' : 'Crear Cuenta'}
          </button>
        </form>

        <p 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ 
            marginTop: '32px', 
            cursor: 'pointer', 
            color: 'var(--primary)', 
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isLogin ? '¿No tiene cuenta? Regístrese aquí' : '¿Ya tiene cuenta? Ingrese aquí'}
        </p>

        {(error || success) && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ 
              color: error ? 'var(--danger)' : 'var(--accent)', 
              marginTop: '24px', 
              fontSize: '14px',
              fontWeight: '600',
              padding: '12px',
              background: error ? 'rgba(255, 59, 48, 0.05)' : 'rgba(52, 199, 89, 0.05)',
              borderRadius: '10px'
            }}
          >
            {error ? `⚠️ ${error}` : `✅ ${success}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
