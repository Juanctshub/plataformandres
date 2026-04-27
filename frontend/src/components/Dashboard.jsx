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

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto py-6 sm:py-16 space-y-12 sm:space-y-24 px-4 sm:px-6"
    >
      {/* Welcome Header: Pure Apple Style */}
      <motion.div variants={item} className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
           <Badge className="bg-white/5 text-[#86868b] border border-white/5 rounded-full px-5 py-1.5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em]">
              Sincronización Neural v30.0
           </Badge>
        </div>
        
        <div className="space-y-4">
            <h2 className="text-5xl sm:text-8xl font-black tracking-tighter text-white italic uppercase leading-[0.9] sm:leading-none">
              Hola, <br className="sm:hidden" />
              <span className="text-blue-500">{user?.username || 'Control Maestro'}</span>
            </h2>
            <p className="text-base sm:text-2xl text-[#86868b] font-medium max-w-2xl leading-relaxed italic uppercase tracking-tight">
              Resumen estratégico del pulso académico institucional. El núcleo está <span className="text-emerald-400">totalmente operativo</span>.
            </p>
        </div>
      </motion.div>

      {/* Stats Grid: Elegant and Spaced */}
      <div className="grid gap-6 sm:gap-12 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item} 
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[3rem] p-8 sm:p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-start mb-10 sm:mb-16">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-2xl ${stat.color} border border-white/5`}>
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                   <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>
            
            <div className="space-y-2">
                <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-[#86868b] mb-2 sm:mb-4 opacity-60">{stat.label}</p>
                <div className="text-4xl sm:text-6xl font-black text-white italic leading-none tracking-tighter">
                    {stat.value}
                </div>
                <div className="flex items-center gap-3 mt-6 sm:mt-10">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] sm:text-[11px] text-[#86868b] font-black uppercase tracking-widest italic">
                        {stat.sub}
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Area: Mission Control Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
        <motion.div variants={item} className="lg:col-span-8 rounded-[4rem] p-10 sm:p-16 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 sm:mb-24 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl">
                    <Activity className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Monitoreo IA</h3>
                    <p className="text-[10px] sm:text-xs text-indigo-400 font-black uppercase tracking-[0.4em] mt-3 italic">Análisis Predictivo en Tiempo Real</p>
                 </div>
              </div>
              <Button 
                onClick={() => onTabChange('aianalytics')}
                className="bg-white text-black hover:bg-zinc-200 rounded-full px-10 h-14 text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
              >
                 Ver Analíticas Completas
              </Button>
           </div>

           <div className="space-y-8 relative z-10">
              {(aiData?.alerts && Array.isArray(aiData.alerts) && aiData.alerts.length > 0) ? (
                aiData.alerts.map((alert, i) => (
                   <div key={i} className="p-8 sm:p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 group hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-500">
                      <div className="flex items-center gap-8">
                         <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl ${alert.type === 'danger' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                            {alert.type === 'danger' ? <XCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">{alert.msg}</h4>
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <p className="text-[10px] sm:text-[11px] text-[#86868b] font-black uppercase tracking-[0.2em] italic">Protocolo Sugerido por IA</p>
                            </div>
                         </div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl self-end sm:self-auto">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                   </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-[#86868b] space-y-8 opacity-40 border-2 border-dashed border-white/10 rounded-[4rem] bg-white/[0.01]">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                      <ShieldCheck className="w-12 h-12" />
                   </div>
                   <div className="text-center space-y-3">
                      <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Núcleo Estable</h4>
                      <p className="text-[10px] font-black tracking-[0.4em] uppercase">Sistema en Condiciones Óptimas de Seguridad</p>
                   </div>
                </div>
              )}
           </div>

           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 rounded-[4rem] p-10 sm:p-16 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
           <div className="flex items-center gap-6 mb-16 sm:mb-20 border-b border-white/5 pb-10">
              <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 shadow-2xl">
                 <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Actividad</h3>
                <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.4em] mt-3 italic">Nodo Maestro de Logs</p>
              </div>
           </div>

           <div className="space-y-10 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
              {(stats?.recentActivity && Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0) ? (
                stats.recentActivity.map((log, i) => (
                    <div key={i} className="flex gap-8 group/item">
                      <div className="flex flex-col items-center gap-3 pt-2">
                         <div className={`w-3.5 h-3.5 rounded-full shadow-2xl transition-all duration-500 group-hover/item:scale-125 ${
                            log.type === 'STUDENT_REG' ? 'bg-emerald-500 shadow-emerald-500/60' :
                            log.type === 'JUSTIFICATION' ? 'bg-amber-500 shadow-amber-500/60' :
                            log.type === 'GRADE' ? 'bg-indigo-500 shadow-indigo-500/60' :
                            'bg-blue-500 shadow-blue-500/60'
                         }`} />
                         <div className="w-[1.5px] h-full bg-white/5 rounded-full" />
                      </div>
                      <div className="pb-10 flex-1">
                         <p className="text-lg font-bold text-white/90 leading-tight mb-2 group-hover/item:text-blue-400 transition-colors">{log.event}</p>
                         <div className="flex items-center gap-3">
                            <Clock className="w-3 h-3 text-[#86868b]/40" />
                            <span className="text-[10px] font-black text-[#86868b] tracking-widest uppercase opacity-60 italic">{log.time}</span>
                         </div>
                      </div>
                   </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-[#86868b] space-y-6 opacity-30">
                   <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center animate-pulse">
                      <Clock className="w-10 h-10" />
                   </div>
                   <span className="text-[11px] font-black tracking-[0.4em] uppercase text-center">Protocolo de Silencio:<br/>Sin Actividad Reciente</span>
                </div>
              )}
           </div>

           <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>
      </div>

      {/* Action Footnotes: Premium Row */}
      <motion.div variants={item} className="flex flex-col xl:flex-row xl:items-center gap-6 sm:gap-8 pt-16 border-t border-white/5">
         <div className="flex flex-wrap gap-4 sm:gap-6 flex-1">
             <Button 
                onClick={generateProReport}
                disabled={reportLoading}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl sm:rounded-3xl px-8 sm:px-10 h-16 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all flex gap-4 items-center shadow-xl disabled:opacity-50"
             >
                {reportLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5 text-blue-500" />}
                {reportLoading ? 'Procesando Inteligencia...' : 'Descargar Reporte Ejecutivo IA'}
             </Button>
             
             <Button 
                onClick={() => onTabChange('students')}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl sm:rounded-3xl px-8 sm:px-10 h-16 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all flex gap-4 items-center shadow-xl"
             >
                <UserPlus className="w-5 h-5 text-emerald-500" />
                Matriculación Instantánea
             </Button>

             <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileImport} disabled={importLoading} />
                <div className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl sm:rounded-3xl px-8 sm:px-10 h-16 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all flex gap-4 items-center shadow-xl">
                   {importLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-amber-500" />}
                   {importLoading ? 'Inyectando Datos...' : 'Carga Masiva (Excel/CSV)'}
                </div>
             </label>
         </div>

         {importMsg && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }} 
             className="px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest italic"
           >
             {importMsg}
           </motion.div>
         )}

         <div className="xl:ml-auto flex items-center gap-6 text-[#86868b] select-none opacity-40">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <Command className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Andrés Bello Kernel v30.0</span>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

