import React, { useState, useEffect } from 'react';
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
      <aside className="sidebar glass-effect">
        <div className="logo" style={{ letterSpacing: '2px' }}>ANDRÉS BELLO HUB</div>
        <nav>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span>📊 Dashboard</span>
          </div>
          <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            <span>🖊️ Tomar Asistencia</span>
          </div>
          <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <span>📂 Reportes de IA</span>
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span>⚙️ Configuración</span>
          </div>
        </nav>
        
        <div 
          className="nav-item" 
          style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
          onClick={handleLogout}
        >
          <span>🚪 Cerrar Sesión</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>Panel de Control</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión Administrativa y Control de Asistencia</p>
          </div>
          <div className="glass-effect" style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '500' }}>
            <span style={{ color: 'var(--accent)', marginRight: '8px' }}>●</span> Sistema Protegido (JWT)
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="glass-effect glass-card" style={{ padding: '24px' }}>
                <span className="stat-label">Total Estudiantes</span>
                <div className="stat-value">540</div>
                <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px', fontWeight: '500' }}>↑ 12% asistencia este mes</div>
              </div>
              <div className="glass-effect glass-card" style={{ padding: '24px' }}>
                <span className="stat-label">Asistencia Promedio</span>
                <div className="stat-value">94.2%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Rango óptimo hoy</div>
              </div>
              <div className="glass-effect glass-card" style={{ padding: '24px' }}>
                <span className="stat-label">Alertas de IA</span>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>08</div>
                <div style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '8px', fontWeight: '500' }}>Requieren revisión hoy</div>
              </div>
            </div>

            {/* AI Insights Section */}
            <section className="glass-effect" style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Análisis Predictivo Local (IA)</h2>
                <div className="badge badge-success">Módulo IA Activo</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
                  <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px' }}>Riesgo de Deserción Escolar</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
                    Se detectó un patrón de inasistencia recurrente en **5to Año Sección B**. 
                    La IA sugiere intervención temprana con los representantes.
                  </p>
                </div>
                <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                  <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px' }}>Optimización Administrativa</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
                    La carga de datos manual se redujo en un **85%** esta semana. 
                    Eficiencia operativa reportada: Alta.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab !== 'dashboard' && (
          <div className="glass-effect" style={{ padding: '60px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Sección "{activeTab.toUpperCase()}" en desarrollo</h2>
            <button 
              className="nav-item active" 
              style={{ marginTop: '30px', border: 'none', padding: '12px 30px' }}
              onClick={() => setActiveTab('dashboard')}
            >
              Volver al Centro de Control
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
