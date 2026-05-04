import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  Zap,
  Cpu,
  Activity,
  Plus,
  Paperclip,
  Mic,
  MoreVertical,
  Maximize2,
  ChevronDown,
  ShieldCheck,
  BrainCircuit,
  Binary
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const AIChatView = ({ onClose, onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: "NÚCLEO MAESTRO v3.5 Sincronizado.\n\nHe indexado la base de datos institucional. Estoy preparado para procesar consultas ejecutivas o ejecutar protocolos de auditoría en tiempo real.\n\n**¿Qué vector de datos desea analizar hoy?**",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

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
    const currentInput = input;
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
                message: currentInput,
                previousMessages: messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
            })
        });
        const data = await res.json();
        
        if (res.ok) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.content || '',
                timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                proposals: data.proposals || []
            }]);
            if (onRefresh && (data.content.includes('EJECUTADA') || data.content.includes('✅'))) {
              setTimeout(onRefresh, 1000);
            }
        } else {
            throw new Error(data.error || 'Error de enlace con el Núcleo');
        }
    } catch (e) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "⚠️ **FALLO DE NODO**: El motor de inferencia no responde. Verifique el enlace de datos.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const MessageContent = ({ content }) => {
    return (
      <div className="space-y-4 text-[15px] md:text-[17px] leading-relaxed font-medium">
        {content.split('\n').map((line, idx) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={idx} className="text-white font-black text-lg md:text-xl tracking-tight mt-6 mb-2 first:mt-0 uppercase italic">{line.replace(/\*\*/g, '')}</div>;
          }
          if (line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-3 pl-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span className="text-white/80">{line.substring(2)}</span>
              </div>
            );
          }
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="text-white/70">
              {parts.map((part, i) => 
                part.startsWith('**') && part.endsWith('**') 
                ? <span key={i} className="text-white font-bold">{part.replace(/\*\*/g, '')}</span> 
                : part
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col bg-[#050505] text-white overflow-hidden"
    >
      {/* Dynamic Header */}
      <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 relative">
             <BrainCircuit className="w-5 h-5 text-white" />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Platinum Intelligence</span>
              <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase px-2 py-0.5">v3.5</Badge>
            </div>
            <p className="text-[12px] text-white font-bold tracking-tight">Núcleo Andrés Bello</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-4 hidden md:flex">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Enlace Seguro</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                 <ShieldCheck className="w-3 h-3" /> E2EE ACTIVO
              </span>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center">
             <X className="w-5 h-5" />
           </button>
        </div>
      </nav>

      {/* Main Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative"
      >
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-20 space-y-12">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-4 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                  m.role === 'user' 
                  ? 'bg-zinc-900 border-white/5' 
                  : 'bg-white border-white text-black'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5 text-white/40" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                </div>

                <div className={`flex-1 min-w-0 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-full rounded-2xl md:rounded-3xl ${
                    m.role === 'user' 
                    ? 'bg-white/5 border border-white/10 px-5 py-3 rounded-tr-none text-white/90' 
                    : 'text-white'
                  }`}>
                    <MessageContent content={m.content} />
                  </div>

                  {m.proposals && m.proposals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {m.proposals.map((p, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)', color: '#000' }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          <Zap className="w-3 h-3 text-blue-500" />
                          {p.title}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  
                  <p className="mt-2 text-[8px] font-black text-white/10 uppercase tracking-widest">{m.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
              <div className="flex gap-1">
                {[0,1,2].map(d => (
                  <motion.div key={d} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Input */}
      <div className="px-4 pb-8 md:pb-12 pt-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="apple-glass rounded-full p-1.5 flex items-center gap-2 shadow-2xl border-white/10 focus-within:border-blue-500/40 transition-all duration-500">
            <button className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all shrink-0">
              <Plus className="w-6 h-6" />
            </button>
            
            <form onSubmit={handleSend} className="flex-1 flex items-center">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escriba un comando institucional..."
                className="flex-1 bg-transparent border-none text-white text-base font-medium outline-none placeholder:text-white/20 py-4 px-2"
              />
              
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${
                  input.trim() && !isTyping 
                  ? 'bg-white text-black shadow-lg scale-100' 
                  : 'bg-white/5 text-white/10 scale-90'
                }`}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
          
          <div className="mt-6 flex justify-center gap-6 md:gap-12 opacity-20">
             <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-[0.4em]">
                <Activity className="w-3 h-3" /> Core Status: Sync
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-[0.4em]">
                <Binary className="w-3 h-3" /> Inferencia v3.5
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatView;
