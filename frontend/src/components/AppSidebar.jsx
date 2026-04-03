import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  PieChart, 
  LogOut,
  Building2,
  ChevronRight
} from 'lucide-react';
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
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";

const AppSidebar = ({ activeTab, onTabChange, userName }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Media General' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Asistencia' },
    { id: 'justifications', icon: FileText, label: 'Justificativos' },
    { id: 'reports', icon: PieChart, label: 'IA Analytics' },
  ];

  return (
    <Sidebar className="border-r border-white/[0.05] bg-black">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-2xl">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white leading-tight uppercase">Andrés Bello</span>
            <span className="text-[9px] font-medium text-zinc-500 mt-0.5 uppercase tracking-[0.2em] leading-none">
             Gestión Escolar
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 mb-6 px-4 uppercase">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`py-6 px-4 rounded-2xl transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-white/[0.08] text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <item.icon className={`mr-3 w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-zinc-600'}`} />
                    <span className="font-medium tracking-tight">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
              <span className="text-zinc-300 font-medium text-xs uppercase">{userName?.at(0) || 'A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white/90 leading-none">{userName || 'Administrador'}</span>
              <span className="text-[9px] font-medium text-zinc-600 mt-1 uppercase tracking-wider">Docente Guía</span>
            </div>
          </div>
        </div>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="py-5 px-4 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
            >
              <LogOut className="mr-3 w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="text-xs font-medium">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};


export default AppSidebar;

