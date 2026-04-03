const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { authenticateToken, JWT_SECRET } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM usuarios WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: "Usuario no registrado" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REGISTRO
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO usuarios (username, password, role) VALUES ($1, $2, $3)", 
                      [username, hashedPassword, role || 'docente']);
        res.json({ success: true });
    } catch (err) {
        if (err.message.includes('unique')) return res.status(400).json({ error: "Usuario ya existe" });
        res.status(500).json({ error: err.message });
    }
});

// ESTUDIANTES (Gestión Institucional)
app.get('/api/estudiantes', authenticateToken, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM estudiantes ORDER BY seccion, nombre");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/estudiantes', authenticateToken, async (req, res) => {
    const { cedula, nombre, seccion, representante, contacto } = req.body;
    if (!cedula || !nombre || !seccion) {
        return res.status(400).json({ error: "Faltan datos obligatorios (Cédula, Nombre, Sección)" });
    }
    try {
        await db.query(
            "INSERT INTO estudiantes (cedula, nombre, seccion, representante, contacto) VALUES ($1, $2, $3, $4, $5)",
            [cedula, nombre, seccion, representante, contacto]
        );
        res.json({ success: true, message: "Estudiante inscrito correctamente" });
    } catch (err) {
        if (err.message.includes('unique')) return res.status(400).json({ error: "La cédula ya está registrada" });
        res.status(500).json({ error: err.message });
    }
});

// ASISTENCIA (Pase de Lista)
app.get('/api/asistencia', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.id, e.nombre, e.seccion, a.fecha, a.estado, a.observacion 
            FROM asistencia a 
            JOIN estudiantes e ON a.estudiante_id = e.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/asistencia', authenticateToken, async (req, res) => {
    const { estudiante_id, fecha, estado, observacion } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO asistencia (estudiante_id, fecha, estado, observacion) VALUES ($1, $2, $3, $4) RETURNING id",
            [estudiante_id, fecha, estado, observacion]
        );
        res.json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IA: ANÁLISIS PREDICTIVO (Momento II - Marco Teórico)
app.get('/api/ai/analytics', authenticateToken, async (req, res) => {
    try {
        // Buscamos alumnos con más de 3 inasistencias (Patrón de Deserción)
        const result = await db.query(`
            SELECT e.nombre, e.seccion, e.contacto, COUNT(a.id) as faltas 
            FROM asistencia a 
            JOIN estudiantes e ON a.estudiante_id = e.id 
            WHERE a.estado = 'ausente' 
            GROUP BY e.id, e.nombre, e.seccion, e.contacto 
            HAVING COUNT(a.id) >= 3
        `);

        const alerts = result.rows.map(r => ({
            msg: `⚠️ ALERTA: ${r.nombre} (${r.seccion}) tiene ${r.faltas} faltas. Iniciar contacto con representante: ${r.contacto}`,
            type: 'danger',
            student: r.nombre
        }));

        res.json({
            title: "Análisis del Motor IA v3.5",
            timestamp: new Date().toLocaleDateString(),
            alerts: alerts.length > 0 ? alerts : [{ msg: "✅ No se detectan riesgos críticos de deserción hoy.", type: 'success' }],
            security: "Conexión Encriptada con Neon Postgres Activa"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`SECURE NEON Server running on port ${PORT}`);
});
