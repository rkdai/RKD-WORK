'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Save, 
  Check, 
  AlertCircle,
  Database, 
  Download, 
  FileSpreadsheet,
  User,
  ShieldCheck,
  Smartphone,
  Share2
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { EmployeeProfile, TursoSyncConfig } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    tursoConfig, 
    updateTursoConfig, 
    notifications,
    updateNotificationSettings,
    requestNotificationPermission,
    sendTestNotification,
    exportJsonData, 
    exportCsvData, 
  } = useWorkOS();

  const [formData, setFormData] = useState<EmployeeProfile>(profile);
  const [tursoForm, setTursoForm] = useState<TursoSyncConfig>(tursoConfig);
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    profile.responsibilities.join('\n')
  );

  // Notification state
  const [reminderTime, setReminderTime] = useState(notifications.reminderTime || '10:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(notifications.isEnabled);

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
    showToast('Employee profile saved successfully!');
  };

  const handleTursoSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTursoConfig(tursoForm);
    showToast('Turso database sync credentials updated!');
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateNotificationSettings({
      reminderTime,
      isEnabled: notificationsEnabled,
    });
    showToast(`Reminder set for ${reminderTime} daily & synced to Turso!`);
  };

  const handleEnablePermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showToast('Notification permission granted!');
    } else {
      showToast('Permission not granted. Please check browser settings or add to iOS home screen.');
    }
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
          Preferences & Sync Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure daily attendance notification schedule, iOS PWA permissions, Turso edge database, and verified profile credentials.
        </p>
      </div>

      {/* SECTION 1: DAILY ATTENDANCE NOTIFICATION SCHEDULE */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Daily Attendance Reminder</h2>
              <p className="text-xs text-zinc-400">Customizable scheduled reminder with Turso cloud persistence</p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            notifications.permission === 'granted'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${notifications.permission === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            {notifications.permission === 'granted' ? 'Active / Permitted' : 'Action Required'}
          </span>
        </div>

        <form onSubmit={handleSaveNotifications} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reminder Time Picker */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Reminder Time (Daily)</span>
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm font-semibold focus:outline-none focus:border-amber-400 color-scheme-dark"
                required
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Default: <strong>10:00 AM</strong>. You will receive a reminder to mark attendance every morning.
              </p>
            </div>

            {/* Toggle Enable */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">
                Notification State
              </label>
              <div className="flex items-center gap-3 h-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-xs font-medium text-zinc-200">
                    {notificationsEnabled ? 'Reminders Enabled' : 'Reminders Muted'}
                  </span>
                </label>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Reminders will automatically stop once today&apos;s attendance is marked.
              </p>
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              {notifications.permission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleEnablePermission}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Allow Notifications</span>
                </button>
              )}

              <button
                type="button"
                onClick={sendTestNotification}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all border border-zinc-700/60"
              >
                Send Test Reminder
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-zinc-950 font-bold transition-all shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save & Sync Schedule</span>
            </button>
          </div>

        </form>

        {/* iPhone / iOS Special Guide Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-3 text-[11px]">
          <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-zinc-400">
            <span className="font-semibold text-zinc-200">iPhone / iOS Users: </span>
            Apple requires you to add this app to your Home Screen to receive native push notifications. In Safari, tap <strong className="text-zinc-200">Share (⎋)</strong> &rarr; <strong className="text-zinc-200">Add to Home Screen (⊞)</strong>, then open the app icon from your home screen and allow notifications.
          </div>
        </div>

      </div>

      {/* SECTION 2: TURSO CLOUD DATABASE CONFIGURATION */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Turso Cloud Database Edge Sync</h2>
            <p className="text-xs text-zinc-400">Direct libSQL replication for real-time attendance and preference storage</p>
          </div>
        </div>

        <form onSubmit={handleTursoSave} className="space-y-4 text-xs">
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
            <label htmlFor="tursoEnabled" className="text-zinc-300 font-medium cursor-pointer">
              Enable automatic background cloud synchronization with Turso
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

      {/* SECTION 3: EMPLOYEE & COMPANY PROFILE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <User className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Employee & Company Credentials</h2>
            <p className="text-xs text-zinc-400">Verified official record authorized by Director Kunal Jain</p>
          </div>
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
              <label className="block text-zinc-400 font-semibold mb-1">Director / Authorized Signatory</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Director Title</label>
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
                required
                min="0"
                value={formData.leavesAllowance}
                onChange={(e) => setFormData({ ...formData, leavesAllowance: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-all border border-zinc-700/60"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: DATA EXPORT */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Data Portability & Export</h2>
            <p className="text-xs text-zinc-400">Download verified attendance logs and full backups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* JSON Backup */}
          <button
            onClick={handleDownloadBackup}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all text-center"
          >
            <Download className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-zinc-200">Export Full JSON Backup</span>
            <span className="text-[10px] text-zinc-500">Includes all verified logs & profile data</span>
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

        </div>
      </div>

    </div>
  );
};
