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
        <div className="glass-effect" style={{ padding: '8px', display: 'flex', borderRadius: '14px', gap: '8px' }}>
          {['1er Año A', '2do Año A', '3er Año A', '4to Año A', '5to Año A'].map(opt => (
            <button 
              key={opt}
              onClick={() => setSeccion(opt)}
              style={{ 
                padding: '8px 16px', 
                border: 'none', 
                background: seccion === opt ? 'var(--primary)' : 'transparent',
                color: seccion === opt ? 'white' : 'var(--text-muted)',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </header>

      <section className="glass-effect" style={{ padding: '40px' }}>
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</p>
            <p>No se encontraron alumnos para la sección {seccion}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span>ID & Datos del Alumno</span>
              <span>Estado de la Sesión</span>
            </div>
            
            <AnimatePresence>
              {students.map(s => (
                <motion.div 
                  layout
                  key={s.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px 24px',
                    border: '1px solid var(--ghost-border)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>{s.nombre}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>CI: {s.cedula}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleToggle(s.id, 'presente')}
                      className="nav-item"
                      style={{ 
                        margin: 0, 
                        background: attendance[s.id] === 'presente' ? 'var(--accent)' : 'rgba(0,0,0,0.03)',
                        color: attendance[s.id] === 'presente' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '12px'
                      }}
                    >
                      Presente
                    </button>
                    <button 
                      onClick={() => handleToggle(s.id, 'ausente')}
                      className="nav-item"
                      style={{ 
                        margin: 0, 
                        background: attendance[s.id] === 'ausente' ? 'var(--danger)' : 'rgba(0,0,0,0.03)',
                        color: attendance[s.id] === 'ausente' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '12px'
                      }}
                    >
                      Ausente
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                Estudiantes auditados: {Object.keys(attendance).length} / {students.length}
              </p>
              <button 
                onClick={submitAttendance} 
                className="login-btn" 
                style={{ padding: '16px 48px', minWidth: '300px' }}
                disabled={Object.keys(attendance).length === 0}
              >
                Cargar Asistencia a la Nube ☁️
              </button>
            </div>
            {msg && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: '700', marginTop: '20px' }}
              >
                {msg}
              </motion.p>
            )}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default AttendanceSheet;
