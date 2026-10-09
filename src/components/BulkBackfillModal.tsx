'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';

interface BulkBackfillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkBackfillModal: React.FC<BulkBackfillModalProps> = ({ isOpen, onClose }) => {
  const { importCsvData, exportCsvData } = useWorkOS();
  const [csvText, setCsvText] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    if (!csvText.trim()) return;
    const count = importCsvData(csvText);
    if (count > 0) {
      setResultMessage(`Successfully imported and merged ${count} work logs!`);
      setTimeout(() => {
        setResultMessage(null);
        setCsvText('');
        onClose();
      }, 1500);
    } else {
      setResultMessage('Invalid CSV format. Please verify headers: Date,Status,Tasks,Link,Notes,Hours');
    }
  };

  const handleDownloadSample = () => {
    const sample = `Date,Status,Tasks,Link,Notes,Hours
2026-03-05,Office Present,"Architected initial catalog database schema","https://github.com/rkdai/repo/commit/abc","Setup complete",8.5
2026-03-06,WFH,"Implemented Redis caching layer","https://github.com/rkdai/repo/commit/def","",8.0
2026-03-09,Office Present,"Refactored API error handling","",No blockers,8.5`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workos_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Bulk Backfill & CSV Import</h2>
            <p className="text-xs text-zinc-400">Import past months of attendance and work deliverables quickly</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 mb-4 text-xs text-zinc-300">
          <div>
            <span className="font-semibold text-zinc-200">Format:</span> Date (YYYY-MM-DD), Status, Tasks, Link, Notes, Hours
          </div>
          <button
            onClick={handleDownloadSample}
            className="text-amber-400 hover:underline font-medium text-[11px] whitespace-nowrap ml-2"
          >
            Download Template
          </button>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Paste CSV Data
          </label>
          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`Date,Status,Tasks,Link,Notes,Hours\n2026-03-02,Office Present,"Onboarding and project setup",,,8.5`}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        {resultMessage && (
          <div className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
            resultMessage.startsWith('Successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {resultMessage.startsWith('Successfully') ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{resultMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Process Bulk Import</span>
          </button>
        </div>

      </div>
    </div>
  );
};
