require('dotenv').config();
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

// Endpoint de LOGIN Seguro
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Faltan credenciales" });
    }

    db.get("SELECT * FROM usuarios WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Usuario no registrado" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { username: user.username, role: user.role } });
    });
});

// --- RUPTAS PROTEGIDAS (Requiere JWT) ---

app.get('/api/estudiantes', authenticateToken, (req, res) => {
    db.all("SELECT * FROM estudiantes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/asistencia', authenticateToken, (req, res) => {
    db.all("SELECT a.id, e.nombre, e.seccion, a.fecha, a.estado, a.observacion FROM asistencia a JOIN estudiantes e ON a.estudiante_id = e.id", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/asistencia', authenticateToken, (req, res) => {
    const { estudiante_id, fecha, estado, observacion } = req.body;
    if (!estudiante_id || !fecha || !estado) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const stmt = db.prepare("INSERT INTO asistencia (estudiante_id, fecha, estado, observacion) VALUES (?, ?, ?, ?)");
    stmt.run(estudiante_id, fecha, estado, observacion, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

app.get('/api/ai/analytics', authenticateToken, (req, res) => {
    db.all("SELECT estudiante_id, count(*) as faltas FROM asistencia WHERE estado = 'ausente' GROUP BY estudiante_id HAVING faltas > 2", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const alerts = rows.map(r => ({
            id: r.estudiante_id,
            msg: `AI Alert: Estudiante ID ${r.estudiante_id} con riesgo de deserción (${r.faltas} faltas).`,
            type: 'warning'
        }));
        res.json({
            title: "Security & AI Stats",
            timestamp: new Date().toISOString(),
            alerts: alerts,
            security: "JWT Encrypted Session Active"
        });
    });
});

app.listen(PORT, () => {
    console.log(`SECURE Server running on port ${PORT}`);
});
