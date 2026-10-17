'use client';

import React, { useState, useEffect } from 'react';
import { Share2, PlusSquare, X, Bell, Check } from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';

export const IosPwaPrompt: React.FC = () => {
  const { notifications, requestNotificationPermission } = useWorkOS();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running on iOS (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIosDevice(isIos);

    // Check if already launched as standalone PWA
    const standalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Only show install prompt banner if on iOS and not yet installed
    const dismissed = sessionStorage.getItem('rkd_ios_prompt_dismissed');
    if (isIos && !standalone && !dismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('rkd_ios_prompt_dismissed', '1');
  };

  return (
    <>
      {/* 1. iOS Add to Home Screen Banner (when viewing in mobile Safari) */}
      {showPrompt && (
        <div className="fixed bottom-20 left-4 right-4 md:hidden z-50 rounded-2xl border border-amber-500/40 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-amber-500/40 flex items-center justify-center font-serif text-sm font-black text-amber-400 shrink-0">
                RKD
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100">Add WorkOS to iPhone Home Screen</h3>
                <p className="text-[11px] text-zinc-400">Install to enable daily attendance push notifications.</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="flex items-center gap-1.5">
              1. Tap Share <Share2 className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <span className="text-zinc-500">&rarr;</span>
            <span className="flex items-center gap-1.5">
              2. <PlusSquare className="w-3.5 h-3.5 text-amber-400" /> Add to Home Screen
            </span>
          </div>
        </div>
      )}

      {/* 2. Permission Request Banner (when opened in standalone PWA or desktop, but permission not yet granted) */}
      {notifications.permission !== 'granted' && notifications.isEnabled && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 p-3 sm:px-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-100">Daily Attendance Reminder: </span>
                <span className="text-zinc-400">
                  Enable browser notification permission to get reminded daily at {notifications.reminderTime || '10:00 AM'}.
                </span>
              </div>
            </div>

            <button
              onClick={requestNotificationPermission}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-all text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Enable Reminders</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
