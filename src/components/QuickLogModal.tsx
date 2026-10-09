'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Building2, Home, CalendarOff, AlertCircle, Link2, FileText, Check } from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { WorkLog, WorkStatus } from '../types';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLog?: WorkLog | null;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  initialLog,
}) => {
  const { addLog, updateLog } = useWorkOS();

  const [date, setDate] = useState<string>('');
  const [status, setStatus] = useState<WorkStatus>('Office Present');
  const [tasks, setTasks] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [hours, setHours] = useState<number>(8.5);

  useEffect(() => {
    if (initialLog) {
      setDate(initialLog.date);
      setStatus(initialLog.status);
      setTasks(initialLog.tasks);
      setLink(initialLog.link || '');
      setNotes(initialLog.notes || '');
      setHours(initialLog.hours || 8.5);
    } else {
      // Default to today in YYYY-MM-DD
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
      setStatus('Office Present');
      setTasks('');
      setLink('');
      setNotes('');
      setHours(8.5);
    }
  }, [initialLog, isOpen]);

  // Handle status quick toggle hours
  const handleStatusChange = (newStatus: WorkStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Approved Leave' || newStatus === 'Emergency Leave') {
      setHours(0);
    } else if (newStatus === 'WFH') {
      setHours(8.0);
    } else {
      setHours(8.5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !tasks.trim()) return;

    if (initialLog) {
      updateLog({
        ...initialLog,
        date,
        status,
        tasks: tasks.trim(),
        link: link.trim() || undefined,
        notes: notes.trim() || undefined,
        hours: Number(hours),
      });
    } else {
      addLog({
        date,
        status,
        tasks: tasks.trim(),
        link: link.trim() || undefined,
        notes: notes.trim() || undefined,
        hours: Number(hours),
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              {initialLog ? 'Edit Work Log' : 'Quick Log Attendance'}
            </h2>
            <p className="text-xs text-zinc-400">
              Record today's deliverables and verify daily uptime
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Date Picker & Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Log Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 color-scheme-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Hours Contributed
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Status Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Attendance Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <button
                type="button"
                onClick={() => handleStatusChange('Office Present')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  status === 'Office Present'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Office</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('WFH')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  status === 'WFH'
                    ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 font-bold shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>WFH</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Approved Leave')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  status === 'Approved Leave'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CalendarOff className="w-3.5 h-3.5" />
                <span>Approved</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Emergency Leave')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  status === 'Emergency Leave'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 font-bold shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Emergency</span>
              </button>

            </div>
          </div>

          {/* Deliverables / Tasks Summary */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Deliverables / Tasks Built
            </label>
            <textarea
              rows={3}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="e.g. Built automated pricing sync pipeline and refactored responsive UI..."
              required
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Commit/PR Link */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Commit / PR / Module Link <span className="text-zinc-600 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://github.com/rkdai/... or module URL"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Notes / Blockers */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Notes or Blockers <span className="text-zinc-600 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Awaiting staging API credentials from backend team"
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{initialLog ? 'Save Changes' : 'Record Log (Enter)'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
