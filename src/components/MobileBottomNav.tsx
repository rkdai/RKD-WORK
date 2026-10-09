'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Layers, 
  Award, 
  Settings,
  Plus
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickLog: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickLog,
}) => {
  const items = [
    { id: 'dashboard', label: 'Stats', icon: LayoutDashboard },
    { id: 'logs', label: 'Logs', icon: CalendarCheck },
    { id: 'modules', label: 'Projects', icon: Layers },
    { id: 'certificate', label: 'Export', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)] bg-zinc-950/95 border-t border-zinc-800/90 backdrop-blur-lg">
      <div className="relative flex items-center justify-around px-2 py-1.5 h-16">
        
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
                isActive ? 'text-amber-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-amber-400/10' : ''}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Action FAB */}
        <button
          onClick={onOpenQuickLog}
          className="absolute -top-5 right-5 h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          aria-label="Quick Log Today"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>

      </div>
    </div>
  );
};
