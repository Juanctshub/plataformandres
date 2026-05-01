import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  Plus, 
  DollarSign, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  History,
  Loader2,
  Trash2,
  ChevronRight
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
                setMsg({ text: 'Pago registrado en el Nucleo Financiero', type: 'success' });
                setIsModalOpen(false);
                setNewPayment({ ...newPayment, referencia: '', monto: '' });
                fetchFinanceData();
            }
        } catch (e) {
            setMsg({ text: 'Error en el enlace financiero', type: 'error' });
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
    
    // Dynamic Stats calculation
    const totalStudentsCount = Array.isArray(students) ? students.length : 0;
    const studentsWhoPaid = Array.isArray(payments) ? new Set(payments.map(p => p.estudiante_id)).size : 0;
    
    const solvencyRate = totalStudentsCount > 0 ? Math.round((studentsWhoPaid / totalStudentsCount) * 100) : 0;
    const debtRate = 100 - solvencyRate;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="space-y-12 relative">
            {/* 🛎️ NOTIFICACIÓN FLOTANTE (TOAST) 🛎️ */}
            <AnimatePresence>
                {msg.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-32 left-1/2 z-[10000] px-10 py-5 rounded-[2rem] apple-glass border font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-4 ${
                            msg.type === 'success' ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
                        }`}
                    >
                        {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {msg.text}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="apple-card p-8 border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <Badge className="bg-blue-600/10 text-blue-400 border-none px-3 py-1 text-[8px] font-black uppercase">Recaudación Total</Badge>
                    </div>
                    <h3 className="text-4xl font-black text-white">${totalRevenue.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-2">Corte Administrativo v26.0</p>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="apple-card p-8 border border-white/5 bg-gradient-to-br from-emerald-600/10 to-transparent"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <Badge className="bg-emerald-600/10 text-emerald-400 border-none px-3 py-1 text-[8px] font-black uppercase">Solvencia Promedio</Badge>
                    </div>
                    <h3 className="text-4xl font-black text-white">{solvencyRate}%</h3>
                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-2">
                        {solvencyRate >= 70 ? 'Institución Saludable' : 'Riesgo Administrativo'}
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="apple-card p-8 border border-white/5 bg-gradient-to-br from-red-600/10 to-transparent"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <Badge className="bg-red-600/10 text-red-400 border-none px-3 py-1 text-[8px] font-black uppercase">Morosidad Crítica</Badge>
                    </div>
                    <h3 className="text-4xl font-black text-white">{debtRate}%</h3>
                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-2">Pendiente por Cobrar</p>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="relative flex-1 max-w-lg group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-blue-500 transition-all" />
                    <Input 
                        placeholder="Buscar por estudiante o cédula..." 
                        className="h-14 pl-16 bg-white/5 border-white/5 rounded-2xl text-white font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Transacción
                </Button>
            </div>

            {/* Floating Action for Mobile/Premium feel */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-32 right-10 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 z-[60] lg:hidden"
            >
                <Plus className="w-8 h-8" />
            </motion.button>

            {/* Table */}
            <div className="apple-card border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Estudiante</th>
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Mes</th>
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Monto</th>
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Método</th>
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Fecha</th>
                            <th className="px-8 py-6 text-[11px] font-bold text-[#86868b] uppercase tracking-[0.2em]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredPayments.map((p, i) => (
                            <motion.tr 
                                key={p.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.02] transition-all"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold text-xs uppercase">
                                            {(p.estudiante || '?').substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{p.estudiante}</p>
                                            <p className="text-[10px] text-[#86868b] font-medium">{p.cedula}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <Badge className="bg-white/5 text-[#86868b] border-none text-[8px] font-black uppercase px-3 py-1">{p.mes_correspondiente}</Badge>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black text-emerald-500">${p.monto}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                                        <CreditCard className="w-3.5 h-3.5" />
                                        {p.metodo}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-bold text-[#86868b] uppercase">{new Date(p.fecha).toLocaleDateString()}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <Button className="w-10 h-10 rounded-xl bg-white/5 text-[#86868b] hover:text-white hover:bg-white/10 p-0">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-[100px]"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }}
                            className="w-full max-w-2xl apple-glass p-12 border border-white/10 z-10 relative overflow-hidden rounded-[3.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none" />
                            
                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40">
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Registrar Transacción</h2>
                                    <p className="text-emerald-400/60 font-black uppercase tracking-[0.3em] text-[8px] mt-3">Validación de Solvencia Institucional v27.2</p>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-8 relative z-10">
                                <div className="space-y-3 group">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-emerald-500 transition-colors">Seleccionar Estudiante</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-[1.5rem] px-8 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none font-bold transition-all"
                                            value={newPayment.estudiante_id}
                                            onChange={(e) => setNewPayment({...newPayment, estudiante_id: e.target.value})}
                                            required
                                        >
                                            <option value="" className="bg-black">--- Seleccione Estudiante ---</option>
                                            {students.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre} ({s.cedula})</option>)}
                                        </select>
                                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] rotate-90" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-emerald-500 transition-colors">Monto en Divisas (USD)</label>
                                        <Input 
                                            type="number"
                                            placeholder="0.00"
                                            className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                                            value={newPayment.monto}
                                            onChange={(e) => setNewPayment({...newPayment, monto: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-emerald-500 transition-colors">Mes Correspondiente</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-[1.5rem] px-8 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none font-bold transition-all"
                                                value={newPayment.mes_correspondiente}
                                                onChange={(e) => setNewPayment({...newPayment, mes_correspondiente: e.target.value})}
                                            >
                                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(m => (
                                                    <option key={m} value={m} className="bg-black">{m}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 group">
                                    <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest pl-4 group-focus-within:text-emerald-500 transition-colors">Concepto o Detalle</label>
                                    <Input 
                                        placeholder="Ej: Mensualidad, Inscripción, Carnet..."
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-[1.5rem] text-white font-bold focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                                        value={newPayment.concepto}
                                        onChange={(e) => setNewPayment({...newPayment, concepto: e.target.value})}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={submitting} className="w-full h-18 bg-white text-black hover:bg-zinc-200 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98] mt-4">
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : "Confirmar Transacción y Emitir Recibo"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Finance;
