import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Menu,
  ChevronRight,
  User as UserIcon,
  Cpu,
  Building2
} from 'lucide-react';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Students from './Students';
import AttendanceSheet from './AttendanceSheet';
import Justifications from './Justifications';
import IAAnalytics from './IAAnalytics';

import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SplashScreen = () => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-12"
    >
      <div className="relative w-20 h-20">
        <Building2 className="w-full h-full text-white" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white blur-2xl rounded-full"
        />
      </div>
      
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-medium tracking-[-0.02em] text-white">Andrés Bello</h1>
        <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-zinc-500">Núcleo Institucional</p>
      </div>
    </motion.div>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, attendance: '98.5%', risks: 0 });
  const [aiData, setAiData] = useState({ title: '', security: '', alerts: [] });
  const [isInitializing, setIsInitializing] = useState(true);

  const [AppSidebar, setAppSidebar] = useState(null);

  useEffect(() => {
    import('./components/AppSidebar').then(module => {
      setAppSidebar(() => module.default);
    });
  }, []);

  useEffect(() => {
    if (!token) {
        setIsInitializing(false);
        return;
    }
    const fetchData = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resStd, resAi] = await Promise.all([
          fetch(`${baseUrl}/api/estudiantes`, { headers }),
          fetch(`${baseUrl}/api/ai/analytics`, { headers })
        ]);
        
        const stds = await resStd.json();
        const ai = await resAi.json();
        
        setStats(prev => ({
          ...prev,
          students: stds.length,
          risks: ai.alerts ? ai.alerts.filter(a => a.type === 'danger').length : 0
        }));
        setAiData(ai);
        
        setTimeout(() => setIsInitializing(false), 2000);
      } catch (e) { 
        console.error('Error sincronizando datos...', e); 
        setIsInitializing(false);
      }
    };
    fetchData();
  }, [token]);

  if (isInitializing) return <SplashScreen />;
  if (!token) return <Login onLogin={(data) => { setToken(data.token); setUser(data.user); }} />;
  if (!AppSidebar) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userName={user?.username} 
        />
        
        <SidebarInset className="bg-black relative overflow-hidden border-none shadow-none">
          {/* Subtle Glow */}
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] pointer-events-none rounded-full" />
          
          <header className="flex h-16 shrink-0 items-center justify-between px-8 sticky top-0 bg-black/60 backdrop-blur-xl z-30 border-b border-white/[0.05]">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg" />
              <div className="h-4 w-[1px] bg-white/10 mx-2" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tracking-tight text-white/90">Andrés Bello</span>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className="text-xs font-medium text-zinc-500 capitalize">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-medium text-zinc-400">Node Secure</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-full"
              >
                {activeTab === 'dashboard' && <Dashboard stats={stats} aiData={aiData} />}
                {activeTab === 'students' && <Students />}
                {activeTab === 'attendance' && <AttendanceSheet />}
                {activeTab === 'justifications' && <Justifications />}
                {activeTab === 'reports' && <IAAnalytics />}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="h-16 flex items-center px-8 justify-between opacity-20 hover:opacity-100 transition-opacity duration-700">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              © 2026 UNIDAD EDUCATIVA ANDRÉS BELLO
            </span>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default App;

