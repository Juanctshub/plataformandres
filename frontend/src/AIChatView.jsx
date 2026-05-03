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
  ChevronDown
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const AIChatView = ({ onClose, onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      { 
        role: 'assistant', 
        content: "Bienvenido(a) al **Núcleo de Inferencia Andrés Bello v3.1**. Estoy sincronizado con la red institucional y listo para procesar sus requerimientos.\n\n¿En qué puedo asistirle hoy?",
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
            content: "⚠️ **FALLO DE NODO**: " + e.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const MessageContent = ({ content }) => {
    return (
      <div className="space-y-4 text-[16px] md:text-[18px] leading-[1.6] font-medium">
        {content.split('\n').map((line, idx) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={idx} className="text-white font-black text-xl md:text-2xl tracking-tight mt-8 mb-4 first:mt-0">{line.replace(/\*\*/g, '')}</div>;
          }
          if (line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-3 pl-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                <span className="text-white/80">{line.substring(2)}</span>
              </div>
            );
          }
          // Simple bold parsing
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
      className="fixed inset-0 z-[150] flex flex-col bg-[#050505] text-white overflow-hidden"
    >
      {/* Premium Navigation Bar */}
      <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Platinum Intelligence</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase px-1.5 py-0.5">Live</Badge>
            </div>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Núcleo Andrés Bello v3.1</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 transition-all hidden sm:flex">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Chat Area - Centered for Focus */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative"
      >
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-20">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className={`flex gap-6 md:gap-10 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Role Icon */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-700 ${
                    m.role === 'user' 
                    ? 'bg-zinc-900 border-white/5' 
                    : 'bg-white border-white shadow-2xl shadow-white/5'
                  }`}>
                    {m.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6 text-white/40" /> : <Bot className="w-5 h-5 md:w-6 md:h-6 text-black" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 min-w-0 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-full transition-all duration-700 ${
                      m.role === 'user' 
                      ? 'bg-white/5 border border-white/10 px-6 py-4 rounded-3xl rounded-tr-none text-white/90' 
                      : 'text-white'
                    }`}>
                      <MessageContent content={m.content} />
                    </div>

                    {/* Action Proposals - Stylized */}
                    {m.proposals && m.proposals.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-8">
                        {m.proposals.map((p, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)', color: '#000' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[12px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
                          >
                            <Zap className="w-4 h-4 text-blue-500" />
                            {p.title}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <div className={`mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{m.timestamp}</span>
                      <div className="h-[1px] w-4 bg-white/10" />
                      <button className="text-[10px] font-black text-blue-500/40 hover:text-blue-500 uppercase tracking-widest transition-colors">Copiar</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-black animate-spin" />
              </div>
              <div className="flex gap-1.5">
                {[0,1,2].map(d => (
                  <motion.div 
                    key={d}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                    className="w-2 h-2 rounded-full bg-blue-500"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Input Island - iOS Style */}
      <div className="px-6 pb-8 md:pb-12 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="apple-glass rounded-[2.5rem] p-2 pr-3 flex items-center gap-2 shadow-2xl border-white/5 focus-within:border-blue-500/30 transition-all duration-500 group">
            <button className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
              <Plus className="w-6 h-6" />
            </button>
            
            <form onSubmit={handleSend} className="flex-1 flex items-center gap-4">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Pregunte cualquier cosa sobre la institución..."
                className="flex-1 bg-transparent border-none text-white text-[17px] font-medium outline-none placeholder:text-white/20 py-4"
              />
              
              <div className="flex items-center gap-1">
                <button type="button" className="p-3 rounded-full hover:bg-white/5 text-white/20 transition-all hidden sm:flex">
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 ${
                    input.trim() && !isTyping 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-white/10'
                  }`}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 flex justify-center gap-8">
             <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                <ShieldCheck className="w-3 h-3" /> E2EE Secured
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                <Activity className="w-3 h-3" /> Core Sync: Active
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatView;
