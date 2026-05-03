import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Loader2, 
  Sparkles, 
  Command, 
  History,
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const AIChatView = ({ onClose, onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Initial welcome message from the system context
    setMessages([
      { 
        role: 'assistant', 
        content: "Bienvenido(a) al Núcleo de Inferencia Andrés Bello v3.1. Estoy listo para brindar asistencia y respuestas basadas en datos. ¿Qué acción desea realizar hoy?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
                previousMessages: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
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
            if (onRefresh && (data.content.includes('EJECUTADA') || data.content.includes('completado'))) {
              setTimeout(onRefresh, 1500);
            }
        } else {
            throw new Error(data.error || 'Error de enlace con el Núcleo');
        }
    } catch (e) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "⚠️ **ERROR DE NODO**: " + e.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0a0a0b] md:rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Platinum Header */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white italic tracking-tight">Núcleo de Inferencia</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Sincronización v3.1 Aktive</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-white/5 text-white/40 border-none px-3 py-1 hidden sm:flex text-[9px] font-black uppercase tracking-widest">
              Secured Channel
            </Badge>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Canvas */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 no-scrollbar scroll-smooth bg-gradient-to-b from-transparent to-blue-950/5"
        >
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-6 max-w-[92%] sm:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all duration-500 ${
                  m.role === 'user' 
                  ? 'bg-zinc-800 border-white/5 text-white/20' 
                  : 'bg-white text-black border-white shadow-xl shadow-white/5'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className={`space-y-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-6 rounded-[2rem] text-[16px] md:text-[17px] leading-relaxed font-medium transition-all duration-500 ${
                    m.role === 'user' 
                    ? 'bg-[#1c1c1e] text-white/90 border border-white/5 rounded-tr-none' 
                    : 'bg-transparent text-white rounded-tl-none border-none shadow-none'
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {m.content.split('\n').map((line, idx) => {
                        // Sophisticated markdown-like rendering for institutional headers
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={idx} className="text-blue-400 font-black uppercase tracking-widest text-[11px] mb-4 mt-6 first:mt-0">{line.replace(/\*\*/g, '')}</h4>;
                        }
                        return <p key={idx} className="mb-2 last:mb-0">{line}</p>;
                      })}
                    </div>
                  </div>
                  
                  {/* Proposal Actions */}
                  {m.proposals && m.proposals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {m.proposals.map((p, pIdx) => (
                        <Button 
                          key={pIdx}
                          variant="outline"
                          className="rounded-2xl bg-blue-600/10 border-blue-500/20 text-blue-400 text-[11px] font-bold hover:bg-blue-600 hover:text-white transition-all h-10 px-6"
                        >
                          <Zap className="w-3 h-3 mr-2" /> {p.title || 'Ejecutar Acción'}
                        </Button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] font-black text-white/10 uppercase tracking-[0.3em] px-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.role === 'user' ? 'Institución' : 'Núcleo Inferencia'} • {m.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-4 items-center bg-white/5 px-8 py-5 rounded-[2.5rem] border border-white/5">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(d => (
                    <motion.div 
                      key={d}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em]">Cómputo Neural...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Gemini-Style Input Area */}
        <div className="p-6 md:p-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto relative group">
            <form onSubmit={handleSend} className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 group-focus-within:animate-pulse" />
              </div>
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Pregunte por la matrícula, finanzas o solicite una acción..."
                className="w-full h-18 pl-16 pr-24 bg-[#1c1c1e] border border-white/10 rounded-[2rem] text-[16px] text-white font-bold placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-2xl"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                  input.trim() && !isTyping ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-white/10'
                }`}
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            
            <div className="flex justify-center gap-6 mt-6">
              {[
                { icon: History, label: 'Historial Auditado' },
                { icon: ShieldCheck, label: 'Protección Grado 3' },
                { icon: Activity, label: 'Nodo 01-Sync' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-black text-[#86868b] uppercase tracking-widest opacity-40">
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatView;
