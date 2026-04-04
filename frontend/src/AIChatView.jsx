import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  Bot, 
  User, 
  Loader2,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Search,
  Command,
  ArrowRight
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const AIChatView = ({ searchTerm }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Bienvenido al Núcleo de Inferencia v15.0. Soy tu asistente de gestión interconectado. Puedo verificar estados de alumnos, modificar registros o analizar patrones de deserción. ¿En qué auditoría administrativa procedemos?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState(searchTerm || '');
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
                previousMessages: messages.slice(-5) // Enviar contexto reciente
            })
        });
        const data = await res.json();
        
        if (res.ok) {
            // Detectar si hay una acción requerida
            const actionMatch = data.content.match(/ACTION_REQUIRED: (\{.*\})/);
            const action = actionMatch ? JSON.parse(actionMatch[1]) : null;

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.content.replace(/ACTION_REQUIRED: \{.*\}/, '').trim(),
                timestamp: data.timestamp || new Date().toLocaleTimeString(),
                action: action
            }]);
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "⚠️ Error de enlace con el núcleo Groq: " + e.message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleExecuteAction = async (msgIndex, action) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
      
      let res;
      if (action.type === 'SUSPEND') {
        res = await fetch(`${baseUrl}/api/estudiantes/${action.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ estado: 'suspendido' })
        });
      }

      if (res && res.ok) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[msgIndex].actionExecuted = true;
          newMessages[msgIndex].content += "\n\n✅ ACCIÓN EJECUTADA EXITOSAMENTE.";
          return newMessages;
        });
      }
    } catch (e) {
      console.error("Action Error:", e);
    }
  };

  return (
    <div className="h-[calc(100vh-280px)] flex flex-col relative apple-glass rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
         <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header Area */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/5 backdrop-blur-md">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white tracking-tight leading-none">Asistente Administrativo IA</h2>
               <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-[0.2em]">Kernel v15.0 Active</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Badge className="bg-white/5 text-[#86868b] border-white/10 px-4 py-1.5 text-[10px] rounded-full">AES-256 Encrypt</Badge>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#86868b] hover:text-white transition-colors cursor-pointer">
               <Globe className="w-5 h-5" />
            </div>
         </div>
      </div>

      {/* Messaging Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar relative z-10"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-6 max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-blue-600 text-white'
              }`}>
                {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-8 rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-blue-500/5 ${
                      m.role === 'user' 
                          ? 'bg-zinc-900/50 text-white border border-white/5 rounded-tr-none' 
                          : 'bg-white/5 text-white border border-white/5 rounded-tl-none backdrop-blur-xl'
                  }`}>
                      <p className="text-base font-medium leading-relaxed tracking-tight whitespace-pre-wrap">{m.content}</p>
                      
                      {m.action && !m.actionExecuted && (
                        <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-4">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                              <Zap className="w-3 h-3" />
                              Propuesta de Acción Proactiva
                           </div>
                           <div className="flex gap-3">
                              <Button 
                                onClick={() => handleExecuteAction(i, m.action)}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-6 h-10 rounded-xl"
                              >
                                PROCESAR {m.action.type}
                              </Button>
                              <Button 
                                variant="ghost"
                                onClick={() => setMessages(prev => {
                                  const nm = [...prev];
                                  nm[i].action = null;
                                  return nm;
                                })}
                                className="text-white/40 hover:text-white text-[10px] font-bold px-6 h-10 rounded-xl"
                              >
                                DESCARTAR
                              </Button>
                           </div>
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-2 px-2">
                     <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">{m.timestamp}</span>
                     {m.role === 'assistant' && <ShieldCheck className="w-3 h-3 text-emerald-500/50" />}
                  </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-4 backdrop-blur-xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868b] animate-pulse">Consultando Nodo Maestro</span>
                  <div className="flex gap-2">
                      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-10 bg-white/5 border-t border-white/5 relative z-20">
         <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSend} className="relative group">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta o instruye a la IA... (ej: 'Muestra estudiantes en riesgo')"
                    className="w-full h-20 bg-zinc-900 border border-white/10 rounded-[2rem] pl-10 pr-28 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-[#86868b] shadow-2xl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <Button 
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="h-14 w-14 bg-white text-black hover:bg-zinc-200 rounded-2xl shadow-xl active:scale-95 transition-all"
                   >
                      <Send className="w-6 h-6" />
                   </Button>
                </div>
            </form>
            <div className="flex items-center justify-center gap-10 mt-6 opacity-30 select-none">
               <div className="flex items-center gap-2">
                  <Database className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Neon Sync v1.0</span>
               </div>
               <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Real-time Analysis</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIChatView;
