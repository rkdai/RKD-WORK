'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Layers, 
  Award, 
  Settings, 
  Plus, 
  Command,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickLog: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickLog,
  onOpenCommandPalette,
}) => {
  const { stats, profile } = useWorkOS();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & KPIs', icon: LayoutDashboard },
    { id: 'logs', label: 'Work Logs', icon: CalendarCheck },
    { id: 'modules', label: 'Project Modules', icon: Layers },
    { id: 'certificate', label: 'Export Credentials', icon: Award },
    { id: 'settings', label: 'Settings & Sync', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/60 shadow-sm">
            <span className="font-serif text-sm font-black tracking-wider text-amber-400">RKD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-zinc-100">WorkOS</span>
              <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate max-w-[180px] sm:max-w-none">
              {profile.designation} &bull; {profile.employeeName}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-zinc-900/60 p-1 border border-zinc-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions (Cmd+K and Quick Log) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Keyboard command prompt */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            title="Command Palette (Cmd+K or Ctrl+K)"
          >
            <Command className="h-3 w-3" />
            <span className="font-mono text-[10px]">⌘K</span>
          </button>

          {/* Quick Log button */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span className="font-bold">Log Today</span>
            <kbd className="hidden lg:inline-block ml-1 rounded bg-black/20 px-1 text-[9px] font-mono text-zinc-950">
              N
            </kbd>
          </button>
        </div>

      </div>
    </header>
  );
};
