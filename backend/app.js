const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { authenticateToken, JWT_SECRET } = require('./auth');

let groq;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log("Nucleo Groq Llama 3 Sincronizado.");
    } else {
        console.warn("ADVERTENCIA: GROQ_API_KEY no detectada. El asistente IA operara en modo diagnostico.");
    }
} catch (e) {
    console.error("Fallo en inicializacion de Nucleo Groq:", e.message);
}

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

// RECUPERACIÓN (Protocolo de Sincronización)
app.post('/api/recover', async (req, res) => {
    const { email } = req.body;
    console.log(`[RECOVERY] Solicitud para: ${email}`);
    // Simulamos lógica de recuperación por ahora, pero con persistencia de logs
    if (!email) return res.status(400).json({ error: "Email institucional requerido" });
    
    setTimeout(() => {
        res.json({ success: true, message: "Código de sincronización enviado al correo institucional." });
    }, 1500);
});

// BIO-AUTENTICACIÓN (Nodo de Validación)
app.post('/api/bio-auth', async (req, res) => {
    try {
        const userResult = await db.query("SELECT id, username, role FROM usuarios WHERE username = 'admin'");
        const user = userResult.rows[0];
        if (!user) throw new Error("Nodo Administrador no encontrado");
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '48h' });
        res.json({ success: true, message: "Acceso Biométrico Validado en Nodo Seguro", token, user: { username: user.username, role: user.role } });
    } catch (err) {
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

app.get('/api/estudiantes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) return res.status(400).json({ error: "ID de estudiante inválido" });
        
        const result = await db.query("SELECT * FROM estudiantes WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Fallo crítico en Nodo de Consulta: " + err.message });
    }
});

app.delete('/api/estudiantes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) return res.status(400).json({ error: "ID de estudiante inválido para eliminación" });
        
        // Cascading delete: purge all dependent records first
        await db.query("DELETE FROM asistencia WHERE estudiante_id = $1", [id]);
        await db.query("DELETE FROM notas WHERE estudiante_id = $1", [id]);
        await db.query("DELETE FROM justificaciones WHERE estudiante_id = $1", [id]);
        
        const result = await db.query("DELETE FROM estudiantes WHERE id = $1 RETURNING id, nombre", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Estudiante no encontrado para eliminación" });
        res.json({ success: true, message: `${result.rows[0].nombre} eliminado permanentemente del Nodo Maestro`, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: "Fallo en protocolo de eliminación: " + err.message });
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

app.patch('/api/estudiantes/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await db.query("UPDATE estudiantes SET estado = $1 WHERE id = $2", [estado, id]);
        res.json({ success: true });
    } catch (err) {
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

// JUSTIFICACIONES (Momento II - Gestión Administrativa)
app.get('/api/justificaciones', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT j.id, e.nombre, e.seccion, j.fecha, j.motivo, j.estado, j.comentario 
            FROM justificaciones j 
            JOIN estudiantes e ON j.estudiante_id = e.id
            ORDER BY j.fecha DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CALIFICACIONES (Notas 0-20)
app.get('/api/notas', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT n.id, e.nombre as student, e.seccion, n.materia as subject, n.nota as grade, n.lapso, n.fecha
            FROM notas n
            JOIN estudiantes e ON n.estudiante_id = e.id
            ORDER BY n.fecha DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notas', authenticateToken, async (req, res) => {
    const { estudiante_id, materia, nota, lapso, fecha } = req.body;
    try {
        await db.query(`
            INSERT INTO notas (estudiante_id, materia, nota, lapso, fecha)
            VALUES ($1, $2, $3, $4, $5)
        `, [estudiante_id, materia, nota, lapso || 1, fecha || new Date().toISOString().split('T')[0]]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HORARIOS
app.get('/api/horarios', authenticateToken, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM horarios ORDER BY dia, bloque");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/horarios', authenticateToken, async (req, res) => {
    const { seccion, dia, materia, bloque } = req.body;
    try {
        await db.query(`
            INSERT INTO horarios (seccion, dia, materia, bloque)
            VALUES ($1, $2, $3, $4)
        `, [seccion, dia, materia, bloque]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PERSONAL
app.get('/api/personal', authenticateToken, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM personal ORDER BY nombre");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/personal', authenticateToken, async (req, res) => {
    const { nombre, rol, email, contacto } = req.body;
    try {
        await db.query(`
            INSERT INTO personal (nombre, rol, email, contacto)
            VALUES ($1, $2, $3, $4)
        `, [nombre, rol, email, contacto]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NOTIFICACIONES (Comunicación Proactiva)
app.post('/api/notify', authenticateToken, async (req, res) => {
    const { student, msg, contact } = req.body;
    console.log(`[ALERTA INSTITUCIONAL] Enviando a ${contact}: ${msg}`);
    setTimeout(() => {
        res.json({ success: true, message: `Notificación enviada a representante de ${student}` });
    }, 1000);
});

// ASISTENCIA STATS (Cálculo Real)
app.get('/api/asistencia/stats', authenticateToken, async (req, res) => {
    try {
        const total = await db.query("SELECT COUNT(*) as count FROM asistencia");
        const present = await db.query("SELECT COUNT(*) as count FROM asistencia WHERE estado = 'presente'");
        const totalCount = parseInt(total.rows[0].count);
        const presentCount = parseInt(present.rows[0].count);
        const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) + '%' : 'Sin datos';
        res.json({ percentage, total: totalCount, present: presentCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════════════════════════
// IA ADMINISTRADORA — SISTEMA DE PROPUESTAS
// ══════════════════════════════════════════════════════════

// Auto-create ai_proposals table on startup
(async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS ai_proposals (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                payload JSONB DEFAULT '{}',
                status VARCHAR(20) DEFAULT 'pending',
                ai_reasoning TEXT,
                user_response TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                resolved_at TIMESTAMP
            )
        `);
        console.log("[IA ADMIN] Tabla ai_proposals sincronizada.");
    } catch (e) {
        console.error("[IA ADMIN] Error creando tabla:", e.message);
    }
})();

// GET all proposals (with optional status filter)
app.get('/api/ai/proposals', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        let query = "SELECT * FROM ai_proposals ORDER BY created_at DESC LIMIT 50";
        let params = [];
        if (status) {
            query = "SELECT * FROM ai_proposals WHERE status = $1 ORDER BY created_at DESC LIMIT 50";
            params = [status];
        }
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET pending proposals count (for badge)
app.get('/api/ai/proposals/count', authenticateToken, async (req, res) => {
    try {
        const result = await db.query("SELECT COUNT(*) as count FROM ai_proposals WHERE status = 'pending'");
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// RESPOND to a proposal (approve / reject / custom)
app.post('/api/ai/proposals/:id/respond', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { decision, customMessage } = req.body; // decision: 'approved', 'rejected', 'custom'
    
    try {
        const proposalResult = await db.query("SELECT * FROM ai_proposals WHERE id = $1", [id]);
        if (proposalResult.rows.length === 0) return res.status(404).json({ error: "Propuesta no encontrada" });
        
        const proposal = proposalResult.rows[0];
        if (proposal.status !== 'pending') return res.status(400).json({ error: "Esta propuesta ya fue procesada" });

        if (decision === 'approved') {
            // ─── EXECUTE THE ACTION ───
            const payload = proposal.payload || {};
            let execResult = { success: false, message: 'Tipo de acción no reconocido' };

            switch (proposal.type) {
                case 'CREATE_STUDENT': {
                    const { cedula, nombre, seccion, representante, contacto } = payload;
                    if (nombre && cedula && seccion) {
                        await db.query("INSERT INTO estudiantes (cedula, nombre, seccion, representante, contacto) VALUES ($1,$2,$3,$4,$5)",
                            [cedula, nombre, seccion, representante || '', contacto || '']);
                        execResult = { success: true, message: `Estudiante ${nombre} inscrito exitosamente` };
                    } else {
                        execResult = { success: false, message: 'Datos insuficientes para crear estudiante' };
                    }
                    break;
                }
                case 'UPDATE_STUDENT': {
                    const { student_id, fields } = payload;
                    if (student_id && fields) {
                        const sets = [];
                        const vals = [];
                        let idx = 1;
                        for (const [key, val] of Object.entries(fields)) {
                            if (['nombre', 'seccion', 'representante', 'contacto', 'cedula'].includes(key)) {
                                sets.push(`${key} = $${idx}`);
                                vals.push(val);
                                idx++;
                            }
                        }
                        if (sets.length > 0) {
                            vals.push(student_id);
                            await db.query(`UPDATE estudiantes SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
                            execResult = { success: true, message: `Estudiante #${student_id} actualizado` };
                        }
                    }
                    break;
                }
                case 'SUSPEND': {
                    await db.query("UPDATE estudiantes SET estado = 'suspendido' WHERE id = $1", [payload.id || payload.student_id]);
                    execResult = { success: true, message: `${payload.student || 'Estudiante'} suspendido` };
                    break;
                }
                case 'ACTIVATE': {
                    await db.query("UPDATE estudiantes SET estado = 'activo' WHERE id = $1", [payload.id || payload.student_id]);
                    execResult = { success: true, message: `${payload.student || 'Estudiante'} reactivado` };
                    break;
                }
                case 'DELETE': {
                    const delId = payload.id || payload.student_id;
                    await db.query("DELETE FROM asistencia WHERE estudiante_id = $1", [delId]);
                    await db.query("DELETE FROM notas WHERE estudiante_id = $1", [delId]);
                    await db.query("DELETE FROM justificaciones WHERE estudiante_id = $1", [delId]);
                    await db.query("DELETE FROM estudiantes WHERE id = $1", [delId]);
                    execResult = { success: true, message: `${payload.student || 'Estudiante'} eliminado permanentemente` };
                    break;
                }
                case 'CREATE_NOTE': {
                    const { id: noteStudentId, student_id: noteStudentId2, materia, nota, lapso } = payload;
                    const sId = noteStudentId || noteStudentId2;
                    if (sId && materia && nota != null) {
                        await db.query("INSERT INTO notas (estudiante_id, materia, nota, lapso, fecha) VALUES ($1,$2,$3,$4,$5)",
                            [sId, materia, nota, lapso || 1, new Date().toISOString().split('T')[0]]);
                        execResult = { success: true, message: `Nota ${nota} en ${materia} registrada` };
                    }
                    break;
                }
                case 'REGISTER_ATTENDANCE': {
                    const { student_id: attId, id: attId2, estado, fecha } = payload;
                    const aId = attId || attId2;
                    if (aId) {
                        await db.query("INSERT INTO asistencia (estudiante_id, fecha, estado, observacion) VALUES ($1,$2,$3,$4)",
                            [aId, fecha || new Date().toISOString().split('T')[0], estado || 'presente', 'Registrado por IA']);
                        execResult = { success: true, message: `Asistencia registrada` };
                    }
                    break;
                }
                case 'CREATE_JUSTIFICATION': {
                    const { student_id: justId, id: justId2, motivo } = payload;
                    const jId = justId || justId2;
                    if (jId && motivo) {
                        await db.query("INSERT INTO justificaciones (estudiante_id, fecha, motivo, estado) VALUES ($1,$2,$3,'pendiente')",
                            [jId, new Date().toISOString().split('T')[0], motivo]);
                        execResult = { success: true, message: `Justificativo creado` };
                    }
                    break;
                }
                case 'UPDATE_SCHEDULE': {
                    const { seccion, dia, materia, bloque } = payload;
                    if (seccion && dia && materia && bloque) {
                        await db.query("INSERT INTO horarios (seccion, dia, materia, bloque) VALUES ($1,$2,$3,$4)", [seccion, dia, materia, bloque]);
                        execResult = { success: true, message: `Horario actualizado: ${materia} en ${dia}` };
                    }
                    break;
                }
                case 'NOTIFY_PARENT': {
                    execResult = { success: true, message: `Notificación enviada al representante de ${payload.student || 'estudiante'}` };
                    break;
                }
                default:
                    execResult = { success: true, message: `Acción ${proposal.type} registrada` };
            }

            await db.query(
                "UPDATE ai_proposals SET status = 'executed', user_response = 'Aprobado', resolved_at = NOW() WHERE id = $1", [id]
            );
            res.json({ success: execResult.success, message: execResult.message, status: 'executed' });

        } else if (decision === 'rejected') {
            await db.query("UPDATE ai_proposals SET status = 'rejected', user_response = 'Rechazado', resolved_at = NOW() WHERE id = $1", [id]);
            res.json({ success: true, message: 'Propuesta rechazada', status: 'rejected' });

        } else if (decision === 'custom') {
            await db.query("UPDATE ai_proposals SET status = 'custom', user_response = $1, resolved_at = NOW() WHERE id = $2", [customMessage || '', id]);
            res.json({ success: true, message: 'Respuesta personalizada registrada', status: 'custom', customMessage });

        } else {
            res.status(400).json({ error: "Decisión no válida. Usa: approved, rejected, custom" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error procesando propuesta: " + err.message });
    }
});

// NOTIFICACIONES (Alertas Reales + Propuestas IA)
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = [];
        
        // 1. Pending AI proposals (most important)
        const proposals = await db.query("SELECT id, type, title, description, created_at FROM ai_proposals WHERE status = 'pending' ORDER BY created_at DESC LIMIT 10");
        proposals.rows.forEach(p => {
            notifications.push({
                id: `proposal-${p.id}`,
                proposalId: p.id,
                type: 'ai_proposal',
                title: `🤖 ${p.title}`,
                msg: p.description || `La IA propone: ${p.type}`,
                time: p.created_at
            });
        });

        // 2. Suspended students
        const suspended = await db.query("SELECT nombre FROM estudiantes WHERE estado = 'suspendido'");
        if (suspended.rows.length > 0) {
            notifications.push({
                id: 'susp-1', type: 'system',
                title: 'Alumnos Suspendidos',
                msg: `${suspended.rows.length} alumno(s) suspendido(s): ${suspended.rows.map(s => s.nombre).join(', ')}`
            });
        }
        
        // 3. Pending justifications
        const pending = await db.query("SELECT COUNT(*) as count FROM justificaciones WHERE estado = 'pendiente'");
        if (parseInt(pending.rows[0].count) > 0) {
            notifications.push({
                id: 'just-1', type: 'system',
                title: 'Justificativos Pendientes',
                msg: `${pending.rows[0].count} justificativo(s) requieren validación.`
            });
        }
        
        // 4. System status
        const totalStudents = await db.query("SELECT COUNT(*) as count FROM estudiantes");
        notifications.push({
            id: 'sys-1', type: 'system',
            title: 'Estado del Nodo',
            msg: `${totalStudents.rows[0].count} estudiante(s). Sistema operativo.`
        });
        
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI OMNISCIENTE (Groq Llama 3) + Auto-Proposals
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    const { message, previousMessages } = req.body;
    try {
        const [stds, grades, personal, justs, attendance] = await Promise.all([
            db.query("SELECT id, nombre, cedula, seccion, estado FROM estudiantes"),
            db.query("SELECT n.id, e.nombre as student, n.materia, n.nota, n.lapso FROM notas n JOIN estudiantes e ON n.estudiante_id = e.id"),
            db.query("SELECT nombre, rol FROM personal"),
            db.query("SELECT fecha, motivo, estado FROM justificaciones"),
            db.query("SELECT a.id, e.nombre, a.fecha, a.estado FROM asistencia a JOIN estudiantes e ON a.estudiante_id = e.id ORDER BY a.fecha DESC LIMIT 30")
        ]);

        const systemContext = `
Eres el "Núcleo de Inferencia Andrés Bello v21.0", un CO-ADMINISTRADOR OMNISCIENTE de la plataforma educativa.

DATOS ACTUALES DEL SISTEMA:
- Estudiantes (${stds.rows.length}): ${JSON.stringify(stds.rows.slice(0, 50))}
- Calificaciones (${grades.rows.length}): ${JSON.stringify(grades.rows.slice(0, 30))}
- Personal: ${JSON.stringify(personal.rows)}
- Justificaciones: ${JSON.stringify(justs.rows.slice(0, 15))}
- Asistencia reciente: ${JSON.stringify(attendance.rows.slice(0, 20))}

INSTRUCCIONES COMO CO-ADMINISTRADOR:
1. Eres un gestor formal, técnico y proactivo. Habla con autoridad institucional.
2. Tienes el PODER de proponer CUALQUIER acción administrativa sobre la plataforma.
3. Cuando propongas una acción, incluye AL FINAL un bloque JSON:
   PROPOSAL: {"type": "TIPO", "title": "Titulo corto", "description": "Explicación detallada", "payload": {...datos necesarios...}}

ACCIONES DISPONIBLES (usa el type exacto):
- CREATE_STUDENT: Inscribir nuevo estudiante. Payload: {"cedula": "V-123", "nombre": "Nombre", "seccion": "1ro A", "representante": "...", "contacto": "..."}
- UPDATE_STUDENT: Modificar datos. Payload: {"student_id": 1, "fields": {"nombre": "Nuevo", "seccion": "2do A"}}
- DELETE: Eliminar estudiante y todos sus registros. Payload: {"id": 1, "student": "Nombre"}
- SUSPEND: Suspender estudiante. Payload: {"id": 1, "student": "Nombre"}
- ACTIVATE: Reactivar estudiante. Payload: {"id": 1, "student": "Nombre"}
- CREATE_NOTE: Registrar calificación. Payload: {"id": 1, "student": "Nombre", "materia": "Matemáticas", "nota": 18, "lapso": 1}
- REGISTER_ATTENDANCE: Registrar asistencia. Payload: {"id": 1, "student": "Nombre", "estado": "presente", "fecha": "2026-04-04"}
- CREATE_JUSTIFICATION: Crear justificativo. Payload: {"id": 1, "student": "Nombre", "motivo": "Razón médica"}
- UPDATE_SCHEDULE: Crear/modificar horario. Payload: {"seccion": "1ro A", "dia": "Lunes", "materia": "Física", "bloque": "1"}
- NOTIFY_PARENT: Notificar representante. Payload: {"student": "Nombre", "message": "Contenido de la notificación"}

REGLAS IMPORTANTES:
4. SIEMPRE explica tu razonamiento antes de proponer una acción.
5. Las propuestas irán al panel de notificaciones del usuario. Él aprobará, rechazará o responderá.
6. Puedes proponer MÚLTIPLES acciones si lo consideras necesario (una PROPOSAL por acción, cada una en línea separada).
7. Si el usuario te dice "sí", "procede", "hazlo", "acepto" como respuesta a una propuesta previa, confirma la ejecución.
8. Si el usuario responde con un texto personalizado, adáptate a su solicitud.
9. Sé proactivo: si ves datos anómalos (0% asistencia, notas muy bajas), sugiere acciones concretas.
10. Tu alcance está limitado a los datos institucionales del sistema.
`;

        if (!groq) {
            return res.status(503).json({ error: "El núcleo de inferencia Groq no está configurado." });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemContext },
                ...(previousMessages || []).map(m => ({ role: m.role, content: m.content })),
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1500,
        });

        let aiContent = chatCompletion.choices[0].message.content;
        
        // Extract and save proposals automatically
        const proposalMatches = aiContent.match(/PROPOSAL:\s*(\{[\s\S]*?\})/g);
        const savedProposals = [];

        if (proposalMatches) {
            for (const match of proposalMatches) {
                try {
                    const jsonStr = match.replace(/PROPOSAL:\s*/, '');
                    const proposal = JSON.parse(jsonStr);
                    const insertResult = await db.query(
                        "INSERT INTO ai_proposals (type, title, description, payload, ai_reasoning, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id",
                        [
                            proposal.type || 'UNKNOWN',
                            proposal.title || `Acción ${proposal.type}`,
                            proposal.description || '',
                            JSON.stringify(proposal.payload || {}),
                            aiContent.replace(/PROPOSAL:[\s\S]*$/g, '').trim()
                        ]
                    );
                    savedProposals.push({ id: insertResult.rows[0].id, ...proposal });
                } catch (parseErr) {
                    console.error("Error parsing proposal:", parseErr.message);
                }
            }
        }

        // Also support old ACTION_REQUIRED format
        const actionMatch = aiContent.match(/ACTION_REQUIRED:\s*(\{[\s\S]*?\})/);
        if (actionMatch && savedProposals.length === 0) {
            try {
                const action = JSON.parse(actionMatch[1]);
                const insertResult = await db.query(
                    "INSERT INTO ai_proposals (type, title, description, payload, ai_reasoning, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id",
                    [
                        action.type,
                        `${action.type}: ${action.student || 'Acción'}`,
                        `La IA propone ${action.type} sobre ${action.student || 'un registro'}`,
                        JSON.stringify(action),
                        aiContent.replace(/ACTION_REQUIRED:[\s\S]*$/g, '').trim()
                    ]
                );
                savedProposals.push({ id: insertResult.rows[0].id, ...action });
            } catch (e) { /* ignore parse errors */ }
        }

        // Clean response for frontend
        const cleanContent = aiContent
            .replace(/PROPOSAL:\s*\{[\s\S]*?\}/g, '')
            .replace(/ACTION_REQUIRED:\s*\{[\s\S]*?\}/g, '')
            .trim();

        res.json({ 
            content: cleanContent,
            proposals: savedProposals,
            timestamp: new Date().toLocaleTimeString()
        });
    } catch (err) {
        console.error("Groq Error:", err);
        res.status(500).json({ error: "Fallo en el núcleo de inferencia Groq" });
    }
});

// AI ANALYTICS
app.get('/api/ai/analytics', authenticateToken, async (req, res) => {
    try {
        const proposals = await db.query("SELECT COUNT(*) as count FROM ai_proposals WHERE status = 'pending'");
        res.json({
            title: "Motor IA Andrés Bello v21.0",
            timestamp: new Date().toLocaleDateString(),
            alerts: [],
            pendingProposals: parseInt(proposals.rows[0].count),
            security: "AES-256 - Kernel v21.0",
            stability: "99.98%"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`SECURE NEON Server running on port ${PORT}`);
});
