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
  Trash2
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

    const totalRevenue = payments.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="space-y-12">
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
                    className="apple-card p-8 border border-white/5"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <Badge className="bg-emerald-600/10 text-emerald-400 border-none px-3 py-1 text-[8px] font-black uppercase">Solvencia Promedio</Badge>
                    </div>
                    <h3 className="text-4xl font-black text-white">84%</h3>
                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-2">Institución Saludable</p>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="apple-card p-8 border border-white/5"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <Badge className="bg-red-600/10 text-red-400 border-none px-3 py-1 text-[8px] font-black uppercase">Morosidad Crítica</Badge>
                    </div>
                    <h3 className="text-4xl font-black text-white">16%</h3>
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
                    className="h-14 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" /> Registrar Nuevo Pago
                </Button>
            </div>

            {/* Table */}
            <div className="apple-card border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Estudiante</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Mes</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Monto</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Método</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Fecha</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[#86868b] uppercase tracking-widest">Acciones</th>
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
                                            {p.estudiante.substring(0, 1)}
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
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-xl apple-card p-10 border border-white/10 z-10 relative"
                        >
                            <h2 className="text-3xl font-black text-white mb-8 italic uppercase italic tracking-tighter">Registrar Transacción</h2>
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Seleccionar Estudiante</label>
                                        <select 
                                            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none focus:border-blue-500/50"
                                            value={newPayment.estudiante_id}
                                            onChange={(e) => setNewPayment({...newPayment, estudiante_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Seleccione un alumno...</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.nombre} - {s.cedula}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Monto ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-14 bg-white/5 border-white/5 rounded-2xl px-6"
                                                placeholder="0.00"
                                                value={newPayment.monto}
                                                onChange={(e) => setNewPayment({...newPayment, monto: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Mes</label>
                                            <select 
                                                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none"
                                                value={newPayment.mes_correspondiente}
                                                onChange={(e) => setNewPayment({...newPayment, mes_correspondiente: e.target.value})}
                                            >
                                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Concepto / Referencia</label>
                                        <Input 
                                            className="h-14 bg-white/5 border-white/5 rounded-2xl px-6"
                                            placeholder="Ej: Mensualidad Mayo - Ref: 9283"
                                            value={newPayment.referencia}
                                            onChange={(e) => setNewPayment({...newPayment, referencia: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold">Cancelar</Button>
                                    <Button type="submit" disabled={submitting} className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-xs uppercase tracking-widest">
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validar Cobro"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Finance;
