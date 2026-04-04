import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  GraduationCap, 
  CalendarRange, 
  Briefcase, 
  Sparkles, 
  Settings as SettingsIcon,
  LogOut,
  Building2,
  ChevronRight,
  ShieldCheck,
  Search,
  Command
} from "lucide-react";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { Separator } from "./ui/separator";

const AppSidebar = ({ activeTab, onTabChange, userName }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', group: 'Núcleo' },
    { id: 'students', icon: Users, label: 'Matrícula Escolar', group: 'Gestión' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Control de Asistencia', group: 'Gestión' },
    { id: 'justifications', icon: FileText, label: 'Justificativos', group: 'Gestión' },
    { id: 'grades', icon: GraduationCap, label: 'Calificaciones', group: 'Académico' },
    { id: 'schedules', icon: CalendarRange, label: 'Horarios Académicos', group: 'Académico' },
    { id: 'staff', icon: Briefcase, label: 'Gestión Docente', group: 'Administración' },
    { id: 'analytics', icon: Sparkles, label: 'Inteligencia IA', group: 'Administración' },
    { id: 'settings', icon: SettingsIcon, label: 'Configuración', group: 'Sistema' },
  ];

  const groups = ['Núcleo', 'Gestión', 'Académico', 'Administración', 'Sistema'];

  return (
    <Sidebar className="border-r border-zinc-200/50 bg-white">
      <SidebarHeader className="p-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-zinc-900/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-zinc-900 leading-none">Andrés Bello</span>
            <span className="text-[10px] font-black text-zinc-400 mt-2 uppercase tracking-[0.3em] leading-none">
             Suite v10.0
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6 space-y-4">
        {groups.map((group) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel className="text-[10px] font-black tracking-[0.4em] text-zinc-300 mb-4 px-4 uppercase italic">
              {group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {menuItems.filter(item => item.group === group).map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`py-6 px-5 rounded-2xl transition-all duration-500 overflow-hidden relative group/item ${
                        activeTab === item.id 
                          ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-900/10' 
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                    >
                      <item.icon className={`mr-4 w-4.5 h-4.5 transition-transform duration-500 group-hover/item:scale-110 ${activeTab === item.id ? 'text-white' : 'text-zinc-400 group-hover/item:text-zinc-900'}`} />
                      <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                      
                      {activeTab === item.id && (
                        <motion.div 
                          layoutId="activeTabGlow"
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40" 
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-8">
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100/50 group cursor-default transition-all hover:border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-900 leading-none mb-1.5 uppercase tracking-wide">Acceso Seguro</span>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Admin • Docente Guía</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="flex items-center justify-between py-4 px-6 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
            </div>
            <ChevronRight className="w-3 h-3 translate-x-1 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
