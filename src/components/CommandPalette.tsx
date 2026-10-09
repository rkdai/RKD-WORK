'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  LayoutDashboard, 
  CalendarCheck, 
  Layers, 
  Award, 
  Settings, 
  Download, 
  Upload, 
  X,
  Command
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenQuickLog: () => void;
  onOpenBulkBackfill: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenQuickLog,
  onOpenBulkBackfill,
}) => {
  const { exportJsonData, exportCsvData } = useWorkOS();
  const [query, setQuery] = useState('');

  const commands = [
    {
      id: 'quick-log',
      title: 'Quick Log Today\'s Work',
      subtitle: 'Log attendance status, tasks and hours in < 5s',
      icon: Plus,
      action: () => {
        onClose();
        onOpenQuickLog();
      },
    },
    {
      id: 'nav-dashboard',
      title: 'Open Dashboard & KPIs',
      subtitle: 'View uptime reliability, leaves, and attendance calendar',
      icon: LayoutDashboard,
      action: () => {
        onNavigate('dashboard');
        onClose();
      },
    },
    {
      id: 'nav-logs',
      title: 'Browse Work Logs',
      subtitle: 'Filter and search through daily deliverable records',
      icon: CalendarCheck,
      action: () => {
        onNavigate('logs');
        onClose();
      },
    },
    {
      id: 'nav-modules',
      title: 'Project Modules & Impact Tracker',
      subtitle: 'Review major business systems and AI pipelines built',
      icon: Layers,
      action: () => {
        onNavigate('modules');
        onClose();
      },
    },
    {
      id: 'nav-cert',
      title: 'Export Exit Credentials & Certificate',
      subtitle: 'Print or download official Experience & Relieving Certificate',
      icon: Award,
      action: () => {
        onNavigate('certificate');
        onClose();
      },
    },
    {
      id: 'bulk-backfill',
      title: 'Bulk Backfill & CSV Import',
      subtitle: 'Import past months of attendance entries',
      icon: Upload,
      action: () => {
        onClose();
        onOpenBulkBackfill();
      },
    },
    {
      id: 'export-json',
      title: 'Export Full JSON Backup',
      subtitle: 'Save local backup of all database records',
      icon: Download,
      action: () => {
        const jsonStr = exportJsonData();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workos_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Settings & Turso Edge Sync',
      subtitle: 'Configure company profile and database keys',
      icon: Settings,
      action: () => {
        onNavigate('settings');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl shadow-black relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800/80 mb-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to page... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto space-y-1 p-1">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-zinc-900/80 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 text-zinc-400 group-hover:text-amber-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                      {cmd.title}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {cmd.subtitle}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
