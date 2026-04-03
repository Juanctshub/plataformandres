import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cedula: '', nombre: '', seccion: '1er Año A', representante: '', contacto: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStudents(data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const response = await fetch(`${baseUrl}/api/estudiantes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setMsg({ text: 'Estudiante Inscrito con éxito', type: 'success' });
        setFormData({ cedula: '', nombre: '', seccion: '1er Año A', representante: '', contacto: '' });
        fetchStudents();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (e) { setMsg({ text: 'Error de servidor', type: 'error' }); }
  };

  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cedula.includes(searchTerm)
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>Matrícula Estudiantil</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Censo Escolar - Media General</p>
        </div>
        <div style={{ width: '300px' }}>
          <input 
            className="glass-input" 
            placeholder="🔍 Buscar por nombre o cédula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Formulario de Inscripción */}
        <section className="glass-effect" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Nueva Inscripción</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="stat-label">Documento de Identidad</label>
              <input 
                className="glass-input" 
                placeholder="V-00.000.000" 
                value={formData.cedula}
                onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="stat-label">Nombre del Estudiante</label>
              <input 
                className="glass-input" 
                placeholder="Nombre Completo" 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="stat-label">Sección Asignada</label>
              <select 
                className="glass-input"
                value={formData.seccion}
                onChange={(e) => setFormData({...formData, seccion: e.target.value})}
              >
                <option>1er Año A</option><option>1er Año B</option>
                <option>2do Año A</option><option>2do Año B</option>
                <option>3er Año A</option><option>4to Año A</option>
                <option>5to Año A</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="stat-label">Representante Legal</label>
              <input 
                className="glass-input" 
                placeholder="Nombre del Representante" 
                value={formData.representante}
                onChange={(e) => setFormData({...formData, representante: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="stat-label">Contacto Telefónico</label>
              <input 
                className="glass-input" 
                placeholder="+58 4XX-XXXXXXX" 
                value={formData.contacto}
                onChange={(e) => setFormData({...formData, contacto: e.target.value})}
              />
            </div>
            <button type="submit" className="login-btn" style={{ marginTop: '16px' }}>Inscribir en el Sistema</button>
            {msg.text && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  fontSize: '13px', 
                  textAlign: 'center',
                  fontWeight: '700',
                  background: msg.type === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                  color: msg.type === 'success' ? '#248a3d' : '#cc2f26'
                }}
              >
                {msg.text}
              </motion.div>
            )}
          </form>
        </section>

        {/* Listado de Estudiantes */}
        <section className="glass-effect" style={{ padding: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Listado General ({filteredStudents.length})</h2>
            <div className="badge badge-success">Activos</div>
          </header>
          
          <div style={{ overflowY: 'auto', maxHeight: '600px', paddingRight: '10px' }}>
            {filteredStudents.map(s => (
              <motion.div 
                key={s.id} 
                className="glass-card" 
                whileHover={{ x: 5 }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '20px 24px',
                  marginBottom: '12px',
                  border: '1px solid var(--ghost-border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>{s.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    CI: {s.cedula} • Rep: {s.representante || 'Sin asignar'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="badge" style={{ background: 'rgba(0, 88, 188, 0.05)', color: 'var(--primary)', marginBottom: '4px' }}>
                    {s.seccion}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{s.id}</div>
                </div>
              </motion.div>
            ))}
            {filteredStudents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No se encontraron estudiantes para la búsqueda.
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Students;
