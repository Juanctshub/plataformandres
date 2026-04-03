import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [seccion, setSeccion] = useState('1er Año A');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchStudents(); }, [seccion]);

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStudents(data.filter(s => s.seccion === seccion));
    } catch (e) { console.error(e); }
  };

  const handleToggle = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const submitAttendance = async () => {
    setMsg('Sincronizando con Neon...');
    const date = new Date().toISOString().split('T')[0];
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const promises = Object.entries(attendance).map(([id, status]) => 
        fetch(`${baseUrl}/api/asistencia`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify({ estudiante_id: parseInt(id), fecha: date, estado: status, observacion: '' })
        })
      );
      await Promise.all(promises);
      setMsg('✅ Datos auditados y almacenados con éxito.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg('❌ Error de comunicación.'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px' }}>Control de Asistencia</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Sesión Operativa: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="glass-effect" style={{ padding: '6px', display: 'flex', borderRadius: '16px', gap: '4px', background: 'rgba(0,0,0,0.02)' }}>
          {['1er Año A', '2do Año A', '3er Año A', '4to Año A', '5to Año A'].map(opt => (
            <button 
              key={opt}
              onClick={() => setSeccion(opt)}
              className={seccion === opt ? 'login-btn' : 'nav-item'}
              style={{ 
                padding: '10px 18px', 
                border: 'none', 
                margin: 0,
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.5px'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </header>

      <section className="glass-effect" style={{ padding: '40px', minHeight: '400px' }}>
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</p>
            <p style={{ fontWeight: '600' }}>Sin registros para {seccion}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span>ID & Datos del Alumno</span>
              <span>Estado de la Sesión</span>
            </div>
            
            <AnimatePresence>
              {students.map(s => (
                <motion.div 
                  layout
                  key={s.id} 
                  className="glass-card" 
                  whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 24px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>{s.nombre}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>CI: {s.cedula}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleToggle(s.id, 'presente')}
                      className={`badge ${attendance[s.id] === 'presente' ? 'badge-success' : ''}`}
                      style={{ 
                        cursor: 'pointer',
                        padding: '10px 24px',
                        border: '1px solid var(--ghost-border)',
                        background: attendance[s.id] === 'presente' ? 'var(--success)' : 'transparent',
                        color: attendance[s.id] === 'presente' ? 'white' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}
                    >
                      PRESENTE
                    </button>
                    <button 
                      onClick={() => handleToggle(s.id, 'ausente')}
                      className={`badge ${attendance[s.id] === 'ausente' ? 'badge-danger' : ''}`}
                      style={{ 
                        cursor: 'pointer',
                        padding: '10px 24px',
                        border: '1px solid var(--ghost-border)',
                        background: attendance[s.id] === 'ausente' ? 'var(--danger)' : 'transparent',
                        color: attendance[s.id] === 'ausente' ? 'white' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}
                    >
                      AUSENTE
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '32px', borderTop: '1px solid var(--ghost-border)' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900' }}>{Object.keys(attendance).length}</div>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>AUDITADOS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900' }}>{students.length}</div>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>TOTAL</div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitAttendance} 
                className="login-btn" 
                style={{ padding: '18px 60px' }}
                disabled={Object.keys(attendance).length === 0}
              >
                Sincronizar con NeonDB ☁️
              </motion.button>
            </div>
            {msg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="badge badge-success"
                style={{ textAlign: 'center', fontWeight: '800', marginTop: '20px', padding: '14px' }}
              >
                {msg}
              </motion.div>
            )}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default AttendanceSheet;
