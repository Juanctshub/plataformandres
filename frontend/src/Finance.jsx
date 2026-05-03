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
            className="max-w-6xl mx-auto py-8 sm:py-14 space-y-12 px-5 sm:px-10"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight italic leading-tight">Finanzas</h1>
                    <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.3em] mt-3">Estado de Tesorería • U.E.A.B</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="ios-button-primary bg-white text-black h-12 px-8 shadow-white/5 active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2" /> Registrar Pago
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="ios-card bg-blue-500/5 border-blue-500/10 p-8 group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-400 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Total</Badge>
                    </div>
                    <div className="text-4xl font-bold text-white italic tracking-tight">${totalRevenue.toLocaleString()}</div>
                    <p className="text-[11px] font-black text-[#86868b] uppercase tracking-widest mt-2">Recaudación Acumulada</p>
                </div>

                <div className="ios-card bg-emerald-500/5 border-emerald-500/10 p-8 group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Solvencia</Badge>
                    </div>
                    <div className="text-4xl font-bold text-white italic tracking-tight">{solvencyRate}%</div>
                    <p className="text-[11px] font-black text-[#86868b] uppercase tracking-widest mt-2">Nivel de Cumplimiento</p>
                </div>

                <div className="ios-card bg-indigo-500/5 border-indigo-500/10 p-8 group sm:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Estado</Badge>
                    </div>
                    <div className="text-xl font-bold text-white italic tracking-tight">
                        {solvencyRate > 75 ? 'Óptimo' : solvencyRate > 50 ? 'Estable' : 'Crítico'}
                    </div>
                    <p className="text-[11px] font-black text-[#86868b] uppercase tracking-widest mt-2">Salud Financiera v3.0</p>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={item} className="relative group max-w-2xl mx-auto w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-colors" />
                <Input 
                    placeholder="Filtrar por estudiante o ID..." 
                    className="h-14 pl-16 bg-[#1c1c1e]/60 border-none rounded-2xl text-white font-bold transition-all focus:ring-1 focus:ring-blue-500/50 text-[15px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </motion.div>

            {/* Transactions List */}
            <motion.div variants={item} className="space-y-4">
                <div className="flex items-center justify-between px-4 mb-2">
                    <h3 className="text-[12px] font-black text-[#86868b] uppercase tracking-[0.2em]">Transacciones Recientes</h3>
                    <History className="w-4 h-4 text-[#86868b]" />
                </div>
                <div className="ios-list-group space-y-3">
                    {filteredPayments.map((p, i) => (
                        <div key={p.id} className="ios-list-item flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-bold text-[14px]">
                                    {(p.estudiante || '?')[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-white truncate">{p.estudiante}</p>
                                    <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">{p.mes_correspondiente} • {p.metodo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[16px] font-bold text-emerald-400 italic tracking-tight">+${p.monto}</p>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(p.fecha).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    {filteredPayments.length === 0 && (
                        <div className="py-20 flex flex-col items-center opacity-20">
                            <Wallet className="w-12 h-12 mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest">No se encontraron pagos</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-2xl h-full sm:h-auto bg-[#000] sm:rounded-[3rem] border-t sm:border border-white/10 p-10 relative overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-white italic tracking-tight">Nuevo Pago</h2>
                                    <p className="text-[11px] font-bold text-emerald-400/60 uppercase tracking-widest mt-1">Sincronización Bancaria</p>
                                </div>
                                <Button onClick={() => setIsModalOpen(false)} variant="ghost" className="rounded-full w-10 h-10 p-0 text-white/40 hover:text-white">
                                    <Plus className="w-6 h-6 rotate-45" />
                                </Button>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Estudiante</label>
                                    <select 
                                        className="w-full h-14 bg-[#1c1c1e] border border-white/5 rounded-2xl px-6 text-sm text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none"
                                        value={newPayment.estudiante_id}
                                        onChange={(e) => setNewPayment({...newPayment, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-[#1c1c1e]">--- Seleccione Estudiante ---</option>
                                        {students.map(s => <option key={s.id} value={s.id} className="bg-[#1c1c1e]">{s.nombre} ({s.cedula})</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Monto (USD)</label>
                                        <Input 
                                            type="number"
                                            placeholder="0.00"
                                            className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold focus:ring-1 focus:ring-blue-500/50"
                                            value={newPayment.monto}
                                            onChange={(e) => setNewPayment({...newPayment, monto: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Mes</label>
                                        <select 
                                            className="w-full h-14 bg-[#1c1c1e] border border-white/5 rounded-2xl px-6 text-sm text-white font-bold focus:ring-1 focus:ring-blue-500/50 outline-none"
                                            value={newPayment.mes_correspondiente}
                                            onChange={(e) => setNewPayment({...newPayment, mes_correspondiente: e.target.value})}
                                        >
                                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(m => (
                                                <option key={m} value={m} className="bg-[#1c1c1e]">{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest pl-2">Referencia / Concepto</label>
                                    <Input 
                                        placeholder="Ej: Transf #123456"
                                        className="h-14 bg-[#1c1c1e] border-none rounded-2xl text-white font-bold focus:ring-1 focus:ring-blue-500/50"
                                        value={newPayment.concepto}
                                        onChange={(e) => setNewPayment({...newPayment, concepto: e.target.value})}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={submitting} className="ios-button-primary bg-white text-black h-16 w-full text-[14px] font-black mt-4">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Operación"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification */}
            <AnimatePresence>
                {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-full backdrop-blur-2xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl ${
                            msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                    >
                        {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {msg.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Finance;

