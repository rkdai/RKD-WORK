'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { DashboardView } from '../components/DashboardView';
import { ModulesView } from '../components/ModulesView';
import { ExperienceCertificateView } from '../components/ExperienceCertificateView';
import { SettingsView } from '../components/SettingsView';
import { QuickLogModal } from '../components/QuickLogModal';
import { BulkBackfillModal } from '../components/BulkBackfillModal';
import { CommandPalette } from '../components/CommandPalette';
import { WorkLog } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null);
  const [isBulkBackfillOpen, setIsBulkBackfillOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listeners (Cmd+K / Ctrl+K and N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.tagName === 'SELECT';

      // Cmd+K or Ctrl+K opens Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 'N' opens Quick Log Modal when not typing in an input
      if (!isInput && e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setEditingLog(null);
        setIsQuickLogOpen(true);
        return;
      }

      // ESC closes open modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (isQuickLogOpen) setIsQuickLogOpen(false);
        if (isBulkBackfillOpen) setIsBulkBackfillOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isQuickLogOpen, isBulkBackfillOpen]);

  const handleEditLog = (log: WorkLog) => {
    setEditingLog(log);
    setIsQuickLogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingLog(null);
    setIsQuickLogOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Top Header / Desktop Nav */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={handleOpenAdd}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenQuickLog={handleOpenAdd}
            onEditLog={handleEditLog}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'logs' && (
          <DashboardView
            onOpenQuickLog={handleOpenAdd}
            onEditLog={handleEditLog}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesView />
        )}

        {activeTab === 'certificate' && (
          <ExperienceCertificateView />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Mobile Bottom Navigation (iPhone 11 & Touch screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={handleOpenAdd}
      />

      {/* Quick Log Attendance Modal / Drawer */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => {
          setIsQuickLogOpen(false);
          setEditingLog(null);
        }}
        initialLog={editingLog}
      />

      {/* Bulk Backfill / CSV Import Modal */}
      <BulkBackfillModal
        isOpen={isBulkBackfillOpen}
        onClose={() => setIsBulkBackfillOpen(false)}
      />

      {/* Fast Keyboard Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onOpenQuickLog={handleOpenAdd}
        onOpenBulkBackfill={() => setIsBulkBackfillOpen(true)}
      />

    </div>
  );
}
