'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  Database, 
  RefreshCcw, 
  Check, 
  AlertTriangle,
  Building2,
  User,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { EmployeeProfile, TursoSyncConfig } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    tursoConfig, 
    updateTursoConfig, 
    exportJsonData, 
    importJsonData, 
    exportCsvData, 
    resetToDefaultSeed 
  } = useWorkOS();

  const [formData, setFormData] = useState<EmployeeProfile>(profile);
  const [tursoForm, setTursoForm] = useState<TursoSyncConfig>(tursoConfig);
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    profile.responsibilities.join('\n')
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const respList = responsibilitiesText.split('\n').map((r) => r.trim()).filter(Boolean);
    updateProfile({
      ...formData,
      responsibilities: respList,
    });
    showToast('Employee & Company Profile saved successfully!');
  };

  const handleTursoSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTursoConfig(tursoForm);
    showToast('Turso database sync credentials updated!');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportJsonData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON backup downloaded!');
  };

  const handleDownloadCsv = () => {
    const csvStr = exportCsvData();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workos_attendance_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV logs exported!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJsonData(content);
      if (success) {
        showToast('Backup restored successfully!');
      } else {
        alert('Invalid JSON backup file format');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to the default March-October 2026 seed?')) {
      resetToDefaultSeed();
      showToast('Reset to default seed data complete!');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 rounded-xl bg-amber-500 text-zinc-950 font-bold px-4 py-2.5 shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
          WorkOS Configuration & Sync
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Customize corporate credentials, employee tenure variables, Turso edge sync, and backups.
        </p>
      </div>

      {/* SECTION 1: PROFILE & TENURE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <User className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-zinc-100">Employee & Company Credentials</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Employee Name</label>
              <input
                type="text"
                required
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Company Address</label>
              <input
                type="text"
                required
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Joining Date</label>
              <input
                type="date"
                required
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Relieving Date (Optional)</label>
              <input
                type="date"
                value={formData.relievingDate || ''}
                onChange={(e) => setFormData({ ...formData, relievingDate: e.target.value || undefined })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Manager / Signatory Name</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Manager Title</label>
              <input
                type="text"
                required
                value={formData.managerTitle}
                onChange={(e) => setFormData({ ...formData, managerTitle: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Annual Leaves Allowance</label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.leavesAllowance}
                onChange={(e) => setFormData({ ...formData, leavesAllowance: parseInt(e.target.value) || 18 })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              Key Responsibilities (Shown on Official Certificate, 1 per line)
            </label>
            <textarea
              rows={4}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Details</span>
            </button>
          </div>

        </form>
      </div>

      {/* SECTION 2: TURSO CLOUD DATABASE SYNC */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <Database className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Turso Edge Database Sync</h2>
            <p className="text-xs text-zinc-400">Optional: Connect your new Turso database for cross-device cloud sync</p>
          </div>
        </div>

        <form onSubmit={handleTursoSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Turso Database URL</label>
            <input
              type="text"
              value={tursoForm.databaseUrl}
              onChange={(e) => setTursoForm({ ...tursoForm, databaseUrl: e.target.value })}
              placeholder="libsql://your-db.turso.io"
              className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Turso Auth Token</label>
            <input
              type="password"
              value={tursoForm.authToken}
              onChange={(e) => setTursoForm({ ...tursoForm, authToken: e.target.value })}
              placeholder="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
              className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="tursoEnabled"
              checked={tursoForm.enabled}
              onChange={(e) => setTursoForm({ ...tursoForm, enabled: e.target.checked })}
              className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <label htmlFor="tursoEnabled" className="text-zinc-300 font-medium">
              Enable automatic background cloud sync with Turso
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-all border border-zinc-700/60"
            >
              <Save className="w-4 h-4" />
              <span>Save Database Config</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: BACKUP, RESTORE & EXPORT */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-zinc-100">Data Portability & Backups</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* JSON Backup */}
          <button
            onClick={handleDownloadBackup}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all text-center"
          >
            <Download className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-zinc-200">Export JSON Backup</span>
            <span className="text-[10px] text-zinc-500">Full dump of all logs, modules & profile</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleDownloadCsv}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all text-center"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200">Export Logs CSV</span>
            <span className="text-[10px] text-zinc-500">Spreadsheet-compatible work logs</span>
          </button>

          {/* Restore JSON */}
          <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all text-center cursor-pointer">
            <Upload className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-zinc-200">Restore Backup</span>
            <span className="text-[10px] text-zinc-500">Upload and merge JSON file</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

        </div>

        {/* Reset to Seed Data */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-300">Reset to Default March-October Seed</span>
            <p className="text-[11px] text-zinc-500">Restores all 160+ curated work logs and project modules.</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>

      </div>

    </div>
  );
};
