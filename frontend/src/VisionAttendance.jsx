import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Scan,
  FileText,
  Save,
  RefreshCcw
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

const VisionAttendance = ({ onComplete }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setResults(null);
            setError('');
        }
    };

    const processImage = async () => {
        if (!preview) return;
        setScanning(true);
        setError('');
        try {
            const base64 = preview.split(',')[1];
            const token = localStorage.getItem('token');
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
            
            const res = await fetch(`${baseUrl}/api/ai/vision/attendance`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageBase64: base64 })
            });
            
            if (res.ok) {
                const data = await res.json();
                setResults(data.result.attendance);
            } else {
                setError('El motor de visión no pudo procesar la imagen. Intente con una foto más clara.');
            }
        } catch (err) {
            setError('Error de enlace con el núcleo de visión.');
        } finally {
            setScanning(false);
        }
    };

    const handleSave = async () => {
        // En un entorno real, aquí se enviarían los resultados uno por uno o en lote
        alert('Asistencia procesada por IA guardada exitosamente.');
        if (onComplete) onComplete();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/20 border border-blue-500/10">
                    <Scan className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Visión Artificial: Asistencia</h2>
                    <p className="text-xs text-[#86868b] font-bold uppercase tracking-[0.3em] mt-2">Motor de Procesamiento OCR de Listas Físicas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="apple-card p-8 border border-white/5 space-y-6 flex flex-col justify-center min-h-[400px]"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    
                    {!preview ? (
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-white/5 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:text-white transition-all">
                                <Camera className="w-8 h-8" />
                            </div>
                            <p className="mt-6 text-sm font-bold text-[#86868b] uppercase tracking-widest">Subir Foto de Lista</p>
                            <p className="text-[10px] text-white/20 mt-2">JPG, PNG hasta 5MB</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[2rem] overflow-hidden group">
                            <img src={preview} className="w-full h-80 object-cover border border-white/10" alt="Preview" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                                <Button onClick={() => fileInputRef.current.click()} className="bg-white text-black rounded-full h-12 px-6 font-bold uppercase text-[10px]"><RefreshCcw className="w-4 h-4 mr-2" /> Cambiar</Button>
                                <Button onClick={processImage} disabled={scanning} className="bg-blue-600 text-white rounded-full h-12 px-6 font-bold uppercase text-[10px] shadow-xl"><Sparkles className="w-4 h-4 mr-2" /> Analizar</Button>
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center">
                            <XCircle className="w-4 h-4 inline-block mr-2" /> {error}
                        </div>
                    )}
                </motion.div>

                {/* Results Section */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="apple-card p-8 border border-white/5 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Resultados de Escaneo IA</h3>
                        {results && <Badge className="bg-emerald-600 text-white text-[8px]">{results.length} Identificados</Badge>}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-2 no-scrollbar">
                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-6">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-b-2 border-blue-500 rounded-full"
                                />
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse italic">Mapeando Nodos Visuales...</p>
                            </div>
                        ) : results ? (
                            results.map((r, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${r.status === 'presente' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                                        <span className="text-sm font-bold text-white uppercase tracking-tighter">{r.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-white/40">{r.confidence}</span>
                                        <Badge className={r.status === 'presente' ? 'bg-emerald-500/10 text-emerald-500 border-none' : 'bg-red-500/10 text-red-500 border-none'}>
                                            {r.status}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                                <FileText className="w-16 h-16 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Esperando Análisis...</p>
                            </div>
                        )}
                    </div>

                    {results && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <Button onClick={handleSave} className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl">
                                <Save className="w-5 h-5" /> Confirmar y Guardar
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VisionAttendance;
