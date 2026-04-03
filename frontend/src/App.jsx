import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';

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
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="sidebar glass-effect"
        style={{ borderRight: '1px solid var(--ghost-border)' }}
      >
        <div className="logo">ANDRÉS BELLO</div>
        <nav style={{ flexGrow: 1, marginTop: '20px' }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Inicio' },
            { id: 'students', icon: '🎓', label: 'Estudiantes' },
            { id: 'attendance', icon: '🖊️', label: 'Asistencia' },
            { id: 'reports', icon: '📁', label: 'Análisis IA' },
          ].map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(item.id)}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </nav>
        
        <motion.div 
          whileHover={{ opacity: 0.8 }}
          className="nav-item" 
          style={{ background: 'rgba(255, 59, 48, 0.05)', color: 'var(--danger)', marginTop: 'auto' }}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Finalizar Sesión</span>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="main-content">
        <motion.header 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}
        >
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
              Portal Institucional
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
              Bienvenido de nuevo, {user?.username || 'Coordinador'}
            </p>
          </div>
          <div className="glass-effect" style={{ padding: '10px 24px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--primary)' }}>
            NÚCLEO DE DATOS SEGURO 🔒
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard user={user} setTab={setActiveTab} />}
          {activeTab === 'students' && <Students />}
          {activeTab === 'attendance' && <AttendanceSheet />}
          {(activeTab === 'reports') && (
            <motion.div 
              key="reports-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-effect" 
              style={{ padding: '60px', textAlign: 'center', flexGrow: 1 }}
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>📑</div>
              <h2 style={{ color: 'var(--text-main)', fontWeight: '800', fontSize: '24px' }}>Reportes de Gestión Escolar</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '16px', maxWidth: '500px', margin: '16px auto', lineHeight: '1.6' }}>
                Generando resúmenes periódicos basados en el motor de inteligencia artificial. 
                Sincronización total con la base de datos Neon.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
                <button className="login-btn" style={{ padding: '12px 32px' }}>Previsualizar PDF</button>
                <button className="nav-item" style={{ background: 'rgba(0,0,0,0.05)', border: 'none' }}>Exportar Excel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Dashboard = ({ user, setTab }) => {
  const [stats, setStats] = useState({ students: 0, attendance: '0%', risks: 0 });
  const [aiData, setAiData] = useState({ alerts: [], title: 'Cargando Motor IA...' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        
        const [resStd, resAi] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/ai/analytics`, { headers })
        ]);
        
        const stds = await resStd.json();
        const ai = await resAi.json();
        
        setStats({
          students: stds.length,
          attendance: '98.5%', // Simulado para hoy
          risks: ai.alerts.filter(a => a.type === 'danger').length
        });
        setAiData(ai);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div className="stats-grid">
        {[
          { label: 'Matrícula Total', value: stats.students, sub: 'Inscritos Media General', color: 'var(--accent)' },
          { label: 'Asistencia Promedio', value: stats.attendance, sub: 'Mes Actual', color: 'var(--text-main)' },
          { label: 'Alertas IA Críticas', value: stats.risks, sub: 'Riesgo de Deserción', color: 'var(--danger)' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            className="glass-effect glass-card" 
            style={{ padding: '24px' }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{stat.label}</span>
            <div className="stat-value" style={{ color: stat.color, fontSize: '32px', fontWeight: '800' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', alignItems: 'start' }}>
        <section className="glass-effect" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{aiData.title}</h2>
            <div className="badge badge-success">{aiData.security}</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {aiData.alerts.map((alert, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  borderLeft: `5px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--accent)'}`,
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{alert.msg}</p>
              </motion.div>
            ))}
            {aiData.alerts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Analizando patrones en Neon Postgres...</p>}
          </div>
        </section>

        <section className="glass-effect" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Rendimiento por Año</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: '1er Año', val: 98, color: 'var(--accent)' },
              { label: '2do Año', val: 94, color: 'var(--accent)' },
              { label: '3er Año', val: 82, color: 'var(--warning)' },
              { label: '4to Año', val: 91, color: 'var(--accent)' },
              { label: '5to Año', val: 76, color: 'var(--danger)' },
            ].map(row => (
              <div key={row.label} style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.color }}>{row.val}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${row.val}%` }}
                    style={{ height: '100%', background: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default App;
