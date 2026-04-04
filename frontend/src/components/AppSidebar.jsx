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
    <Sidebar className="border-r border-white/5 bg-black shadow-none">
      <SidebarHeader className="p-8 pb-6">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all duration-500">
            <Building2 className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tighter text-white leading-none uppercase italic">Andrés Bello</span>
            <span className="text-[9px] font-black text-white/20 mt-1.5 uppercase tracking-widest leading-none">
             Apple Pro v14.0
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 space-y-2">
        {groups.map((group) => (
          <SidebarGroup key={group} className="p-0">
            <SidebarGroupLabel className="text-[8px] font-black tracking-[0.4em] text-white/20 mb-4 px-4 uppercase mt-6">
              {group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {menuItems.filter(item => item.group === group).map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`h-11 px-4 rounded-xl transition-all duration-300 relative group/item ${
                        activeTab === item.id 
                          ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className={`mr-3 w-4 h-4 transition-colors ${activeTab === item.id ? 'text-black' : 'text-white/20 group-hover/item:text-white'}`} strokeWidth={1.5} />
                      <span className="font-bold text-[10px] uppercase tracking-widest leading-none">{item.label}</span>
                      
                      {activeTab === item.id && (
                        <div className="absolute right-3 w-1 h-1 rounded-full bg-black/40" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/5">
        <div className="flex flex-col gap-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group cursor-default transition-all hover:bg-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white uppercase">Acceso Pro</span>
                <span className="text-[8px] font-bold text-white/20 uppercase mt-0.5">Andrés Bello IT</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="flex items-center justify-between h-10 px-4 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
