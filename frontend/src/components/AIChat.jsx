import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Cpu,
  Loader2,
  Bot,
  User,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hola Administrador. Soy el Núcleo IA v3.8. Estoy analizando los datos del plantel en tiempo real con cifrado cuántico Neon Tech. ¿En qué auditoría puedo asistirte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
        role: 'user', 
        content: input, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated IA Brain
    setTimeout(() => {
        let response = "Analizando base de datos institucional...";
        if (input.toLowerCase().includes('riesgo') || input.toLowerCase().includes('deserción')) {
            response = "He detectado un patrón de inasistencia en 4 estudiantes de la sección 4to Año B. Se recomienda activar el protocolo de contacto preventivo v3.8.";
        } else if (input.toLowerCase().includes('notas') || input.toLowerCase().includes('promedio')) {
            response = "El promedio general del plantel ha subido un 1.2% este periodo. El núcleo de 'Matemáticas' presenta la mayor tasa de aprobación (92%).";
        } else {
            response = "Entendido. Procesando consulta en el cluster Neon Secure. ¿Deseas un reporte detallado sobre la matrícula o la asistencia?";
        }

        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[100]"
          />

          {/* Chat Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-[-40px_0_100px_rgba(0,0,0,0.1)] z-[101] flex flex-col overflow-hidden border-l border-zinc-100"
          >
            {/* Header */}
            <div className="p-10 border-b border-zinc-50 flex items-center justify-between bg-zinc-950 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center shadow-xl backdrop-blur-xl">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter tracking-tighter">Asistente IA</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Nucleo v3.8 Active</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-colors relative z-10"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Matrix Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
               <div className="grid grid-cols-10 h-full w-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-zinc-900 h-12 w-12" />
                  ))}
               </div>
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        m.role === 'user' ? 'bg-zinc-50 border border-zinc-100 text-zinc-900' : 'bg-zinc-950 text-white'
                    }`}>
                      {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-6 px-8 rounded-[1.75rem] shadow-sm transition-all duration-700 ${
                            m.role === 'user' 
                                ? 'bg-zinc-50 text-zinc-900 rounded-tr-none border border-zinc-100' 
                                : 'bg-white text-zinc-900 rounded-tl-none border border-zinc-100'
                        }`}>
                            <p className="text-sm font-bold leading-relaxed italic tracking-tight">{m.content}</p>
                        </div>
                        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest pl-2">{m.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white border border-zinc-100 p-6 px-8 rounded-[1.75rem] rounded-tl-none flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 italic">Analizando Big Data</span>
                        <div className="flex gap-1.5">
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-10 border-t border-zinc-50 bg-white relative z-10">
                <form 
                    onSubmit={handleSend}
                    className="relative group"
                >
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta a la IA (ej: Estudiantes en riesgo)"
                        className="w-full h-18 bg-zinc-50 border border-zinc-100 rounded-3xl pl-10 pr-24 text-sm font-black uppercase italic tracking-tight outline-none focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300 placeholder:italic"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button 
                            type="button"
                            variant="ghost"
                            className="w-12 h-12 rounded-2xl hover:bg-zinc-100 text-zinc-300"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <Button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="h-12 w-12 bg-zinc-950 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </form>
                <div className="flex items-center justify-between mt-8 opacity-40">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-zinc-900" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neon Encrypted Transaction v4.2</span>
                  </div>
                  <Badge className="bg-zinc-50 text-zinc-400 border-none px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic">Secure Cluster A1</Badge>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChat;
