import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';

const Dashboard = ({ stats, aiData }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="dashboard-view"
    >
      <div className="stats-grid">
        {[
          { label: 'Matrícula', value: stats.students, sub: 'Media General', icon: '👥' },
          { label: 'Asistencia', value: stats.attendance, sub: 'Promedio Mensual', icon: '📈' },
          { label: 'Alertas IA', value: stats.risks, sub: 'Casos Críticos', icon: '🧠', color: 'var(--danger)' },
          { label: 'Justificativos', value: '12', sub: 'Pendientes', icon: '📄' },
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
            className="glass-card" 
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{stat.icon}</div>
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value" style={{ color: stat.color || 'inherit' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '32px' }}>
        <section className="glass-effect" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Análisis IA: Predicción de Deserción</h2>
            <div className="badge badge-success">Seguridad Bancaria Nivel 4</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {aiData.alerts && aiData.alerts.length > 0 ? aiData.alerts.map((alert, i) => (
              <motion.div 
                key={i}
                className="glass-card" 
                style={{ 
                  padding: '16px', 
                  borderLeft: `4px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--accent)'}`,
                  background: 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{alert.type === 'danger' ? '🛑' : '⚠️'}</span>
                  <p style={{ fontSize: '13px', fontWeight: '500' }}>{alert.msg}</p>
                </div>
              </motion.div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                <span style={{ fontSize: '40px' }}>🔍</span>
                <p style={{ fontSize: '14px', marginTop: '12px' }}>Analizando patrones en Neon Postgres...</p>
              </div>
            )}
          </div>
        </section>

        <section className="glass-effect" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Asistencia por Año</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { label: '1er Año', val: 98, color: 'var(--accent)' },
              { label: '2do Año', val: 94, color: 'var(--accent)' },
              { label: '3er Año', val: 82, color: 'var(--warning)' },
              { label: '4to Año', val: 91, color: 'var(--accent)' },
              { label: '5to Año', val: 76, color: 'var(--danger)' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.color }}>{row.val}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
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

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, attendance: '98.5%', risks: 0 });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resStd, resAi] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/ai/analytics`, { headers })
        ]);
        
        const stds = await resStd.json();
        const ai = await resAi.json();
        
        setStats(prev => ({
          ...prev,
          students: stds.length,
          risks: ai.alerts ? ai.alerts.filter(a => a.type === 'danger').length : 0
        }));
        setAiData(ai);
      } catch (e) { 
        console.error('Network error - using mock data for development', e); 
      }
    };
    fetchData();
  }, [token]);

  if (!token) return <Login onLogin={(data) => { setToken(data.token); setUser(data.user); }} />;

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '🎓', label: 'Estudiantes' },
    { id: 'attendance', icon: '🖊️', label: 'Control' },
    { id: 'justifications', icon: '📄', label: 'Justificaciones' },
    { id: 'reports', icon: '📈', label: 'IA Analytics' },
  ];

  return (
    <div className="app-container">
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }} 
        className="sidebar glass-effect"
      >
        <div className="logo" style={{ marginBottom: '40px' }}>ANDRÉS BELLO</div>
        <nav style={{ flex: 1 }}>
          {menuItems.map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--ghost-border)' }}>
          <div className="nav-item" onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: 'var(--danger)' }}>
            <span>🚪</span>
            <span>Salir</span>
          </div>
        </div>
      </motion.aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px' }}>Portal Institucional</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34C759' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                Conexión segura a NeonDB • {user?.username || 'Admin'}
              </p>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🇻🇪</span>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>UA-2026-X</span>
          </div>
        </header>

        <section style={{ flex: 1, marginTop: '32px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dash" stats={stats} aiData={aiData} />}
            {activeTab === 'students' && <Students key="std" />}
            {activeTab === 'attendance' && <AttendanceSheet key="att" />}
            {activeTab === 'justifications' && <Justifications key="just" />}
            {activeTab === 'reports' && <IAAnalytics key="ia" />}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default App;
