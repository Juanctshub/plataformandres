import { useState } from 'react';
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
import { Separator } from "./ui/separator";
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
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

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
    const fetchFinance = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') return;
        
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/finanzas/stats`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (res.ok) setFinanceStats(await res.json());
      } catch (e) { console.error("Finance fetch failed", e); }
    };
    fetchFinance();
  }, []);

  const statCards = [
    { label: 'Matrícula', value: stats.students || 0, sub: 'Estudiantes Activos', icon: Users, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Asistencia', value: stats.attendance && stats.attendance !== 'Sin datos' ? stats.attendance : '0%', sub: 'Presencialidad Promedio', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'Recaudación', value: `$${financeStats.total_revenue?.toLocaleString()}`, sub: `Solvencia: ${financeStats.solvency_rate}`, icon: TrendingUp, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Justificativos', value: stats.justifications || 0, sub: 'Pendientes de Firma', icon: Clock, color: 'bg-indigo-500/10 text-indigo-400' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="space-y-6">
        <div className="flex items-center gap-3">
           <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-4 py-1 text-[10px] font-semibold uppercase tracking-widest">
              Sesión Iniciada v20.0
           </Badge>
        </div>
        <h2 className="text-6xl font-semibold tracking-tight text-white leading-tight">
          Hola, <span className="text-[#86868b]">Control de Gestión</span>
        </h2>
        <p className="text-xl text-[#86868b] font-medium max-w-2xl leading-relaxed">
          Bienvenido al centro operativo de la Unidad Educativa Andrés Bello. Aquí tienes un resumen del pulso académico institucional.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            className="apple-card group"
          >
            <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white transition-all">
                   <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b] mb-2">{stat.label}</p>
                <div className="text-4xl font-semibold text-white tracking-tight">
                    {stat.value}
                </div>
                <p className="text-xs text-[#86868b] mt-4 font-medium">
                    {stat.sub}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={item} className="lg:col-span-8 apple-card">
           <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Activity className="w-5 h-5" />
                 </div>
                 <h3 className="text-2xl font-semibold text-white tracking-tight">Monitoreo IA</h3>
              </div>
              <Button 
                onClick={() => onTabChange('analytics')}
                className="bg-white/5 hover:bg-white/10 text-white rounded-full px-6 py-2 text-xs font-semibold transition-all"
              >
                 Ver Analíticas Completas
              </Button>
           </div>

           <div className="space-y-6">
              {(aiData?.alerts && Array.isArray(aiData.alerts) && aiData.alerts.length > 0) ? (
                aiData.alerts.map((alert, i) => (
                   <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-6">
                         <div className={`p-3 rounded-2xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {alert.type === 'danger' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                         </div>
                         <div>
                            <h4 className="text-base font-semibold text-white tracking-tight">{alert.msg}</h4>
                            <p className="text-xs text-[#86868b] mt-1 font-medium italic">Acción sugerida por el motor predictivo</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all -translate-x-2 group-hover:translate-x-0" />
                   </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-[#86868b] space-y-6 opacity-30 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <ShieldCheck className="w-12 h-12" />
                   <p className="text-sm font-semibold tracking-widest uppercase">Sistema en Condiciones Óptimas</p>
                </div>
              )}
           </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 apple-card">
           <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                 <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">Actividad</h3>
           </div>

           <div className="space-y-8">
              {(stats?.recentActivity && Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0) ? (
                stats.recentActivity.map((log, i) => (
                   <div key={i} className="flex gap-5 group">
                     <div className="flex flex-col items-center gap-2 pt-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <div className="w-[1.5px] h-full bg-white/5 rounded-full" />
                     </div>
                     <div className="pb-8">
                        <p className="text-sm font-medium text-white/90 leading-relaxed mb-1">{log.event}</p>
                        <span className="text-[10px] font-semibold text-[#86868b] tracking-wider uppercase">{log.time}</span>
                     </div>
                  </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-[#86868b] space-y-4 opacity-10">
                   <Activity className="w-12 h-12" />
                   <span className="text-xs font-semibold tracking-widest uppercase">Sin Actividad Reciente</span>
                </div>
              )}
           </div>
        </motion.div>
      </div>

      {/* Action Footnotes */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-6 pt-10">
         <Button 
            onClick={generateProReport}
            disabled={reportLoading}
            className="apple-glass hover:bg-white/5 text-white/80 rounded-full px-8 h-12 flex gap-3 text-xs font-semibold transition-all border border-white/5 disabled:opacity-50"
         >
            {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {reportLoading ? 'Generando con IA...' : 'Descargar Reporte Pro'}
         </Button>
         <Button 
            onClick={() => onTabChange('students')}
            className="apple-glass hover:bg-white/5 text-white/80 rounded-full px-8 h-12 flex gap-3 text-xs font-semibold transition-all border border-white/5"
         >
            <UserPlus className="w-4 h-4" />
            Nuevo Registro Estudiantil
         </Button>

         {/* File Import */}
         <label className="cursor-pointer">
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileImport} disabled={importLoading} />
            <div className="apple-glass hover:bg-white/5 text-white/80 rounded-full px-8 h-12 flex gap-3 text-xs font-semibold transition-all border border-white/5 items-center">
               {importLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               {importLoading ? 'Importando...' : 'Importar Datos (Excel/CSV)'}
            </div>
         </label>

         {importMsg && (
           <motion.span 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             className="text-xs font-semibold text-emerald-400"
           >
             {importMsg}
           </motion.span>
         )}

         <div className="ml-auto flex items-center gap-4 text-[#86868b] select-none opacity-20">
            <Command className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Protocolo Andrés Bello 2026</span>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
