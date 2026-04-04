import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  User, 
  Loader2,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Search,
  Command,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Plus,
  Bot
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

  useEffect(() => {
    if (searchTerm) {
      setInput(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setInput(searchTerm);
    }
  }, [searchTerm]);

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
    <div className="min-h-[calc(100vh-200px)] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-20 pt-10 pb-40 space-y-12 no-scrollbar"
      >
        {messages.length === 1 && !isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
               <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-white leading-tight">
                Hola, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Juan</span>
              </h1>
              <p className="text-3xl md:text-4xl font-medium text-[#86868b] tracking-tight">¿Por dónde empezamos hoy?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mt-12">
               {[
                 { label: 'Analizar Deserción', icon: BrainCircuit, prompt: 'Realiza un análisis profundo de los estudiantes en riesgo de deserción' },
                 { label: 'Resumen de Notas', icon: GraduationCap, prompt: 'Dame un resumen de las calificaciones del 1er Lapso' },
                 { label: 'Estado del Personal', icon: Briefcase, prompt: '¿Cuál es el estado actual del personal docente?' },
                 { label: 'Optimizar Asistencia', icon: Zap, prompt: 'Sugiere mejoras para la asistencia en la sección 3A' }
               ].map((tool, i) => (
                 <button 
                   key={i}
                   onClick={() => { setInput(tool.prompt); }}
                   className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left group"
                 >
                   <tool.icon className="w-5 h-5 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-semibold text-white/90">{tool.label}</span>
                 </button>
               ))}
            </div>
          </motion.div>
        )}

        {/* Message Mapping */}
        {messages.filter((_, idx) => messages.length > 1 || idx > 0).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
               }`}>
                 {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
               </div>
               <div className={`space-y-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`text-lg font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-wrap ${m.role === 'user' ? 'bg-white/5 px-8 py-4 rounded-[2rem]' : ''}`}>
                    {m.content}
                  </div>
                  
                  {m.action && !m.actionExecuted && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col p-6 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 space-y-4"
                    >
                       <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                          <Zap className="w-3 h-3" />
                          Acción Recomendada
                       </div>
                       <div className="flex gap-3">
                          <Button 
                            onClick={() => handleExecuteAction(i + 1, m.action)}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-8 h-12 rounded-2xl shadow-xl shadow-blue-500/20"
                          >
                            EJECUTAR: {m.action.type}
                          </Button>
                          <Button 
                            variant="ghost"
                            onClick={() => {
                              const nm = [...messages];
                              nm[i+1].action = null;
                              setMessages(nm);
                            }}
                            className="text-[#86868b] hover:text-white text-[11px] font-bold px-8 h-12 rounded-2xl"
                          >
                            DESCARTAR
                          </Button>
                       </div>
                    </motion.div>
                  )}
               </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-6 items-center">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                   <Bot className="w-5 h-5" />
                </div>
                <div className="flex gap-1.5 p-4 rounded-3xl bg-white/5 items-center">
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Floating Modern Input Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-[110]">
         <motion.div 
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="relative group"
         >
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full pointer-events-none" />
            <form onSubmit={handleSend} className="relative flex items-center gap-4 p-3 apple-glass rounded-[2.5rem] border border-white/10 shadow-2xl">
               <div className="flex items-center gap-1 pl-2">
                  <button type="button" className="p-3 text-[#86868b] hover:text-white transition-colors hover:bg-white/5 rounded-full">
                     <Plus className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-3 text-[#86868b] hover:text-white transition-colors hover:bg-white/5 rounded-full">
                     <Command className="w-5 h-5" />
                  </button>
               </div>
               
               <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregúntale al Núcleo de Inferencia..."
                  className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-white placeholder:text-[#86868b] h-14"
               />

               <div className="flex items-center gap-2 pr-2">
                  <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                     <ShieldCheck className="w-3 h-3 text-emerald-400" />
                     <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-wider">Modo Seguro</span>
                  </div>
                  <Button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="w-12 h-12 bg-white text-black hover:bg-zinc-200 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center p-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
               </div>
            </form>
         </motion.div>
      </div>
    </div>
  );
};

export default AIChatView;
