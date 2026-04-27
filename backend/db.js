const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones externas a Neon
  }
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    // 1. Tabla de Usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'docente'
      )
    `);

    // 2. Crear Administrador Inicial si no existe
    const adminPass = "AndresBello2026";
    const hashedPass = await bcrypt.hash(adminPass, 10);
    await client.query(`
      INSERT INTO usuarios (username, password, role) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING
    `, ["admin", hashedPass, "admin"]);

    // 3. Tabla de Estudiantes
    await client.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        cedula TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        seccion TEXT NOT NULL,
        representante TEXT,
        contacto TEXT,
        estado TEXT NOT NULL DEFAULT 'activo'
      )
    `);

    // 4. Tabla de Asistencia
    await client.query(`
      CREATE TABLE IF NOT EXISTS asistencia (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id),
        fecha TEXT NOT NULL,
        estado TEXT NOT NULL,
        observacion TEXT
      )
    `);

    // 5. Tabla de Horarios (Mencionado en Momento III)
    await client.query(`
      CREATE TABLE IF NOT EXISTS horarios (
        id SERIAL PRIMARY KEY,
        seccion TEXT NOT NULL,
        dia TEXT NOT NULL,
        materia TEXT NOT NULL,
        bloque TEXT
      )
    `);

    // 6. Tabla de Justificaciones (Mencionado en Momento II y III)
    await client.query(`
      CREATE TABLE IF NOT EXISTS justificaciones (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id),
        fecha TEXT NOT NULL,
        motivo TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'pendiente',
        comentario TEXT
      )
    `);

    // 7. Tabla de Calificaciones (Notas 0-20)
    await client.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id),
        materia TEXT NOT NULL,
        nota DECIMAL(4,2) NOT NULL,
        lapso INTEGER NOT NULL DEFAULT 1,
        fecha TEXT NOT NULL
      )
    `);

    // 8. Tabla de Personal Docente/Administrativo
    await client.query(`
      CREATE TABLE IF NOT EXISTS personal (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        rol TEXT NOT NULL,
        email TEXT,
        contacto TEXT,
        estado TEXT NOT NULL DEFAULT 'activo'
      )
    `);

    // 9. Tabla de Auditoría (Logs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. Tabla de Propuestas IA
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_proposals (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 11. Tabla de Lapsos
    await client.query(`
      CREATE TABLE IF NOT EXISTS lapsos (
        lapso INTEGER PRIMARY KEY,
        estado TEXT NOT NULL DEFAULT 'abierto'
      )
    `);
    
    // Inicializar lapsos
    for (let l of [1, 2, 3]) {
      await client.query("INSERT INTO lapsos (lapso, estado) VALUES ($1, 'abierto') ON CONFLICT DO NOTHING", [l]);
    }

    console.log('Connected to Neon Postgres and all professional tables initialized.');
  } catch (err) {
    console.error('Error initializing Postgres:', err.message);
  } finally {
    if (client) client.release();
  }
};


initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
