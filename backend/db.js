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
        contacto TEXT
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

    console.log('Connected to Neon Postgres and tables initialized.');
  } catch (err) {
    console.error('Error initializing Postgres:', err.message);
  } finally {
    client.release();
  }
};

initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
