import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  User, 
  Loader2,
  ShieldCheck,
  Zap,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Plus,
  Bot,
  X,
  History,
  LayoutGrid,
  ChevronRight,
  Terminal,
  Cpu,
  Globe,
  Lock,
  Activity
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import logo from './assets/logo.png';

const AIChatView = ({ searchTerm, user, onClose, onRefresh }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Núcleo de Inferencia Andrés Bello v3.1 listo. Bienvenida(o) ${user?.username || 'Usuario'}. ¿Qué protocolo administrativo desea ejecutar hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState(searchTerm || '');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { 
        role: 'user', 
        content: input, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const res = await fetch(`${baseUrl}/api/ai/chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                message: input,
                previousMessages: messages.slice(-5)
            })
        });
        const data = await res.json();
        
        if (res.ok) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.content || '',
                timestamp: data.timestamp || new Date().toLocaleTimeString(),
                proposals: data.proposals || []
            }]);
            if (onRefresh && (data.content.includes('EJECUTADA') || data.content.includes('completado'))) onRefresh();
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "⚠️ Error: " + e.message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex overflow-hidden bg-[#0a0a0b]">
        
        {/* Left Sidebar - Terminal Status (Desktop Only) */}
        <div className="hidden lg:flex w-80 border-r border-white/5 flex-col p-6 space-y-8 bg-black/20 backdrop-blur-3xl">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400">
                    <Cpu className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estatus de Hardware</span>
                </div>
                <h2 className="text-xl font-bold text-white italic">Nivel Platinum</h2>
            </div>

            <div className="space-y-4">
                {[
                    { label: 'Seguridad', val: 'AES-256', icon: ShieldCheck, color: 'text-emerald-400' },
                    { label: 'Latencia', val: '14ms', icon: Activity, color: 'text-blue-400' },
                    { label: 'Estabilidad', val: '99.9%', icon: Globe, color: 'text-indigo-400' },
                    { label: 'Enlace', val: 'Activo', icon: Zap, color: 'text-amber-400' }
                ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-[11px] font-bold text-white/60">{stat.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-white">{stat.val}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1" />

            <div className="p-5 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Enlace Seguro</span>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                    Todas las inferencias están encriptadas y auditadas bajo el protocolo de seguridad institucional.
                </p>
            </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
            
            {/* Header Area */}
            <div className="h-20 border-b border-white/5 px-6 md:px-8 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20">
                        <Bot className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white italic">Centro de Mando IA</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">Groq Llama-3.3-70B Sync</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-[#86868b] hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar scroll-smooth"
            >
                {messages.map((m, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[90%] md:max-w-[70%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                                m.role === 'user' 
                                ? 'bg-white/5 border-white/10 text-white/40' 
                                : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            }`}>
                                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed font-medium ${
                                    m.role === 'user' 
                                    ? 'bg-zinc-900 border border-white/5 text-white/90 rounded-tr-none' 
                                    : 'bg-indigo-600/5 border border-indigo-500/10 text-white rounded-tl-none'
                                } shadow-xl backdrop-blur-md`}>
                                    {m.content}
                                </div>
                                <span className={`text-[9px] font-black text-white/20 uppercase tracking-widest px-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {m.role === 'user' ? 'Originador' : 'Inferencia'} • {m.timestamp}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex gap-4 items-center bg-white/5 px-6 py-4 rounded-[2rem] border border-white/5">
                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Analizando...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-10 bg-black/40 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                        {[
                            'Auditar Matrícula',
                            'Resumen Financiero',
                            'Proyecciones 2026',
                            'Optimizar Secciones'
                        ].map((q, i) => (
                            <button 
                                key={i}
                                onClick={() => setInput(q)}
                                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap active:scale-95"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="relative">
                        <input 
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ingrese comando de inferencia..."
                            className="w-full h-16 pl-8 pr-20 bg-zinc-900/80 border border-white/10 rounded-[1.5rem] text-[16px] text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-2xl"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className={`absolute right-2 top-2 h-12 w-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                                input.trim() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-white/10'
                            }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="mt-4 flex items-center justify-center gap-3 opacity-20">
                        <div className="h-[1px] w-8 bg-white" />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Terminal de Gestión Platinum</span>
                        <div className="h-[1px] w-8 bg-white" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIChatView;
