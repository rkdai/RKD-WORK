'use client';

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Home, 
  CalendarOff, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { WorkLog, WorkStatus } from '../types';

interface DashboardViewProps {
  onOpenQuickLog: () => void;
  onEditLog: (log: WorkLog) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickLog,
  onEditLog,
  onNavigateToTab,
}) => {
  const { logs, stats, profile, deleteLog } = useWorkOS();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // Calendar month state (defaults to October 2026)
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026

  // Distinct months in logs for filter dropdown
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    logs.forEach((l) => {
      monthsSet.add(l.date.slice(0, 7)); // YYYY-MM
    });
    return Array.from(monthsSet).sort().reverse();
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        searchQuery === '' ||
        log.tasks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.link && log.link.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || log.status === selectedStatus;
      const matchesMonth = selectedMonth === 'ALL' || log.date.startsWith(selectedMonth);

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [logs, searchQuery, selectedStatus, selectedMonth]);

  // Calendar calculation for current calendarDate
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { day: number; dateStr: string; log?: WorkLog }[] = [];
    
    // Prefix padding
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, dateStr: '' });
    }

    // Days in month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = logs.find((l) => l.date === dateStr);
      days.push({ day: d, dateStr, log });
    }

    return days;
  }, [calendarDate, logs]);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const statusBadge = (status: WorkStatus) => {
    switch (status) {
      case 'Office Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="w-3 h-3" /> Office
          </span>
        );
      case 'WFH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Home className="w-3 h-3" /> WFH
          </span>
        );
      case 'Approved Leave':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CalendarOff className="w-3 h-3" /> Approved Leave
          </span>
        );
      case 'Emergency Leave':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Emergency
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-5 sm:p-6 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                Performance & Tenure Engine
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-400">Tenure: March 2026 &ndash; Present</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mt-1">
              Welcome back, {profile.employeeName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Tracking your daily system deliverables, attendance reliability, and enterprise impact at <strong className="text-zinc-200">{profile.companyName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('certificate')}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/60 px-3.5 py-2 text-xs font-medium text-zinc-200 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Certificate</span>
            </button>
            <button
              onClick={onOpenQuickLog}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>+ Quick Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Days */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Days Logged</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{stats.totalDays}</span>
            <span className="text-[11px] text-zinc-500">Days</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Total {Math.round(stats.totalHours)} logged hours
          </p>
        </div>

        {/* Office vs WFH Split */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Office vs WFH</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{stats.officeDays}</span>
            <span className="text-xs text-zinc-500 font-medium">/ {stats.wfhDays} WFH</span>
          </div>
          {/* Progress split bar */}
          <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all" 
              style={{ width: `${(stats.officeDays / (stats.totalDays || 1)) * 100}%` }}
              title="Office Days"
            />
            <div 
              className="bg-blue-500 h-full transition-all" 
              style={{ width: `${(stats.wfhDays / (stats.totalDays || 1)) * 100}%` }}
              title="WFH Days"
            />
          </div>
        </div>

        {/* Leaves Taken / Allowance */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Leaves Balance</span>
            <CalendarOff className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{stats.leavesRemaining}</span>
            <span className="text-xs text-zinc-500 font-medium">/ {profile.leavesAllowance} left</span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1">
            {stats.leavesTaken} leaves taken in tenure
          </p>
        </div>

        {/* Attendance Reliability % */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Reliability Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{stats.reliabilityPercent}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">Exemplary</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Consistent uptime on record
          </p>
        </div>

        {/* Shipped Modules */}
        <div className="col-span-2 lg:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Modules Shipped</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">{stats.shippedModules}</span>
            <span className="text-[11px] text-zinc-500">Systems</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Core business automations
          </p>
        </div>

      </div>

      {/* MONTHLY CALENDAR & RECENT LOGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar View (1 Column) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-zinc-100">
                {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[11px] font-semibold text-zinc-500 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              if (item.day === 0) {
                return <div key={`empty-${idx}`} className="h-9 rounded-lg" />;
              }

              let dotColor = '';
              let bgHover = 'hover:bg-zinc-800/80';
              if (item.log) {
                if (item.log.status === 'Office Present') dotColor = 'bg-emerald-400';
                else if (item.log.status === 'WFH') dotColor = 'bg-blue-400';
                else if (item.log.status === 'Approved Leave') dotColor = 'bg-amber-400';
                else if (item.log.status === 'Emergency Leave') dotColor = 'bg-rose-400';
              }

              return (
                <button
                  key={item.dateStr}
                  onClick={() => item.log && onEditLog(item.log)}
                  className={`h-9 rounded-lg flex flex-col items-center justify-center relative border border-transparent transition-all ${
                    item.log ? 'bg-zinc-900 border-zinc-800/60' : 'text-zinc-600'
                  } ${bgHover}`}
                  title={item.log ? `${item.dateStr}: ${item.log.status} - ${item.log.tasks}` : item.dateStr}
                >
                  <span className={`text-xs ${item.log ? 'text-zinc-200 font-medium' : 'text-zinc-600'}`}>
                    {item.day}
                  </span>
                  {dotColor && (
                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor} mt-0.5`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Office
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> WFH
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Emergency
            </span>
          </div>
        </div>

        {/* Filterable Table View (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Work Logs & Deliverables</h2>
              <p className="text-xs text-zinc-400">Showing {filteredLogs.length} of {logs.length} logged entries</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search deliverables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 transition-colors w-40 sm:w-48"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-400/80"
              >
                <option value="ALL">All Status</option>
                <option value="Office Present">Office</option>
                <option value="WFH">WFH</option>
                <option value="Approved Leave">Approved Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>

              {/* Month Filter */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-8 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-400/80"
              >
                <option value="ALL">All Months</option>
                {availableMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40 flex-1 max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold z-10">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4">Deliverables & Features Built</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-zinc-500">
                      No logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/60 transition-colors group">
                      
                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-zinc-400 font-medium">
                        {log.date}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {statusBadge(log.status)}
                      </td>

                      {/* Deliverable details */}
                      <td className="py-3 px-4 max-w-md">
                        <div className="text-zinc-200 font-medium line-clamp-2">
                          {log.tasks}
                        </div>
                        {log.link && (
                          <a
                            href={log.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400/80 hover:text-amber-300 hover:underline mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[220px]">{log.link}</span>
                          </a>
                        )}
                        {log.notes && (
                          <div className="text-[11px] text-zinc-500 italic mt-0.5">
                            Note: {log.notes}
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditLog(log)}
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 text-[11px] font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete log entry for ${log.date}?`)) {
                                deleteLog(log.id);
                              }
                            }}
                            className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
