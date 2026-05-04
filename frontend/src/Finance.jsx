import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Loader2,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  History,
  Activity
} from 'lucide-react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const Finance = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPayment, setNewPayment] = useState({
        estudiante_id: '',
        monto: '',
        concepto: 'Mensualidad',
        mes_correspondiente: 'Mayo',
        metodo: 'Transferencia',
        referencia: ''
    });
    const [students, setStudents] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const item = { 
        hidden: { opacity: 0, y: 15 }, 
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } 
    };

    const fetchFinanceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const [payRes, stdRes] = await Promise.all([
                fetch(`${baseUrl}/api/pagos`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${baseUrl}/api/estudiantes`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (payRes.ok) setPayments(await payRes.json());
            if (stdRes.ok) setStudents(await stdRes.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            const res = await fetch(`${baseUrl}/api/pagos`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newPayment)
            });
            if (res.ok) {
                setMsg({ text: 'Pago registrado con éxito', type: 'success' });
                setIsModalOpen(false);
                setNewPayment({ ...newPayment, referencia: '', monto: '' });
                fetchFinanceData();
            }
        } catch (e) {
            setMsg({ text: 'Error en conexión financiera', type: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        }
    };

    const filteredPayments = Array.isArray(payments) ? payments.filter(p => 
        (p.estudiante?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (p.cedula?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ) : [];

    const totalRevenue = Array.isArray(payments) ? payments.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) : 0;
    const totalStudentsCount = Array.isArray(students) ? students.length : 0;
    const studentsWhoPaid = Array.isArray(payments) ? new Set(payments.map(p => p.estudiante_id)).size : 0;
    const solvencyRate = totalStudentsCount > 0 ? Math.round((studentsWhoPaid / totalStudentsCount) * 100) : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30">Accediendo a Bóvedas...</p>
        </div>
    );

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto py-6 md:py-16 space-y-10 md:space-y-20 px-4 md:px-12"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-6xl font-bold text-white tracking-tighter italic leading-none">Finanzas</h1>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-white/5 text-[#86868b] border-white/10 px-3 py-0.5 text-[8px] font-black uppercase tracking-widest">Tesorería v4.0</Badge>
                        <p className="text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-[0.2em] leading-none">U.E. Andrés Bello</p>
                    </div>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 md:h-18 px-8 md:px-14 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-3 group-hover:rotate-90 transition-transform" /> 
                    Registrar Pago
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                <div className="ios-card bg-blue-600/[0.03] border-blue-500/10 p-6 md:p-10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16" />
                    <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">Recaudación</Badge>
                    </div>
                    <div className="text-3xl md:text-5xl font-black text-white italic tracking-tighter relative z-10">${totalRevenue.toLocaleString()}</div>
                    <p className="text-[10px] md:text-[11px] font-black text-[#86868b] uppercase tracking-[0.3em] mt-3 relative z-10">Ciclo Institucional</p>
                </div>

                <div className="ios-card bg-emerald-600/[0.03] border-emerald-500/10 p-6 md:p-10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16" />
                    <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">Solvencia</Badge>
                    </div>
                    <div className="text-3xl md:text-5xl font-black text-white italic tracking-tighter relative z-10">{solvencyRate}%</div>
                    <p className="text-[10px] md:text-[11px] font-black text-[#86868b] uppercase tracking-[0.3em] mt-3 relative z-10">Índice de Cumplimiento</p>
                </div>

                <div className="ios-card bg-indigo-600/[0.03] border-indigo-500/10 p-6 md:p-10 group md:col-span-2 lg:col-span-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
                    <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">Status IA</Badge>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">
                        {solvencyRate > 75 ? 'Flujo Óptimo' : solvencyRate > 50 ? 'Estable' : 'Alerta'}
                    </div>
                    <p className="text-[10px] md:text-[11px] font-black text-[#86868b] uppercase tracking-[0.3em] mt-3 relative z-10">Kernel Financiero</p>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={item} className="relative group max-w-3xl mx-auto w-full px-2">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                <Input 
                    placeholder="Filtrar por estudiante, cédula o referencia..." 
                    className="h-16 md:h-20 pl-20 bg-white/[0.03] border-white/5 rounded-[1.8rem] md:rounded-[2.5rem] text-white font-bold transition-all focus:ring-1 focus:ring-blue-500/30 text-[16px] md:text-[18px] placeholder:text-white/5 shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </motion.div>

            {/* Transactions List */}
            <motion.div variants={item} className="space-y-6 md:space-y-10 pb-24 md:pb-0">
                <div className="flex items-center justify-between px-6">
                    <h3 className="text-[10px] md:text-[12px] font-black text-[#86868b] uppercase tracking-[0.4em] italic">Bitácora Global</h3>
                    <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-blue-500/40 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Sincronizado
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {filteredPayments.map((p, i) => (
                        <motion.div 
                            key={p.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="ios-card p-6 md:p-8 hover:bg-white/[0.05] transition-all border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                        >
                            <div className="flex items-center gap-5 md:gap-8">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-black text-xl md:text-2xl group-hover:bg-blue-600/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
                                    {(p.estudiante || '?')[0]}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-lg md:text-xl font-bold text-white truncate italic tracking-tight">{p.estudiante}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                        <span className="text-[9px] md:text-[10px] font-black text-[#86868b] uppercase tracking-widest">{p.mes_correspondiente}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{p.metodo}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[9px] md:text-[10px] font-black text-blue-500/60 uppercase tracking-widest">REF: {p.referencia || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left md:text-right border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                <p className="text-2xl md:text-3xl font-black text-emerald-400 italic tracking-tighter leading-none">+${parseFloat(p.monto).toLocaleString()}</p>
                                <p className="text-[9px] md:text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-2 italic">{new Date(p.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </motion.div>
                    ))}
                    {filteredPayments.length === 0 && (
                        <div className="py-24 md:py-48 flex flex-col items-center justify-center gap-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] md:rounded-[5rem]">
                            <Wallet className="w-12 h-12 md:w-20 md:h-20 text-white/5" />
                            <div className="text-center space-y-2">
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/20">Bóveda Sin Movimientos</p>
                                <p className="text-[8px] md:text-[9px] font-bold text-white/10 uppercase tracking-widest">No se detectaron transacciones para este filtro</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modal Overlay / Mobile Sheet */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="w-full max-w-2xl bg-zinc-950 sm:rounded-[3.5rem] border-t sm:border border-white/10 p-8 md:p-14 relative overflow-hidden shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 w-12 h-1.5 bg-white/10 rounded-full sm:hidden" />
                            
                            <div className="flex items-center justify-between mb-10 md:mb-16">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">REGISTRO</h2>
                                    <p className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mt-2">Sincronización de Tesorería</p>
                                </div>
                                <Button onClick={() => setIsModalOpen(false)} variant="ghost" className="rounded-full w-12 h-12 p-0 text-white/20 hover:text-white hover:bg-white/5 transition-all">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-6 md:space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar pb-10">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Vínculo Académico (Estudiante)</label>
                                    <select 
                                        className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none transition-all shadow-inner"
                                        value={newPayment.estudiante_id}
                                        onChange={(e) => setNewPayment({...newPayment, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-zinc-950">Seleccione un estudiante...</option>
                                        {students.map(s => <option key={s.id} value={s.id} className="bg-zinc-950">{s.nombre} • CI: {s.cedula}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Monto (USD)</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">$</div>
                                            <Input 
                                                type="number"
                                                placeholder="0.00"
                                                className="h-16 pl-12 bg-white/[0.03] border-white/10 rounded-2xl text-white font-black text-xl focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                                value={newPayment.monto}
                                                onChange={(e) => setNewPayment({...newPayment, monto: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Ciclo / Mes</label>
                                        <select 
                                            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-bold focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none transition-all shadow-inner"
                                            value={newPayment.mes_correspondiente}
                                            onChange={(e) => setNewPayment({...newPayment, mes_correspondiente: e.target.value})}
                                        >
                                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(m => (
                                                <option key={m} value={m} className="bg-zinc-950">{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-2">Referencia de Transacción / Concepto</label>
                                    <Input 
                                        placeholder="Ej: Transferencia Banco Mercantil #000123"
                                        className="h-16 bg-white/[0.03] border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                        value={newPayment.referencia}
                                        onChange={(e) => setNewPayment({...newPayment, referencia: e.target.value})}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={submitting} className="h-18 md:h-20 w-full bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] mt-6">
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ejecutar Registro Financiero"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notifications Portal */}
            <AnimatePresence>
                {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-24 left-4 right-4 md:left-auto md:right-12 md:w-96 z-[2000]"
                    >
                        <div className="apple-glass p-5 md:p-6 rounded-3xl md:rounded-[2rem] flex items-center gap-4 shadow-2xl border border-white/10">
                            <div className={`p-3 rounded-xl ${msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black text-[#86868b] uppercase tracking-widest block mb-1">Financial Management Kernel</span>
                                <p className={`text-[12px] font-bold truncate ${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
                            </div>
                            <button onClick={() => setMsg({text:'', type:''})} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-4 h-4 text-white/20" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Finance;

