import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="sidebar glass-effect"
      >
        <div className="logo" style={{ letterSpacing: '4px' }}>ANDRÉS BELLO</div>
        <nav style={{ flexGrow: 1 }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'attendance', icon: '🖊️', label: 'Asistencia' },
            { id: 'reports', icon: '📁', label: 'Reportes IA' },
            { id: 'settings', icon: '⚙️', label: 'Ajustes' },
          ].map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(item.id)}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </nav>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="nav-item" 
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', marginTop: '20px' }}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="main-content">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}
        >
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>Portal de Gestión</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Bienvenido de nuevo, {user?.username || 'Colega'}</p>
          </div>
          <div className="glass-effect" style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px' }}>●</span> NÚCLEO DE SEGURIDAD ACTIVO
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Stats Overview */}
              <div className="stats-grid">
                {[
                  { label: 'Total Alumnos', value: '540', sub: '↑ 12% este mes', color: 'var(--accent)' },
                  { label: 'Asistencia Hoy', value: '94.2%', sub: 'Valores normales', color: 'var(--text-main)' },
                  { label: 'Riesgos Detectados', value: '08', sub: 'Requieren atención', color: 'var(--warning)' },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-effect glass-card" 
                    style={{ padding: '24px' }}
                  >
                    <span className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{stat.label}</span>
                    <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: stat.color, marginTop: '8px', opacity: 0.8, fontWeight: '600' }}>{stat.sub}</div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights Section */}
              <section className="glass-effect" style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Análisis Predictivo (Motor IA v3.0)</h2>
                  <div className="badge badge-success">Sincronizado</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <motion.div whileHover={{ scale: 1.01 }} className="glass-card" style={{ padding: '20px', borderLeft: '5px solid var(--warning)', background: 'rgba(255,255,255,0.02)' }}>
                    <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>⚠️ Alerta de Deserción</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                      Se detectó una anomalía en el patrón de **5to Año Sección B**. 
                      La IA sugiere contactar a los representantes por inasistencias los días viernes.
                    </p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} className="glass-card" style={{ padding: '20px', borderLeft: '5px solid var(--primary)', background: 'rgba(255,255,255,0.02)' }}>
                    <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>📈 Eficiencia Administrativa</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                      La integración de datos locales ha reducido el error humano en un **92%**. 
                      El sistema de seguridad reporta integridad total de la base de datos.
                    </p>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="tab-placeholder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="glass-effect" 
              style={{ padding: '80px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <h2 style={{ color: 'var(--text-muted)', fontWeight: '600' }}>MODULO "{activeTab.toUpperCase()}" EN DESPLIEGUE</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '15px', maxWidth: '460px', lineHeight: '1.6' }}>
                Estamos conectando este portal con el servidor de seguridad central para garantizar la integridad de los datos escolares.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-item active" 
                style={{ marginTop: '40px', border: 'none', padding: '14px 40px', fontSize: '15px' }}
                onClick={() => setActiveTab('dashboard')}
              >
                Volver a la Central
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
