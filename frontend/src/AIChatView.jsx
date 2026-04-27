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
  Bot,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import logo from './assets/logo.png';

const AIChatView = ({ searchTerm, user, onClose, onRefresh }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Bienvenido al Núcleo de Inferencia Andrés Bello v26.4 Platinum. Soy tu asistente de gestión institucional con consciencia financiera y académica. ¿En qué auditoría procedemos?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState(searchTerm || '');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && messages.length > 1) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isTyping]);

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
            // Proposals are now auto-saved by the backend
            const hasProposals = data.proposals && data.proposals.length > 0;

            let content = data.content || '';
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: content,
                timestamp: data.timestamp || new Date().toLocaleTimeString(),
                proposals: data.proposals || []
            }]);

            // If it was a bulk registration or some direct action, refresh the parent data
            if (content.includes('Registro masivo completado') || content.includes('ACCIÓN EJECUTADA')) {
                if (onRefresh) onRefresh();
            }
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
      } else if (action.type === 'ACTIVATE') {
        res = await fetch(`${baseUrl}/api/estudiantes/${action.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ estado: 'activo' })
        });
      } else if (action.type === 'DELETE') {
        res = await fetch(`${baseUrl}/api/estudiantes/${action.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (action.type === 'CREATE_NOTE') {
        res = await fetch(`${baseUrl}/api/notas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            estudiante_id: action.id,
            materia: action.materia,
            nota: action.nota,
            lapso: action.lapso || 1
          })
        });
      }

      if (res && res.ok) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[msgIndex].actionExecuted = true;
          newMessages[msgIndex].content += "\n\n✅ ACCIÓN EJECUTADA EXITOSAMENTE.";
          
          // Dispatch global refresh event
          window.dispatchEvent(new CustomEvent('refresh-dashboard'));
          
          if (onRefresh) onRefresh();
          return newMessages;
        });
      } else {
        const errData = res ? await res.json().catch(() => ({})) : {};
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[msgIndex].content += `\n\n❌ Error al ejecutar: ${errData.error || 'Fallo de conexión'}`;
          return newMessages;
        });
      }
    } catch (e) {
      console.error("Action Error:", e);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen flex flex-col bg-black overflow-hidden z-[1000]">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
      </div>

      {/* 🛠️ BOTÓN DE CIERRE FLOTANTE 🛠️ */}
      <motion.button
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         whileHover={{ scale: 1.1, rotate: 90 }}
         whileTap={{ scale: 0.9 }}
         onClick={onClose}
         className="fixed top-12 right-12 w-14 h-14 rounded-full apple-glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl z-[500] group"
      >
         <X className="w-6 h-6 transition-transform group-hover:rotate-0" />
      </motion.button>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-20 pt-40 pb-96 space-y-16 no-scrollbar scroll-smooth relative z-10"
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            {/* 🤖 LOGO CENTRAL INMERSIVO 🤖 */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="mb-12 flex flex-col items-center"
            >
               <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-1 flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-8 border border-white/10 group cursor-pointer" onClick={onClose}>
                  <img src={logo} className="w-full h-full object-cover rounded-[2.2rem] scale-110" alt="Logo" />
               </div>
               <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-white tracking-[0.3em] uppercase opacity-40">Núcleo de Inferencia</h2>
                  <p className="text-[10px] font-bold text-blue-500 tracking-[0.5em] uppercase">Andrés Bello v25.0 Platinum</p>
               </div>
            </motion.div>

          {messages.length === 1 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 space-y-16 flex flex-col items-center"
            >
              <div className="text-center space-y-4 max-w-2xl">
                 <h3 className="text-4xl font-semibold text-white/90 tracking-tight leading-none mb-4">¿En qué auditoría procedemos hoy?</h3>
                 <p className="text-[#86868b] font-medium text-lg leading-relaxed px-4">El Núcleo de Inferencia está listo para escanear matriculas, detectar riesgos de deserción o asistir en decisiones administrativas críticas.</p>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                  {[
                    { label: 'Analizar Deserción', icon: BrainCircuit, prompt: 'Realiza un análisis profundo de los estudiantes en riesgo de deserción', desc: 'Identifica patrones de riesgo académico' },
                    { label: 'Resumen de Notas', icon: GraduationCap, prompt: 'Dame un resumen de las calificaciones del 1er Lapso', desc: 'Visualiza el rendimiento por sección' },
                    { label: 'Estado del Personal', icon: Briefcase, prompt: '¿Cuál es el estado actual del personal docente?', desc: 'Auditoría de asistencia y cargos' },
                    { label: 'Optimizar Asistencia', icon: Zap, prompt: 'Sugiere mejoras para la asistencia en la sección 3A', desc: 'Estrategias de retención inmediata' }
                  ].map((tool, i) => (
                    <motion.button 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setInput(tool.prompt);
                        setTimeout(() => {
                          const fakeEvent = { preventDefault: () => {} };
                          handleSend(fakeEvent);
                        }, 100);
                      }}
                      className="p-12 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-blue-500/30 transition-all duration-500 text-left group shadow-2xl relative overflow-hidden backdrop-blur-xl"
                    >
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-500" />
                      <div className="absolute top-0 right-0 p-20 bg-blue-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600/10 flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-blue-600/20">
                            <tool.icon className="w-8 h-8" />
                         </div>
                         <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{tool.label}</h4>
                         <p className="text-xs font-medium text-[#86868b] tracking-wide leading-relaxed">{tool.desc}</p>
                      </div>
                      
                      <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                         <ArrowRight className="w-6 h-6 text-blue-500" />
                      </div>
                    </motion.button>
                  ))}
               </div>
            </motion.div>
          )}
        </div>

        {/* Message Mapping Area */}
        <div className="max-w-4xl mx-auto w-full space-y-12">
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
                              onClick={() => handleExecuteAction(i, m.action)}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-8 h-12 rounded-2xl shadow-xl shadow-blue-500/20"
                            >
                              EJECUTAR: {m.action.type}
                            </Button>
                            <Button 
                              variant="ghost"
                              onClick={() => {
                                const nm = [...messages];
                                nm[i].action = null;
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
      </div>


      {/* 📥 ÁREA DE INPUT FLOTANTE IA 📥 */}
      <div className="fixed bottom-0 left-0 right-0 p-12 z-[300]">
        <div className="max-w-4xl mx-auto">
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onSubmit={handleSend} 
            className="relative flex items-center group shadow-2xl"
          >
            <div className="absolute inset-0 bg-blue-600/10 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full pointer-events-none" />
            <button type="button" className="absolute left-8 p-3 rounded-2xl hover:bg-white/10 text-white/40 transition-colors z-20">
              <Plus className="w-6 h-6" />
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pregúntale al Núcleo de Inferencia..."
              className="w-full h-20 pl-24 pr-44 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 shadow-2xl transition-all relative z-10"
            />
            <div className="absolute right-5 flex items-center gap-4 z-20">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-widest uppercase">Nodo Seguro</span>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 rounded-2xl bg-white text-black flex flex-col items-center justify-center hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-95 shadow-xl"
              >
                {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 ml-0.5" />}
              </button>
            </div>
          </motion.form>
          <p className="text-center mt-6 text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] pointer-events-none">Tecnología Llama-3 de Groq • U.E. Andrés Bello</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;
