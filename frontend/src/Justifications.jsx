import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Justifications = () => {
  const [justifications, setJustifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    comentario: ''
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resJust, resStd] = await Promise.all([
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/estudiantes`, { headers })
      ]);

      const justs = await resJust.json();
      const stds = await resStd.json();

      setJustifications(justs);
      setStudents(stds);
      setLoading(false);
    } catch (e) {
      console.error('Error fetching data:', e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      
      const res = await fetch(`${baseUrl}/api/justificaciones`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (e) {
      console.error('Error saving:', e);
    }
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('es-VE', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'aprobado': return <span className="badge badge-success">Aprobado</span>;
      case 'rechazado': return <span className="badge badge-danger">Rechazado</span>;
      default: return <span className="badge badge-warning">En Revisión</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="justifications-container"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>Centro de Justificativos</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión de permisos y validación de inasistencias</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="login-btn" 
          onClick={() => setShowForm(true)}
          style={{ padding: '12px 28px' }}
        >
          Registrar Certificado
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.form 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-effect"
              style={{ width: '100%', maxWidth: '500px', padding: '40px' }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleSubmit}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Nuevo Justificativo</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>ESTUDIANTE</label>
                  <select 
                    className="glass-input" 
                    required 
                    value={formData.estudiante_id}
                    onChange={e => setFormData({ ...formData, estudiante_id: e.target.value })}
                  >
                    <option value="">Seleccione un alumno…</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} ({s.seccion})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>FECHA DE LA INASISTENCIA</label>
                  <input 
                    type="date" 
                    className="glass-input" 
                    required 
                    value={formData.fecha}
                    onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>MOTIVO (MÉDICO, PERSONAL, ETC.)</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="Ej: Reposo médico por 48h…"
                    required 
                    value={formData.motivo}
                    onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>COMENTARIOS ADICIONALES</label>
                  <textarea 
                    className="glass-input" 
                    style={{ minHeight: '100px', resize: 'none' }}
                    value={formData.comentario}
                    onChange={e => setFormData({ ...formData, comentario: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="login-btn" style={{ flex: 1 }}>Guardar Registro</button>
                  <button type="button" className="nav-item" style={{ flex: 1, border: 'none' }} onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-effect" style={{ padding: '32px', minHeight: '300px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Cargando registros…</div>
        ) : justifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
            <span style={{ fontSize: '48px' }}>📁</span>
            <p style={{ marginTop: '16px' }}>No hay justificativos registrados en el sistema.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '0 20px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              <span>ESTUDIANTE</span>
              <span>MOTIVO</span>
              <span>FECHA</span>
              <span>ESTADO</span>
            </div>
            {justifications.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.nombre}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.seccion}</div>
                </div>
                <div style={{ fontSize: '13px' }}>{item.motivo}</div>
                <div style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>{formatDate(item.fecha)}</div>
                <div>{getStatusBadge(item.estado)}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Justifications;
