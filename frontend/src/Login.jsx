import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Intentamos conectar con el backend real
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      } else {
        setError(data.error || 'Error en las credenciales');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor central.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-dark)'
    }}>
      <div className="glass-effect" style={{
        padding: '40px',
        width: '400px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="logo" style={{ marginBottom: '10px' }}>ANDRÉS BELLO</div>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Acceso al Sistema</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión estudiantil de alta seguridad</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Usuario</label>
            <input 
              type="text" 
              className="glass-effect" 
              style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Contraseña</label>
            <input 
              type="password" 
              className="glass-effect" 
              style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {error && <p style={{ color: 'var(--danger)', fontSize: '12px', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            className="nav-item active" 
            style={{ width: '100%', border: 'none', marginTop: '10px', justifyContent: 'center' }}
          >
            Iniciar Sesión
          </button>
        </form>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px' }}>
          Sistema Encriptado con JWT & Bcrypt 2026.
        </p>
      </div>
    </div>
  );
};

export default Login;
