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
  ChevronLeft,
  Activity,
  BrainCircuit
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import logo from './assets/logo.png';

const AIChatView = ({ searchTerm, user, onClose, onRefresh }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Bienvenido al Núcleo de Inferencia v26. Soy tu asistente institucional. ¿En qué auditoría procedemos?',
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
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden z-[1000] ios-transition">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 -z-10 bg-[#000]">
        <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* iOS Header */}
      <div className="pt-14 pb-4 px-6 border-b border-white/5 backdrop-blur-3xl bg-black/40 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-0.5 shadow-xl shadow-blue-500/20"
            >
                <div className="w-full h-full rounded-[0.9rem] bg-black/20 flex items-center justify-center overflow-hidden">
                    <img src={logo} className="w-8 h-8 object-contain" alt="AB" />
                </div>
            </motion.div>
            <div>
                <h2 className="text-[17px] font-bold text-white italic tracking-tight">Núcleo Andrés Bello</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Inferencia Activa</span>
                </div>
            </div>
        </div>
        <Button onClick={onClose} variant="ghost" className="w-10 h-10 rounded-full p-0 text-white/40 hover:text-white bg-white/5 active:scale-90 transition-all">
            <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mt-auto mb-1 flex-shrink-0">
                          <Bot className="w-4 h-4 text-blue-400" />
                      </div>
                  )}
                  <div className={`px-5 py-3.5 rounded-[1.75rem] text-[15px] font-bold leading-tight shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-[#1c1c1e] text-white/90 rounded-tl-none border border-white/5'
                  }`}>
                    {m.content}
                  </div>
              </div>
              <span className={`text-[9px] font-black text-[#86868b] uppercase tracking-widest mt-2 px-12 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mt-auto mb-1 flex-shrink-0">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
             </div>
             <div className="px-5 py-4 rounded-[1.5rem] bg-[#1c1c1e] border border-white/5 rounded-tl-none">
                <div className="flex gap-1.5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Suggestions Tray */}
      {messages.length === 1 && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 pb-4 flex gap-2 overflow-x-auto no-scrollbar"
        >
          {[
            { label: 'Analizar Ciclo', icon: BrainCircuit, prompt: 'Análisis de rendimiento' },
            { label: 'Auditoría Alumnos', icon: GraduationCap, prompt: 'Estado de matrícula' },
            { label: 'Estado Financiero', icon: Activity, prompt: 'Resumen de solvencia' }
          ].map((tool, i) => (
            <button 
              key={i}
              onClick={() => { setInput(tool.prompt); setTimeout(() => handleSend(), 100); }}
              className="flex-shrink-0 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/40 hover:text-white flex items-center gap-2 active:scale-95 transition-all"
            >
              <tool.icon className="w-3.5 h-3.5" />
              {tool.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* iOS Input Area */}
      <div className="p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-all flex-shrink-0">
                <Plus className="w-6 h-6" />
            </button>
            <div className="relative flex-1">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Mensaje de Inferencia..."
                  className="w-full h-12 pl-5 pr-14 bg-[#1c1c1e] border border-white/10 rounded-[1.5rem] text-[15px] text-white font-bold placeholder:text-white/10 focus:outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-1.5 top-1.5 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    input.trim() ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-white/10'
                  }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
            </div>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-20 select-none">
            <div className="h-[1px] w-8 bg-white" />
            <p className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Núcleo Groq v3.0</p>
            <div className="h-[1px] w-8 bg-white" />
        </div>
      </div>
    </div>
  );
};

export default AIChatView;

