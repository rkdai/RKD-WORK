'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { WorkLog, ProjectModule, EmployeeProfile, TursoSyncConfig, NotificationSettings } from '../types';
import { DEFAULT_PROFILE, INITIAL_MODULES, generateCuratedPastLogs } from '../data/seedData';

interface WorkOSContextType {
  logs: WorkLog[];
  modules: ProjectModule[];
  profile: EmployeeProfile;
  tursoConfig: TursoSyncConfig;
  notifications: NotificationSettings;
  isLoading: boolean;
  
  // Actions
  addLog: (log: Omit<WorkLog, 'id'>) => void;
  updateLog: (log: WorkLog) => void;
  deleteLog: (id: string) => void;
  bulkAddLogs: (newLogs: Omit<WorkLog, 'id'>[]) => void;
  
  addModule: (mod: Omit<ProjectModule, 'id'>) => void;
  updateModule: (mod: ProjectModule) => void;
  deleteModule: (id: string) => void;
  
  updateProfile: (profile: EmployeeProfile) => void;
  updateTursoConfig: (config: TursoSyncConfig) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  
  exportJsonData: () => string;
  importJsonData: (jsonStr: string) => boolean;
  exportCsvData: () => string;
  importCsvData: (csvStr: string) => number;
  resetToDefaultSeed: () => void;
  
  // KPIs
  stats: {
    totalDays: number;
    officeDays: number;
    wfhDays: number;
    leavesTaken: number;
    leavesRemaining: number;
    reliabilityPercent: number;
    shippedModules: number;
    totalHours: number;
  };
}

const WorkOSContext = createContext<WorkOSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LOGS: 'workos_logs_v1',
  MODULES: 'workos_modules_v1',
  PROFILE: 'workos_profile_v1',
  TURSO: 'workos_turso_v1',
  NOTIFICATIONS: 'workos_notifications_v1',
};

export const WorkOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [modules, setModules] = useState<ProjectModule[]>(INITIAL_MODULES);
  const [profile, setProfile] = useState<EmployeeProfile>(DEFAULT_PROFILE);
  const [tursoConfig, setTursoConfig] = useState<TursoSyncConfig>({
    databaseUrl: '',
    authToken: '',
    enabled: false,
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    reminderTime: '10:00',
    isEnabled: true,
    permission: 'default',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    async function initData() {
      try {
        const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
        const savedModules = localStorage.getItem(STORAGE_KEYS.MODULES);
        const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        const savedTurso = localStorage.getItem(STORAGE_KEYS.TURSO);

        let initialTursoConfig: TursoSyncConfig = {
          databaseUrl: 'libsql://workos-rkdai.aws-ap-south-1.turso.io',
          authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mjg4ODIsImlkIjoiMDFhMTFmNzEtMTQwMS03NzBmLWE1MmQtNTJmNDljNzM3NTE1Iiwia2lkIjoiN0RHNU9lQ2NLQ1pvZ1VjbUFaV2JKTUhObGFzOWN2b2NBR1VJUmRSUmZEdyIsInJpZCI6IjlhMjVmOGJmLTUxMGQtNGQ5My05YzljLWYxNGZhNDBkMjM5NiJ9.3EfPQ_euLRZQUIBqs7tEE-x6aFfdw6W8ixE6Q6b4Blbyb8inHuWnJbFbspvy3mIrRAiH-LZwVZUgjRFdJ-T7CA',
          enabled: true,
        };

        if (savedTurso) {
          try {
            const parsedTurso = JSON.parse(savedTurso);
            if (parsedTurso.databaseUrl) {
              initialTursoConfig = parsedTurso;
            }
          } catch (e) {
            console.error('Turso config parse error:', e);
          }
        }
        setTursoConfig(initialTursoConfig);

        // Attempt background pull from Turso if configured
        if (initialTursoConfig.enabled && initialTursoConfig.databaseUrl && initialTursoConfig.authToken) {
          try {
            const { pullFromTurso } = await import('../lib/tursoSync');
            const cloudData = await pullFromTurso(initialTursoConfig);
            if (cloudData.logs && cloudData.logs.length > 0) {
              setLogs(cloudData.logs);
              localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(cloudData.logs));
            }
            if (cloudData.modules && cloudData.modules.length > 0) {
              setModules(cloudData.modules);
              localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(cloudData.modules));
            }
            if (cloudData.profile) {
              setProfile(cloudData.profile);
              localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cloudData.profile));
            }
            setIsLoading(false);
            return;
          } catch (cloudErr) {
            console.warn('Could not fetch from Turso cloud initially, falling back to local storage:', cloudErr);
          }
        }

        // Load notification settings
        const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        let curNotifs: NotificationSettings = {
          reminderTime: '10:00',
          isEnabled: true,
          permission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
        };
        if (savedNotifs) {
          try {
            const parsed = JSON.parse(savedNotifs);
            curNotifs = { ...curNotifs, ...parsed };
          } catch (e) {
            console.error('Failed to parse saved notifications:', e);
          }
        }
        setNotifications(curNotifs);

        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        } else {
          const seeded = generateCuratedPastLogs();
          setLogs(seeded);
          localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(seeded));
        }

        if (savedModules) {
          setModules(JSON.parse(savedModules));
        } else {
          localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
        }

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        }

        // Pull Turso notification settings if available
        if (initialTursoConfig.enabled && initialTursoConfig.databaseUrl && initialTursoConfig.authToken) {
          import('../lib/tursoSync').then(async ({ pullNotificationSettingsFromTurso }) => {
            const remoteNotifs = await pullNotificationSettingsFromTurso(initialTursoConfig);
            if (remoteNotifs) {
              setNotifications((prev) => {
                const merged: NotificationSettings = {
                  ...prev,
                  reminderTime: remoteNotifs.reminderTime || prev.reminderTime,
                  isEnabled: remoteNotifs.isEnabled !== undefined ? remoteNotifs.isEnabled : prev.isEnabled,
                  lastNotifiedDate: remoteNotifs.lastNotifiedDate || prev.lastNotifiedDate,
                };
                localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(merged));
                return merged;
              });
            }
          }).catch(console.error);
        }
      } catch (e) {
        console.error('Error loading WorkOS storage:', e);
        setLogs(generateCuratedPastLogs());
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Save helpers
  const saveLogs = (newLogs: WorkLog[]) => {
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
  };

  const saveModules = (newModules: ProjectModule[]) => {
    setModules(newModules);
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(newModules));
  };

  const saveProfile = (newProfile: EmployeeProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
  };

  const saveTurso = (newTurso: TursoSyncConfig) => {
    setTursoConfig(newTurso);
    localStorage.setItem(STORAGE_KEYS.TURSO, JSON.stringify(newTurso));
  };

  const saveNotifications = (newNotifs: NotificationSettings) => {
    setNotifications(newNotifs);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newNotifs));
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    const updated: NotificationSettings = {
      ...notifications,
      ...settings,
    };
    saveNotifications(updated);

    // Push to Turso cloud
    if (tursoConfig.enabled && tursoConfig.databaseUrl && tursoConfig.authToken) {
      import('../lib/tursoSync').then(({ pushNotificationSettingsToTurso }) => {
        pushNotificationSettingsToTurso(tursoConfig, updated.reminderTime, updated.isEnabled, updated.lastNotifiedDate)
          .catch((err) => console.error('Turso notification sync error:', err));
      });
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Notifications are not supported in this browser. On iPhone, make sure to "Add to Home Screen" first.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const updated: NotificationSettings = {
        ...notifications,
        permission,
        isEnabled: permission === 'granted',
      };
      saveNotifications(updated);

      if (permission === 'granted') {
        // Send a welcome notification
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SEND_NOTIFICATION',
            title: 'Attendance Reminder Enabled',
            options: {
              body: `Daily attendance reminder set for ${updated.reminderTime} every morning.`,
              icon: '/icons/icon-192.png',
              badge: '/icons/icon-192.png',
              tag: 'rkd-welcome-reminder',
            },
          });
        } else {
          new Notification('Attendance Reminder Enabled', {
            body: `Daily attendance reminder set for ${updated.reminderTime} every morning.`,
            icon: '/icons/icon-192.png',
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  };

  const sendTestNotification = () => {
    if (typeof window === 'undefined') return;

    if (!('Notification' in window)) {
      alert('Notifications are not supported on this browser. On iOS, add to Home Screen first.');
      return;
    }

    if (Notification.permission !== 'granted') {
      requestNotificationPermission();
      return;
    }

    const title = 'RKD WorkOS Attendance Reminder';
    const options = {
      body: `Hi ${profile.employeeName.split(' ')[0]}, please mark your attendance and log today's deliverables!`,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'workos-test-reminder',
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_NOTIFICATION',
        title,
        options,
      });
    } else {
      new Notification(title, options);
    }
  };

  // Daily Timer Check Effect: checks if time >= reminderTime and hasn't logged today
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkReminder = () => {
      if (!notifications.isEnabled) return;
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') return;

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);

      // Check if user has already marked attendance for today
      const alreadyLogged = logs.some((l) => l.date === todayStr);
      if (alreadyLogged) return;

      // Check if already notified today
      if (notifications.lastNotifiedDate === todayStr) return;

      // Parse user's reminderTime (e.g. "10:00")
      const [targetHours, targetMinutes] = (notifications.reminderTime || '10:00').split(':').map(Number);
      const curHours = now.getHours();
      const curMinutes = now.getMinutes();

      if (curHours > targetHours || (curHours === targetHours && curMinutes >= targetMinutes)) {
        // Trigger notification
        const title = 'Mark Today\'s Attendance';
        const options = {
          body: `Hi ${profile.employeeName.split(' ')[0]}, please mark your attendance and log your deliverables for RKD Furnishings.`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: `workos-daily-${todayStr}`,
        };

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SEND_NOTIFICATION',
            title,
            options,
          });
        } else if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, options);
        }

        // Mark notified today
        const updatedNotifs = {
          ...notifications,
          lastNotifiedDate: todayStr,
        };
        saveNotifications(updatedNotifs);

        if (tursoConfig.enabled && tursoConfig.databaseUrl && tursoConfig.authToken) {
          import('../lib/tursoSync').then(({ pushNotificationSettingsToTurso }) => {
            pushNotificationSettingsToTurso(tursoConfig, updatedNotifs.reminderTime, updatedNotifs.isEnabled, todayStr)
              .catch(console.error);
          });
        }
      }
    };

    // Check on mount and every 30 seconds
    checkReminder();
    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [notifications, logs, profile.employeeName, tursoConfig]);

  // Log CRUD
  const addLog = (logData: Omit<WorkLog, 'id'>) => {
    const newLog: WorkLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    // Upsert if same date already exists
    const existingIndex = logs.findIndex((l) => l.date === logData.date);
    let updated: WorkLog[];
    if (existingIndex >= 0) {
      updated = [...logs];
      updated[existingIndex] = newLog;
    } else {
      updated = [newLog, ...logs];
    }
    updated.sort((a, b) => b.date.localeCompare(a.date));
    saveLogs(updated);

    // Background push to Turso
    if (tursoConfig.enabled && tursoConfig.databaseUrl && tursoConfig.authToken) {
      import('../lib/tursoSync').then(({ pushLogToTurso }) => {
        pushLogToTurso(tursoConfig, newLog).catch((err) => console.error('Turso sync push failed:', err));
      });
    }
  };

  const updateLog = (log: WorkLog) => {
    const updated = logs.map((l) => (l.id === log.id ? log : l));
    updated.sort((a, b) => b.date.localeCompare(a.date));
    saveLogs(updated);

    // Background push to Turso
    if (tursoConfig.enabled && tursoConfig.databaseUrl && tursoConfig.authToken) {
      import('../lib/tursoSync').then(({ pushLogToTurso }) => {
        pushLogToTurso(tursoConfig, log).catch((err) => console.error('Turso sync push failed:', err));
      });
    }
  };

  const deleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogs(updated);

    // Background delete on Turso
    if (tursoConfig.enabled && tursoConfig.databaseUrl && tursoConfig.authToken) {
      import('../lib/tursoSync').then(({ deleteLogFromTurso }) => {
        deleteLogFromTurso(tursoConfig, id).catch((err) => console.error('Turso sync delete failed:', err));
      });
    }
  };

  const bulkAddLogs = (newLogsData: Omit<WorkLog, 'id'>[]) => {
    const dateMap = new Map<string, WorkLog>();
    logs.forEach((l) => dateMap.set(l.date, l));

    newLogsData.forEach((item) => {
      const id = dateMap.get(item.date)?.id || `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      dateMap.set(item.date, { ...item, id });
    });

    const updated = Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
    saveLogs(updated);
  };

  // Module CRUD
  const addModule = (modData: Omit<ProjectModule, 'id'>) => {
    const newMod: ProjectModule = {
      ...modData,
      id: `mod-${Date.now()}`,
    };
    saveModules([newMod, ...modules]);
  };

  const updateModule = (mod: ProjectModule) => {
    saveModules(modules.map((m) => (m.id === mod.id ? mod : m)));
  };

  const deleteModule = (id: string) => {
    saveModules(modules.filter((m) => m.id !== id));
  };

  // Backup / Export
  const exportJsonData = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      modules,
      logs,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importJsonData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) saveProfile(data.profile);
      if (Array.isArray(data.modules)) saveModules(data.modules);
      if (Array.isArray(data.logs)) saveLogs(data.logs);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const exportCsvData = () => {
    const headers = ['Date', 'Status', 'Tasks', 'Link', 'Notes', 'Hours'];
    const rows = logs.map((l) => [
      `"${l.date}"`,
      `"${l.status}"`,
      `"${(l.tasks || '').replace(/"/g, '""')}"`,
      `"${(l.link || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.hours || 0,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const importCsvData = (csvStr: string): number => {
    try {
      const lines = csvStr.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return 0;

      const parsed: Omit<WorkLog, 'id'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts[0] && parts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
          const status = (['Office Present', 'WFH', 'Approved Leave', 'Emergency Leave'].includes(parts[1])
            ? parts[1]
            : 'Office Present') as WorkLog['status'];
          parsed.push({
            date: parts[0],
            status,
            tasks: parts[2] || 'Tasks completed',
            link: parts[3] || undefined,
            notes: parts[4] || undefined,
            hours: parseFloat(parts[5]) || 8.0,
          });
        }
      }

      if (parsed.length > 0) {
        bulkAddLogs(parsed);
      }
      return parsed.length;
    } catch (err) {
      console.error('CSV import parse error:', err);
      return 0;
    }
  };

  const resetToDefaultSeed = () => {
    const seeded = generateCuratedPastLogs();
    saveLogs(seeded);
    saveModules(INITIAL_MODULES);
    saveProfile(DEFAULT_PROFILE);
  };

  // KPIs
  const stats = useMemo(() => {
    let officeDays = 0;
    let wfhDays = 0;
    let leavesTaken = 0;
    let totalHours = 0;

    logs.forEach((l) => {
      if (l.status === 'Office Present') officeDays++;
      else if (l.status === 'WFH') wfhDays++;
      else if (l.status === 'Approved Leave' || l.status === 'Emergency Leave') leavesTaken++;
      totalHours += l.hours || 0;
    });

    const totalDays = logs.length;
    const workingDaysCount = officeDays + wfhDays;
    const reliabilityPercent = totalDays > 0 ? Math.round((workingDaysCount / totalDays) * 100) : 100;
    const leavesRemaining = Math.max(0, profile.leavesAllowance - leavesTaken);
    const shippedModules = modules.filter((m) => m.status === 'Shipped').length;

    return {
      totalDays,
      officeDays,
      wfhDays,
      leavesTaken,
      leavesRemaining,
      reliabilityPercent,
      shippedModules,
      totalHours,
    };
  }, [logs, modules, profile.leavesAllowance]);

  return (
    <WorkOSContext.Provider
      value={{
        logs,
        modules,
        profile,
        tursoConfig,
        notifications,
        isLoading,
        addLog,
        updateLog,
        deleteLog,
        bulkAddLogs,
        addModule,
        updateModule,
        deleteModule,
        updateProfile: saveProfile,
        updateTursoConfig: saveTurso,
        updateNotificationSettings,
        requestNotificationPermission,
        sendTestNotification,
        exportJsonData,
        importJsonData,
        exportCsvData,
        importCsvData,
        resetToDefaultSeed,
        stats,
      }}
    >
      {children}
    </WorkOSContext.Provider>
  );
};

export const useWorkOS = () => {
  const context = useContext(WorkOSContext);
  if (!context) {
    throw new Error('useWorkOS must be used within a WorkOSProvider');
  }
  return context;
};
