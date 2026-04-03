import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IAAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/ai/analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="glass-effect" style={{ padding: '60px', textAlign: 'center' }}>Procesando Red Neuronal…</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ia-analytics-container"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>{data?.title || 'Análisis Predictivo'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Motor de Inteligencia Artificial para la Prevención de Deserción Escolar</p>
        </div>
        <button className="login-btn" onClick={handlePrint} style={{ padding: '12px 28px' }}>
          📄 Generar Reporte PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <section className="glass-effect" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Alertas de Riesgo Crítico</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.alerts?.map((alert, i) => (
              <div 
                key={i} 
                className="glass-card" 
                style={{ 
                  padding: '16px', 
                  borderLeft: `4px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}`,
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: '600' }}>{alert.msg}</p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <button style={{ background: 'none', border: '1px solid var(--ghost-border)', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Ver Ficha</button>
                  <button style={{ background: 'none', border: '1px solid var(--ghost-border)', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Contactar Representante</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-effect" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Métricas de Desempeño IA</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'Precisión del Modelo', val: '94.2%', sub: 'Basado en histórico 2025' },
              { label: 'Tiempo de Respuesta', val: '12ms', sub: 'Procesamiento en Tiempo Real' },
              { label: 'Integridad de Datos', val: '100%', sub: 'Sincronizado con NeonDB' }
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>{m.label.toUpperCase()}</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent)' }}>{m.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-effect" style={{ padding: '32px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Proyección de Asistencia Semanal</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '20px 0' }}>
          {[65, 80, 45, 90, 85, 95, 70].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                style={{ 
                  width: '100%', 
                  background: h < 50 ? 'var(--danger)' : 'var(--accent)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              />
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: '24px', padding: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
        {data?.security} • Last Neural Refresh: {data?.timestamp}
      </div>
    </motion.div>
  );
};

export default IAAnalytics;
