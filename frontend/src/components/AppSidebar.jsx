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
    <Sidebar className="border-r border-zinc-100 bg-white shadow-sm">
      <SidebarHeader className="p-8 pb-6">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-500">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tighter text-zinc-950 leading-none uppercase italic">Andrés Bello</span>
            <span className="text-[9px] font-black text-zinc-300 mt-1.5 uppercase tracking-widest leading-none">
             Suite v12.0 • Lucid
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 space-y-2">
        {groups.map((group) => (
          <SidebarGroup key={group} className="p-0">
            <SidebarGroupLabel className="text-[8px] font-black tracking-[0.4em] text-zinc-400 mb-4 px-4 uppercase opacity-80 mt-6">
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
                          ? 'bg-zinc-950 text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      <item.icon className={`mr-3 w-4 h-4 transition-colors ${activeTab === item.id ? 'text-white' : 'text-zinc-400 group-hover/item:text-black'}`} />
                      <span className="font-bold text-[10px] uppercase tracking-widest leading-none">{item.label}</span>
                      
                      {activeTab === item.id && (
                        <div className="absolute right-3 w-1 h-1 rounded-full bg-white opacity-40" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-zinc-50">
        <div className="flex flex-col gap-2">
          <div className="p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 group cursor-default transition-all hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-900 uppercase">Seguridad Activa</span>
                <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5 opacity-60">Terminal Estándar</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="flex items-center justify-between h-10 px-4 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
