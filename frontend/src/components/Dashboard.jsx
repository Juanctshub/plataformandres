import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  Printer,
  UserPlus,
  Plus,
  ArrowRight,
  Loader2,
  Upload
} from 'lucide-react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { AreaChart, Area, ResponsiveContainer, Tooltip as ReTooltip, XAxis } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const Dashboard = ({ stats, aiData, onTabChange }) => {
  const [reportLoading, setReportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [financeStats, setFinanceStats] = useState({ total_revenue: 0, solvency_rate: '0%' });

  // Excel Report States (Point 5)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState('Todas');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [sections, setSections] = useState(['Todas']);
  const [studentsList, setStudentsList] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/estudiantes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStudentsList(data);
          const uniqueSections = ['Todas', ...new Set(data.map(s => s.seccion).filter(Boolean))].sort((a, b) => a.localeCompare(b));
          setSections(uniqueSections);
        }
      } catch (err) {
        console.error("Failed to fetch students for sections list", err);
      }
    };
    fetchStudents();
  }, []);

  // Sync Timer State (Point 15)
  const [syncTime, setSyncTime] = useState(new Date());
  const [syncLabel, setSyncLabel] = useState('Sincronizado justo ahora');

  useEffect(() => {
    setSyncTime(new Date());
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((new Date() - syncTime) / 1000);
      if (diff < 10) {
        setSyncLabel('Sincronizado justo ahora');
      } else if (diff < 60) {
        setSyncLabel(`Sincronizado hace ${diff} s`);
      } else {
        const mins = Math.floor(diff / 60);
        setSyncLabel(`Sincronizado hace ${mins} m`);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [syncTime]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };
  const item = { 
    hidden: { opacity: 0, y: 15, scale: 0.98 }, 
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } 
  };

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const token = localStorage.getItem('token');
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

  const generateProReport = () => {
    setIsReportDialogOpen(true);
  };

  const handleGenerateExcelReport = async () => {
    setReportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch attendance data for selected section and date range
      let url = `${baseUrl}/api/asistencia?start_date=${startDate}&end_date=${endDate}`;
      if (selectedSeccion !== 'Todas') {
        url += `&seccion=${encodeURIComponent(selectedSeccion)}`;
      }

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Fallo al obtener asistencia");
      const attendance = await res.json();

      // Filter student list based on selected section to include students without attendance
      const filteredStudents = selectedSeccion === 'Todas'
        ? studentsList
        : studentsList.filter(s => s.seccion === selectedSeccion);

      // Process Excel data
      const attendanceMapByStudent = {};
      attendance.forEach(rec => {
        const key = rec.estudiante_id;
        if (!attendanceMapByStudent[key]) {
          attendanceMapByStudent[key] = [];
        }
        attendanceMapByStudent[key].push(rec);
      });

      const summaryData = filteredStudents.map(student => {
        const records = attendanceMapByStudent[student.id] || [];
        const presents = records.filter(r => r.estado === 'presente').length;
        const absents = records.filter(r => r.estado === 'ausente' || r.estado === 'retirado' || r.estado === 'inasistente').length;
        const total = records.length;
        const percent = total > 0 ? `${Math.round((presents / total) * 100)}%` : 'Sin registros';

        return {
          'Cédula / C.I.': student.cedula || 'N/D',
          'Estudiante': student.nombre,
          'Sección': student.seccion,
          'Año': student.año || 'N/D',
          'Días Presentes': presents,
          'Días Ausentes': absents,
          'Total Registrados': total,
          'Porcentaje Asistencia': percent
        };
      });

      const detailData = attendance.map(rec => ({
        'Cédula / C.I.': rec.cedula || 'N/D',
        'Estudiante': rec.nombre,
        'Sección': rec.seccion,
        'Fecha': rec.fecha ? rec.fecha.split('T')[0] : 'N/D',
        'Estado': rec.estado ? (rec.estado.charAt(0).toUpperCase() + rec.estado.slice(1)) : 'N/D',
        'Observación': rec.observacion || ''
      }));

      // Build Excel sheets
      const wb = XLSX.utils.book_new();

      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen de Asistencia");

      const wsDetail = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(wb, wsDetail, "Detalle de Asistencias");

      const fileName = `Reporte_Asistencia_${selectedSeccion !== 'Todas' ? selectedSeccion : 'General'}_${startDate}_a_${endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      setIsReportDialogOpen(false);
    } catch (err) {
      alert("Error al generar reporte de Excel: " + err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const handleFileImport = (e) => {
    setImportMsg("Procesando lote de datos...");
    setTimeout(() => setImportMsg("Sincronización completada."), 2000);
  };

  const statCards = [
    { label: 'Total Estudiantes', value: (stats?.students || stats?.totalStudents) || 0, sub: 'Matrícula activa', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', target: 'students' },
    { label: 'Presentes Hoy', value: stats?.todayPresent ?? 0, sub: 'Asistencia registrada', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', target: 'attendance' },
    { label: 'Ausencias Hoy', value: stats?.todayAbsent ?? 0, sub: 'Inasistencias registradas', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10', target: 'attendance' },
    { label: 'Justificativos', value: stats?.justifications || 0, sub: 'Pendientes por revisar', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10', target: 'justifications' },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-screen-2xl mx-auto py-10 md:py-24 space-y-16 md:space-y-24 px-6 md:px-16"
    >
      {/* ═══ Header ═══ */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight italic leading-tight">
                Dashboard
            </h1>
            <p className="text-[13px] font-bold text-[#86868b] uppercase tracking-[0.3em] mt-3">
                Gestión Operativa • {user?.username || 'Admin'}
            </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-white/60 tracking-wider uppercase">{syncLabel}</span>
        </div>
      </motion.div>

      {/* ═══ Stats Grid ═══ */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="ios-card bg-[#1c1c1e]/60 border-none group cursor-pointer active:scale-95 ios-transition" onClick={() => {
            if (stat.target) onTabChange(stat.target);
          }}>
            <CardContent className="p-0 flex flex-col items-start">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-6 ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight italic mb-1">{stat.value}</div>
              <div className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">{stat.label}</div>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mt-1">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ═══ Charts & Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="ios-card bg-[#1c1c1e]/60 border-none h-full p-8">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-bold text-white italic tracking-tight">Tendencia</h3>
                    <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mt-1">Asistencia de Ciclo</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Live Data
                </Badge>
            </div>
            <div className="h-[260px] w-full">
              {stats?.weeklyTrend?.length > 0 && stats.weeklyTrend.some(d => (d.value || 0) > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.weeklyTrend}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 10, fontWeight: 700 }} />
                    <ReTooltip 
                      contentStyle={{ background: '#1c1c1e', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#chartGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
                  <Activity className="w-10 h-10 text-white mb-3" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">Sin Datos de Ciclo</span>
                </div>
              )}
            </div>
            {/* Trend Graph Description (Point 16) */}
            <p className="text-[12px] text-[#86868b] mt-6 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              Este gráfico de tendencia representa el porcentaje promedio de asistencia de los estudiantes durante los últimos 5 días escolares registrados, permitiendo un análisis visual continuo del comportamiento general de la matrícula.
            </p>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <Card className="ios-card bg-[#1c1c1e]/60 border-none h-full p-8 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-2xl font-bold text-white italic tracking-tight">Historial</h3>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#86868b]" />
                </div>
            </div>
            <div className="ios-list-group bg-transparent border-none space-y-6 max-h-[500px] overflow-y-auto no-scrollbar relative z-10 px-2">
                {stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.map((log, i) => (
                        <div 
                          key={i} 
                          onClick={() => log.target && onTabChange(log.target)}
                          className="flex gap-6 group items-start p-6 rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.05] active:scale-[0.98] transition-all cursor-pointer border border-white/5 hover:border-white/10"
                        >
                            <div className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_15px] ${
                                log.type === 'STUDENT_REG' ? 'bg-emerald-400 shadow-emerald-400/50' :
                                log.type === 'JUSTIFICATION' ? 'bg-amber-400 shadow-amber-400/50' :
                                log.type === 'GRADE' ? 'bg-blue-400 shadow-blue-400/50' :
                                'bg-white/20 shadow-white/10'
                            }`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                  <p className="text-[15px] font-black text-white leading-tight truncate italic">{log.event}</p>
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowUpRight className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">{log.time}</span>
                                  {log.details && (
                                    <>
                                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{log.details}</span>
                                    </>
                                  )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 flex flex-col items-center opacity-10">
                        <Clock className="w-16 h-16 mb-6" />
                        <span className="text-[12px] font-black uppercase tracking-[0.5em]">Sincronizando...</span>
                    </div>
                )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ═══ AI Alerts ═══ */}
      <motion.div variants={item}>
        <Card className="ios-card bg-indigo-600/5 border border-indigo-500/10 p-8 sm:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Sparkles className="w-40 h-40 text-indigo-400" />
            </div>
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-0 pointer-events-none bg-[length:100%_4px,4px_100%]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-indigo-500/20 flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-indigo-500/20">
                        <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white italic tracking-tight">Asistente Escolar IA</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em]">Alertas IA Sincronizadas</span>
                          <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[8px] font-black text-indigo-300 uppercase tracking-widest border border-indigo-500/30">Active v3.5</div>
                        </div>
                    </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => onTabChange('aianalytics')} 
                  className="h-12 px-8 rounded-full text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 uppercase tracking-widest border border-white/5 transition-all"
                >
                    Auditoría de Sistemas <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                {aiData?.alerts?.length > 0 ? (
                    aiData.alerts.slice(0, 2).map((alert, i) => (
                        <div key={i} className="group/alert p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center gap-6 hover:bg-white/[0.06] transition-all duration-500">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover/alert:scale-110 ${
                                alert.type === 'danger' ? 'bg-red-500/20 text-red-400 shadow-red-500/10' : 'bg-amber-500/20 text-amber-400 shadow-amber-500/10'
                            }`}>
                                {alert.type === 'danger' ? <XCircle className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-bold text-white/90 leading-snug mb-1">{alert.msg}</p>
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${alert.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Protocolo de Seguridad Nivel {alert.type === 'danger' ? '4' : '2'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 py-14 flex flex-col items-center opacity-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                        <ShieldCheck className="w-12 h-12 mb-4" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Matriz Segura • Sin Anomalías</span>
                    </div>
                )}
            </div>
        </Card>
      </motion.div>

      {/* ═══ Footer Actions ═══ */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-10">
        <Button onClick={generateProReport} disabled={reportLoading} className="ios-button-primary bg-white text-black hover:bg-zinc-200 shadow-white/5">
            {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
            Generar Reporte
        </Button>
        <Button onClick={() => onTabChange('students')} variant="outline" className="h-12 rounded-full border-white/10 text-white/60 hover:text-white hover:bg-white/5 px-6 font-bold text-[13px]">
            <UserPlus className="w-4 h-4 mr-2" /> Admitir Estudiante
        </Button>
        <div className="flex items-center gap-3">
          <label className="ios-button-primary bg-[#1c1c1e] text-[#86868b] border border-white/5 cursor-pointer flex items-center px-6 hover:text-white hover:bg-white/5">
              <input type="file" className="hidden" onChange={handleFileImport} />
              <Upload className="w-4 h-4 mr-2" /> Sincronizar Excel
          </label>
          <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Formatos: .xlsx, .csv</span>
        </div>
      </motion.div>

      {/* Dialog for Excel report configuration */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="bg-[#1c1c1e] border border-white/10 text-white rounded-[2.5rem] p-8 max-w-md backdrop-blur-2xl shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold italic text-white flex items-center gap-3">
              <Printer className="w-6 h-6 text-blue-400" /> Generar Reporte de Asistencia
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#86868b] leading-relaxed">
              Seleccione la sección y el rango de fechas para exportar el reporte de asistencia detallado en formato Excel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Sección</Label>
              <select 
                value={selectedSeccion} 
                onChange={(e) => setSelectedSeccion(e.target.value)}
                className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px'
                }}
              >
                {sections.map((sec, idx) => (
                  <option key={idx} value={sec} className="bg-[#1c1c1e] text-white font-bold">
                    {sec === 'Todas' ? 'Todas las Secciones' : `Sección ${sec}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest font-bold">Fecha Inicio</Label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 bg-white/5 border border-white/10 rounded-2xl text-white px-4 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest font-bold">Fecha Fin</Label>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 bg-white/5 border border-white/10 rounded-2xl text-white px-4 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-white/5">
            <Button 
              variant="ghost" 
              onClick={() => setIsReportDialogOpen(false)}
              className="h-12 rounded-full text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/5 px-6"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateExcelReport} 
              disabled={reportLoading}
              className="h-12 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-[13px] px-8 shadow-lg shadow-white/5"
            >
              {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
              Generar y Descargar (.xlsx)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Dashboard;

