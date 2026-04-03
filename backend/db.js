const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'asistencia.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Tabla de Usuarios para Seguridad
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'docente'
    )`);

    // Crear Administrador Inicial si no existe
    const adminPass = "AndresBello2026";
    bcrypt.hash(adminPass, 10, (err, hash) => {
        if (!err) {
            db.run("INSERT OR IGNORE INTO usuarios (username, password, role) VALUES (?, ?, ?)", ["admin", hash, "admin"]);
        }
    });

    // Tabla de Estudiantes
    db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cedula TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        seccion TEXT NOT NULL,
        representante TEXT,
        contacto TEXT
    )`);

    // Tabla de Asistencia
    db.run(`CREATE TABLE IF NOT EXISTS asistencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER,
        fecha TEXT NOT NULL,
        estado TEXT NOT NULL,
        observacion TEXT,
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes (id)
    )`);
});

module.exports = db;
