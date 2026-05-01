import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Activity,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  ChevronRight,
  ArrowUpRight,
  LayoutGrid,
  Clock,
  Settings as SettingsIcon,
  Sparkles,
  Printer,
  UserPlus,
  Plus,
  Command,
  ArrowRight,
  Loader2,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { AreaChart, Area, ResponsiveContainer, Tooltip as ReTooltip, XAxis } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Dashboard = ({ stats, aiData, onTabChange }) => {
  const [reportLoading, setReportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } } };



  // ─── REPORTE PRO CON IA ───
  const generateProReport = async () => {
    setReportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch ALL real data in parallel
      const [resStd, resNotas, resAtt, resJust, resPersonal, resAttStats] = await Promise.all([
        fetch(`${baseUrl}/api/estudiantes`, { headers }),
        fetch(`${baseUrl}/api/notas`, { headers }),
        fetch(`${baseUrl}/api/asistencia`, { headers }),
        fetch(`${baseUrl}/api/justificaciones`, { headers }),
        fetch(`${baseUrl}/api/personal`, { headers }),
        fetch(`${baseUrl}/api/asistencia/stats`, { headers })
      ]);

      const students = resStd.ok ? await resStd.json() : [];
      const notas = resNotas.ok ? await resNotas.json() : [];
      const asistencia = resAtt.ok ? await resAtt.json() : [];
      const justificaciones = resJust.ok ? await resJust.json() : [];
      const personal = resPersonal.ok ? await resPersonal.json() : [];
      const attStats = resAttStats.ok ? await resAttStats.json() : { percentage: 'N/D', total: 0, present: 0 };

      // Ask AI for analysis summary
      let aiSummary = '';
      try {
        const financeRes = await fetch(`${baseUrl}/api/finanzas/stats`, { headers });
        const fin = financeRes.ok ? await financeRes.json() : {};
        
        const aiRes = await fetch(`${baseUrl}/api/ai/chat`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Genera un análisis ejecutivo breve (máximo 5 oraciones) del estado de la institución con estos datos: ${students.length} estudiantes, ${personal.length} personal, asistencia global ${attStats.percentage}, recaudación total $${fin.total_revenue}, tasa de solvencia ${fin.solvency_rate}. Sé directo, profesional y destaca si hay riesgos financieros o de ausentismo.`,
            previousMessages: []
          })
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          aiSummary = aiData.content?.replace(/ACTION_REQUIRED:.*$/gm, '').trim() || '';
        }
      } catch (e) { aiSummary = 'Análisis IA no disponible en este momento.'; }

      // ─── GENERATE PDF ───
      const doc = new jsPDF('p', 'mm', 'a4');
      const date = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
      const time = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
      const pageW = doc.internal.pageSize.getWidth();

      // ─── PAGE 1: COVER ───
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, pageW, 297, 'F');
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageW, 5, 'F');
      
      doc.setFontSize(36);
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE', 20, 80);
      doc.text('INSTITUCIONAL', 20, 96);
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 120);
      doc.text('PRO', 20, 108);
      
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 100);
      doc.text(`Unidad Educativa Andrés Bello`, 20, 135);
      doc.text(`Fecha: ${date}`, 20, 142);
      doc.text(`Hora: ${time}`, 20, 149);
      doc.text(`Generado por: Núcleo de Inferencia v20.0`, 20, 156);
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      doc.text('Documento generado automáticamente. Información confidencial.', 20, 280);

      // ─── PAGE 2: RESUMEN EJECUTIVO ───
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, 297, 'F');
      
      doc.setFontSize(20);
      doc.setTextColor(20, 20, 30);
      doc.text('Resumen Ejecutivo', 20, 25);
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(20, 30, 80, 30);

      // Stats boxes
      const statsData = [
        { label: 'Estudiantes', value: String(students.length) },
        { label: 'Personal', value: String(personal.length) },
        { label: 'Asistencia', value: attStats.percentage },
        { label: 'Suspendidos', value: String(students.filter(s => s.estado === 'suspendido').length) },
        { label: 'Just. Pendientes', value: String(justificaciones.filter(j => j.estado === 'pendiente').length) },
        { label: 'Calificaciones', value: String(notas.length) }
      ];

      statsData.forEach((s, i) => {
        const x = 20 + (i % 3) * 58;
        const y = 42 + Math.floor(i / 3) * 30;
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(x, y, 52, 24, 3, 3, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 120);
        doc.text(s.label, x + 6, y + 9);
        doc.setFontSize(16);
        doc.setTextColor(20, 20, 30);
        doc.text(s.value, x + 6, y + 20);
      });

      // AI Analysis
      if (aiSummary) {
        doc.setFontSize(12);
        doc.setTextColor(20, 20, 30);
        doc.text('Análisis del Núcleo de Inferencia', 20, 110);
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 80);
        const splitAi = doc.splitTextToSize(aiSummary, pageW - 40);
        doc.text(splitAi, 20, 118);
      }

      // ─── PAGE 3: MATRÍCULA ESTUDIANTIL ───
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(20, 20, 30);
      doc.text('Matrícula Estudiantil', 20, 25);
      doc.setDrawColor(37, 99, 235);
      doc.line(20, 30, 80, 30);

      if (students.length > 0) {
        doc.autoTable({
          startY: 38,
          head: [['#', 'Cédula', 'Nombre', 'Sección', 'Representante', 'Estado']],
          body: students.map((s, i) => [
            i + 1,
            s.cedula || 'N/D',
            s.nombre || 'N/D',
            s.seccion || 'N/D',
            s.representante || 'N/D',
            (s.estado || 'activo').toUpperCase()
          ]),
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8, fontStyle: 'bold' },
          bodyStyles: { fontSize: 7.5, textColor: [40, 40, 50] },
          alternateRowStyles: { fillColor: [248, 248, 252] },
          styles: { cellPadding: 3 },
          margin: { left: 20, right: 20 }
        });

        // Students by section
        const sections = {};
        students.forEach(s => {
          const sec = s.seccion || 'Sin Sección';
          sections[sec] = (sections[sec] || 0) + 1;
        });

        const lastY = doc.lastAutoTable?.finalY || 200;
        if (lastY < 240) {
          doc.setFontSize(11);
          doc.setTextColor(20, 20, 30);
          doc.text('Distribución por Sección', 20, lastY + 15);
          doc.autoTable({
            startY: lastY + 20,
            head: [['Sección', 'Cantidad', '% del Total']],
            body: Object.entries(sections).map(([sec, count]) => [
              sec,
              count,
              ((count / students.length) * 100).toFixed(1) + '%'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 20, right: 20 }
          });
        }
      }

      // ─── PAGE 4: CALIFICACIONES ───
      if (notas.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 30);
        doc.text('Registro de Calificaciones', 20, 25);
        doc.setDrawColor(37, 99, 235);
        doc.line(20, 30, 80, 30);

        doc.autoTable({
          startY: 38,
          head: [['Estudiante', 'Materia', 'Nota', 'Lapso', 'Fecha']],
          body: notas.slice(0, 50).map(n => [
            n.student || 'N/D',
            n.subject || 'N/D',
            n.grade != null ? String(n.grade) : 'N/D',
            n.lapso || '1',
            n.fecha || 'N/D'
          ]),
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 7.5 },
          alternateRowStyles: { fillColor: [248, 248, 252] },
          margin: { left: 20, right: 20 }
        });

        // Grade averages by subject
        const subjects = {};
        notas.forEach(n => {
          if (!n.subject || n.grade == null) return;
          if (!subjects[n.subject]) subjects[n.subject] = { total: 0, count: 0 };
          subjects[n.subject].total += Number(n.grade);
          subjects[n.subject].count++;
        });

        const lastY = doc.lastAutoTable?.finalY || 200;
        if (lastY < 240 && Object.keys(subjects).length > 0) {
          doc.setFontSize(11);
          doc.setTextColor(20, 20, 30);
          doc.text('Promedio por Materia', 20, lastY + 15);
          doc.autoTable({
            startY: lastY + 20,
            head: [['Materia', 'Promedio', 'Total Registros']],
            body: Object.entries(subjects).map(([sub, data]) => [
              sub,
              (data.total / data.count).toFixed(1),
              data.count
            ]),
            theme: 'grid',
            headStyles: { fillColor: [245, 158, 11], textColor: 255, fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 20, right: 20 }
          });
        }
      }

      // ─── PAGE 5: ASISTENCIA ───
      if (asistencia.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 30);
        doc.text('Registro de Asistencia', 20, 25);
        doc.setDrawColor(37, 99, 235);
        doc.line(20, 30, 80, 30);

        // Summary table
        const attByStatus = { presente: 0, ausente: 0, tardanza: 0 };
        asistencia.forEach(a => { attByStatus[a.estado] = (attByStatus[a.estado] || 0) + 1; });

        doc.autoTable({
          startY: 38,
          head: [['Estado', 'Cantidad', '% del Total']],
          body: Object.entries(attByStatus).map(([status, count]) => [
            status.toUpperCase(),
            count,
            ((count / asistencia.length) * 100).toFixed(1) + '%'
          ]),
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 20, right: 20 }
        });

        // Detail table
        const attY = doc.lastAutoTable?.finalY || 80;
        doc.autoTable({
          startY: attY + 10,
          head: [['Estudiante', 'Sección', 'Fecha', 'Estado', 'Observación']],
          body: asistencia.slice(0, 60).map(a => [
            a.nombre || 'N/D',
            a.seccion || 'N/D',
            a.fecha || 'N/D',
            (a.estado || '').toUpperCase(),
            a.observacion || '-'
          ]),
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 7.5 },
          bodyStyles: { fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 248, 252] },
          margin: { left: 20, right: 20 }
        });
      }

      // ─── PAGE 6: JUSTIFICACIONES ───
      if (justificaciones.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 30);
        doc.text('Justificaciones', 20, 25);
        doc.setDrawColor(37, 99, 235);
        doc.line(20, 30, 80, 30);

        doc.autoTable({
          startY: 38,
          head: [['Estudiante', 'Sección', 'Fecha', 'Motivo', 'Estado']],
          body: justificaciones.map(j => [
            j.nombre || 'N/D',
            j.seccion || 'N/D',
            j.fecha || 'N/D',
            j.motivo || 'N/D',
            (j.estado || '').toUpperCase()
          ]),
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 7.5 },
          alternateRowStyles: { fillColor: [248, 248, 252] },
          margin: { left: 20, right: 20 }
        });
      }

      // ─── PAGE 7: PERSONAL ───
      if (personal.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 30);
        doc.text('Personal Institucional', 20, 25);
        doc.setDrawColor(37, 99, 235);
        doc.line(20, 30, 80, 30);

        doc.autoTable({
          startY: 38,
          head: [['Nombre', 'Cargo', 'Email', 'Contacto']],
          body: personal.map(p => [
            p.nombre || 'N/D',
            p.rol || 'N/D',
            p.email || 'N/D',
            p.contacto || 'N/D'
          ]),
          theme: 'grid',
          headStyles: { fillColor: [107, 114, 128], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 20, right: 20 }
        });
      }

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 160);
        doc.text(`U.E. Andrés Bello — Reporte Pro — Pág. ${i}/${totalPages}`, 20, 290);
        doc.text(`Generado: ${date} ${time}`, pageW - 80, 290);
      }

      doc.save(`Reporte_Pro_AndresBello_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Report Error:', err);
      alert('Error al generar el reporte. Verifica tu conexión.');
    } finally {
      setReportLoading(false);
    }
  };

  // ─── IMPORTAR ARCHIVOS (EXCEL/CSV) ───
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportLoading(true);
    setImportMsg('');
    
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws);
          
          const token = localStorage.getItem('token');
          const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
          let success = 0, failed = 0;
          
          for (const row of data) {
            // Normalize: try ALL common column name variations
            const keys = Object.keys(row);
            const findCol = (...names) => {
              for (const n of names) {
                // Exact match first
                if (row[n] !== undefined && row[n] !== null && String(row[n]).trim() !== '') return String(row[n]).trim();
              }
              // Case-insensitive / partial match
              for (const k of keys) {
                const kl = k.toLowerCase().replace(/[_\s-]/g, '');
                for (const n of names) {
                  const nl = n.toLowerCase().replace(/[_\s-]/g, '');
                  if (kl === nl || kl.includes(nl) || nl.includes(kl)) {
                    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
                  }
                }
              }
              return '';
            };

            const payload = {
              nombre: findCol('Nombre_Completo', 'NombreCompleto', 'Nombre', 'nombre', 'NOMBRE', 'Name', 'name', 'Alumno', 'Estudiante', 'STUDENT', 'Student', 'Apellido_Nombre'),
              cedula: findCol('Identidad', 'Cedula', 'cedula', 'CEDULA', 'CI', 'ci', 'ID', 'id', 'Numero_Cedula', 'DNI', 'Documento', 'V', 'Cédula'),
              seccion: findCol('Seccion', 'seccion', 'SECCION', 'Sección', 'Grado', 'grado', 'GRADO', 'Grade', 'Año', 'Curso', 'Nivel', 'Section'),
              representante: findCol('Representante', 'representante', 'REPRESENTANTE', 'Padre', 'Madre', 'Tutor', 'Acudiente', 'Parent'),
              contacto: findCol('Contacto', 'contacto', 'CONTACTO', 'Telefono', 'telefono', 'Phone', 'Celular', 'Movil', 'Tel')
            };
            
            console.log('Importing row:', payload);
            if (!payload.nombre || !payload.cedula || !payload.seccion) { failed++; continue; }
            try {
              const res = await fetch(`${baseUrl}/api/estudiantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
              });
              if (res.ok) success++; else failed++;
            } catch { failed++; }
          }
          setImportMsg(`✅ ${success} registrados, ${failed} omitidos de ${data.length} filas.`);
        } catch (err) {
          setImportMsg('❌ Error al procesar archivo. Verifica el formato.');
        } finally {
          setImportLoading(false);
          e.target.value = '';
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setImportMsg('⚠️ Formato no soportado. Usa archivos .xlsx, .xls o .csv');
      setImportLoading(false);
      e.target.value = '';
    }
  };

  const [financeStats, setFinanceStats] = useState({ total_revenue: 0, solvency_rate: '0%' });

  useEffect(() => {
    if (importMsg) {
      const timer = setTimeout(() => setImportMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [importMsg]);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const token = localStorage.getItem('token');
        let user = {};
        try {
          const stored = localStorage.getItem('user');
          user = stored && stored !== 'undefined' ? JSON.parse(stored) : {};
        } catch (e) { user = {}; }
        
        if (user.role !== 'admin') return;
        
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/finanzas/stats`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (res.ok) {
          const data = await res.json();
          if (data) setFinanceStats(data);
        }
      } catch (e) { console.error("Finance fetch failed", e); }
    };
    fetchFinance();
  }, []);

  const statCards = [
    { label: 'Matrícula', value: (stats?.students || stats?.totalStudents) || 0, sub: 'Estudiantes Activos', icon: Users, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Asistencia', value: stats?.attendance && stats?.attendance !== 'Sin datos' ? stats.attendance : '0%', sub: 'Presencialidad Promedio', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'Recaudación', value: `$${(financeStats?.total_revenue || 0).toLocaleString()}`, sub: `Solvencia: ${financeStats?.solvency_rate || '0%'}`, icon: TrendingUp, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Justificativos', value: stats?.justifications || 0, sub: 'Pendientes de Firma', icon: Clock, color: 'bg-indigo-500/10 text-indigo-400' },
  ];

  const getSafeUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return { username: 'Control Maestro' };
      return JSON.parse(stored);
    } catch (e) {
      return { username: 'Control Maestro' };
    }
  };

  const user = getSafeUser();

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto py-6 sm:py-12 space-y-8 px-4 sm:px-6"
    >
      {/* ═══ Header ═══ */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mb-1">Bienvenido de vuelta</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight italic">
            {user?.username || 'Administrador'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Sistema operativo</span>
        </div>
      </motion.div>

      {/* ═══ Import Message ═══ */}
      <AnimatePresence>
        {importMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 font-medium"
          >
            {importMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Stat Cards ═══ */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="stat-card apple-glass border-white/10 rounded-[2rem] group cursor-pointer shadow-lg hover:shadow-blue-500/10 transition-all hover:-translate-y-1" onClick={() => {
            if (stat.label === 'Matrícula') onTabChange('students');
            if (stat.label === 'Asistencia') onTabChange('attendance');
            if (stat.label === 'Justificativos') onTabChange('justifications');
          }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight italic">{stat.value}</div>
              <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-2">{stat.label}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ═══ Main Grid: Chart + Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Card */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="section-card apple-glass border-white/10 rounded-[3rem] overflow-hidden p-2 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white italic tracking-tight">Tendencia Semanal</h3>
                  <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-1">Asistencia promedio por día</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-medium">
                  En vivo
                </Badge>
              </div>
              <div className="h-[220px]">
                {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && stats.weeklyTrend.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.weeklyTrend}>
                      <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                      <ReTooltip 
                        contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px', color: '#fff' }}
                        labelStyle={{ color: '#a1a1aa' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAttendance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#86868b] space-y-3">
                    <Activity className="w-8 h-8 opacity-20" />
                    <span className="text-[11px] font-bold uppercase tracking-widest italic opacity-50">Sin suficientes datos</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <Card className="section-card apple-glass border-white/10 rounded-[3rem] h-full shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white italic tracking-tight">Actividad reciente</h3>
                <Clock className="w-5 h-5 text-white/40" />
              </div>
              <div className="space-y-4 max-h-[260px] overflow-y-auto no-scrollbar">
                {(stats?.recentActivity && Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0) ? (
                  stats.recentActivity.map((log, i) => (
                    <div key={i} className="flex gap-3 group">
                      <div className="flex flex-col items-center pt-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          log.type === 'STUDENT_REG' ? 'bg-emerald-500' :
                          log.type === 'JUSTIFICATION' ? 'bg-amber-500' :
                          log.type === 'GRADE' ? 'bg-indigo-500' :
                          'bg-blue-500'
                        }`} />
                        {i < (stats.recentActivity.length - 1) && <div className="w-px h-full bg-white/5 mt-1" />}
                      </div>
                      <div className="pb-5 flex-1 min-w-0 ml-2">
                        <p className="text-sm font-semibold text-white/90 leading-snug truncate">{log.event}</p>
                        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">{log.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center text-muted-foreground space-y-2">
                    <Clock className="w-6 h-6 opacity-30" />
                    <span className="text-xs">Sin actividad reciente</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══ AI Monitoring ═══ */}
      <motion.div variants={item}>
        <Card className="section-card apple-glass border-white/10 rounded-[3rem] p-2 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[1rem] bg-indigo-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic tracking-tight">Alertas IA</h3>
                  <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-1">Análisis predictivo</p>
                </div>
              </div>
              <Button 
                onClick={() => onTabChange('aianalytics')}
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-white h-8 px-3"
              >
                Ver todo <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {(aiData?.alerts && Array.isArray(aiData.alerts) && aiData.alerts.length > 0) ? (
                aiData.alerts.slice(0, 3).map((alert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {alert.type === 'danger' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <p className="text-sm text-white/80 flex-1 truncate">{alert.msg}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="py-8 flex flex-col items-center text-muted-foreground space-y-2">
                  <ShieldCheck className="w-6 h-6 opacity-30" />
                  <span className="text-xs">Todo en orden — sin alertas activas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ Quick Actions ═══ */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-4 mt-4">
        <Button 
          onClick={generateProReport}
          disabled={reportLoading}
          variant="outline"
          className="h-12 px-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest bg-transparent border-white/10 text-[#86868b] hover:text-white hover:bg-white/5 transition-all shadow-lg"
        >
          {reportLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Printer className="w-4 h-4 mr-2" />}
          Reporte IA
        </Button>
        
        <Button 
          onClick={() => onTabChange('students')}
          variant="outline"
          className="h-12 px-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest bg-transparent border-white/10 text-[#86868b] hover:text-white hover:bg-white/5 transition-all shadow-lg"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Nueva admisión
        </Button>

        <label className="cursor-pointer">
          <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileImport} disabled={importLoading} />
          <div className="h-12 px-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest bg-transparent border border-white/10 text-[#86868b] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all shadow-lg">
            {importLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importar Excel
          </div>
        </label>

        <div className="ml-auto hidden sm:flex items-center gap-2 text-muted-foreground/40">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="text-[10px] font-medium">Andrés Bello v30</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
