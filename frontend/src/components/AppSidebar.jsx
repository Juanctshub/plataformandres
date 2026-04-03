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
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard General' },
    { id: 'students', icon: Users, label: 'Control Estudiantil' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Asistencia Diaria' },
    { id: 'justifications', icon: FileText, label: 'Justificaciones' },
    { id: 'reports', icon: PieChart, label: 'IA Analytics' },
  ];

  return (
    <Sidebar className="border-r border-zinc-800 bg-black">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 p-2 rounded-xl border-2 border-zinc-200">
            <Building2 className="w-6 h-6 text-zinc-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter text-zinc-100 leading-none">ANDRÉS BELLO</span>
            <span className="text-[10px] items-center flex gap-1 font-bold text-zinc-500 mt-1 uppercase tracking-widest leading-none">
             Unidad Educativa <ChevronRight className="w-2 h-2 text-zinc-700" /> 2026
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <Separator className="bg-zinc-800/50 mx-4 w-auto" />
      
      <SidebarContent className="p-4 px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black tracking-[3px] text-zinc-600 mb-4 px-2 uppercase">
            Gestión Académica
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`py-6 px-4 rounded-xl transition-all font-bold text-sm tracking-tight ${
                      activeTab === item.id 
                        ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200' 
                        : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/50'
                    }`}
                  >
                    <item.icon className={`mr-3 w-5 h-5 ${activeTab === item.id ? 'text-zinc-950' : 'text-zinc-600'}`} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-500/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <span className="text-zinc-300 font-bold text-sm uppercase">{userName?.at(0) || 'D'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-zinc-100 leading-none uppercase tracking-tight">{userName || 'Docente'}</span>
              <span className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest italic">Rol de Auditor</span>
            </div>
          </div>
        </div>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="py-6 px-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold text-sm tracking-tight group"
            >
              <LogOut className="mr-3 w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Cerrar Sesión Segura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
