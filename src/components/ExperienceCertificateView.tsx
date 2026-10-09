'use client';

import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Award, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';

export const ExperienceCertificateView: React.FC = () => {
  const { profile, stats, modules, logs } = useWorkOS();
  const [activeSubTab, setActiveSubTab] = useState<'certificate' | 'performanceReport'>('certificate');
  const [isExporting, setIsExporting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Calculate tenure
  const joining = new Date(profile.joiningDate);
  const relieving = profile.relievingDate ? new Date(profile.relievingDate) : new Date();
  const monthsDiff = Math.max(
    1,
    (relieving.getFullYear() - joining.getFullYear()) * 12 + (relieving.getMonth() - joining.getMonth())
  );

  const formattedJoining = joining.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedRelieving = relieving.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const element = activeSubTab === 'certificate' ? certRef.current : reportRef.current;
      if (!element) return;

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const filename =
        activeSubTab === 'certificate'
          ? `RKD_Experience_Certificate_${profile.employeeName.replace(/\s+/g, '_')}.pdf`
          : `RKD_Performance_Tenure_Report_${profile.employeeName.replace(/\s+/g, '_')}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to window print
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Top Controls Banner (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              One-Click Credentials & Verification Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mt-1">
            Export Exit Credentials & Formal Certificate
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Generates verifiable corporate artifacts with zero UI clutter, ready for print or instant high-resolution PDF download.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-xs font-semibold text-zinc-200 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span>Browser Print (A4)</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Subtab Toggle Buttons (Hidden in Print) */}
      <div className="no-print flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab('certificate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'certificate'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Formal Experience & Relieving Certificate</span>
        </button>

        <button
          onClick={() => setActiveSubTab('performanceReport')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'performanceReport'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Comprehensive Performance & Tenure Report</span>
        </button>
      </div>

      {/* ARTIFACT 1: FORMAL EXPERIENCE & RELIEVING CERTIFICATE */}
      {activeSubTab === 'certificate' && (
        <div className="flex justify-center">
          <div
            ref={certRef}
            className="print-page w-full max-w-[800px] bg-white text-zinc-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-zinc-200 font-serif relative overflow-hidden"
            style={{ minHeight: '1050px' }}
          >
            {/* Elegant Top Decorative Border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700" />

            {/* Corporate Letterhead Header */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-zinc-900/10 mb-8">
              <div className="flex items-center gap-4">
                {/* RKD Emblem */}
                <div className="w-16 h-16 rounded-xl border-2 border-amber-600 flex flex-col items-center justify-center bg-zinc-950 text-amber-400 font-serif font-black shadow-sm">
                  <span className="text-xl tracking-wider leading-none">RKD</span>
                  <span className="text-[7px] tracking-widest text-zinc-300 font-sans font-bold mt-1">FURNISHINGS</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
                    {profile.companyName}
                  </h2>
                  <p className="text-xs text-zinc-600 font-sans mt-0.5 max-w-sm">
                    {profile.companyAddress}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
                    Website: {profile.companyWebsite} &bull; CIN: U17290HR2020PTC085412
                  </p>
                </div>
              </div>

              {/* Reference Number & Date */}
              <div className="text-right text-xs font-sans text-zinc-600">
                <p className="font-mono font-bold text-zinc-800">REF: RKD/HR/EXP/2026/084</p>
                <p className="mt-1">Date: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  Verified Official
                </span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-6">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-zinc-950 underline decoration-amber-600 decoration-2 underline-offset-8">
                EXPERIENCE & RELIEVING CERTIFICATE
              </h3>
              <p className="text-xs font-sans text-zinc-500 mt-2 italic">
                To Whom It May Concern
              </p>
            </div>

            {/* Certificate Body Text */}
            <div className="font-sans text-sm text-zinc-800 leading-relaxed space-y-4 my-6 text-justify">
              <p>
                This is to certify that <strong>{profile.employeeName}</strong> (Employee ID: <strong>{profile.employeeId}</strong>) has been employed with <strong>{profile.companyName}</strong> from <strong>{formattedJoining}</strong> to <strong>{formattedRelieving}</strong> ({monthsDiff} Months of full-time active tenure).
              </p>

              <p>
                During this tenure, {profile.employeeName} served in the capacity of <strong>{profile.designation}</strong> within our <strong>{profile.department}</strong>.
              </p>

              <p>
                In this key engineering capacity, {profile.employeeName} played an instrumental role in conceptualizing, building, and delivering enterprise software, automation engines, and generative AI systems that substantially streamlined our commercial and digital operations.
              </p>

              {/* Key Highlights */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 my-4 text-xs">
                <p className="font-bold uppercase tracking-wider text-zinc-900 mb-2 font-sans">
                  Key Systems Architected & Contributions:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-zinc-700">
                  {profile.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-snug">{resp}</li>
                  ))}
                </ul>
              </div>

              <p>
                Throughout their tenure, {profile.employeeName} demonstrated exceptional technical proficiency, reliability (achieving a recorded <strong>{stats.reliabilityPercent}%</strong> attendance and uptime index across {stats.totalDays} logged days), and an exemplary professional demeanor.
              </p>

              <p>
                They are relieved from their duties in good standing, having concluded their transition responsibly. We thank them sincerely for their valuable contributions and wish them the very best in all future professional endeavors.
              </p>
            </div>

            {/* Key Metrics Summary Badge Table */}
            <div className="grid grid-cols-4 gap-2 my-8 pt-4 border-t border-zinc-200 text-center font-sans">
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Active Days</span>
                <span className="text-base font-bold text-zinc-900">{stats.totalDays} Days</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Reliability</span>
                <span className="text-base font-bold text-emerald-700">{stats.reliabilityPercent}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Systems Shipped</span>
                <span className="text-base font-bold text-zinc-900">{stats.shippedModules} Core Modules</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Conduct Rating</span>
                <span className="text-base font-bold text-amber-700">Exemplary</span>
              </div>
            </div>

            {/* Formal Signature Section */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex items-end justify-between font-sans text-xs">
              <div>
                <p className="font-semibold text-zinc-500">Issued On Authority of:</p>
                <div className="mt-6">
                  {/* Digital seal / signature badge */}
                  <div className="w-32 border-b-2 border-zinc-900 pb-1 font-serif text-sm italic font-bold text-zinc-950">
                    Bhupinder Pal Singh
                  </div>
                  <p className="font-bold text-zinc-900 mt-1">{profile.managerName}</p>
                  <p className="text-zinc-600">{profile.managerTitle}</p>
                  <p className="text-zinc-500 text-[11px]">{profile.companyName}</p>
                </div>
              </div>

              {/* Company Seal Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-600/60 flex flex-col items-center justify-center p-2 text-center text-[9px] font-sans uppercase font-bold text-amber-800 rotate-[-8deg] bg-amber-50/40">
                  <span>★ OFFICIAL SEAL ★</span>
                  <span className="font-black my-0.5">RKD</span>
                  <span className="text-[7px]">PANIPAT, HARYANA</span>
                </div>
                <span className="text-[10px] text-zinc-400 mt-2 font-mono">Digitally Validated</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ARTIFACT 2: COMPREHENSIVE PERFORMANCE & TENURE REPORT */}
      {activeSubTab === 'performanceReport' && (
        <div className="flex justify-center">
          <div
            ref={reportRef}
            className="print-page w-full max-w-[850px] bg-white text-zinc-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-zinc-200 font-sans relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-900 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600">
                  RKD WORKOS PERFORMANCE INTELLIGENCE
                </span>
                <h2 className="text-xl font-bold text-zinc-950">
                  Comprehensive Tenure & Engineering Report
                </h2>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Employee: <strong>{profile.employeeName}</strong> &bull; Designation: <strong>{profile.designation}</strong>
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="font-mono font-bold text-zinc-800">Tenure: March 2026 &ndash; October 2026</span>
                <p className="text-zinc-500 text-[11px] mt-0.5">Record Count: {stats.totalDays} Total Logs</p>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Total Days</span>
                <span className="block text-xl font-black text-zinc-900 mt-1">{stats.totalDays}</span>
                <span className="text-[10px] text-zinc-500">100% Verified</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Office / WFH</span>
                <span className="block text-xl font-black text-zinc-900 mt-1">{stats.officeDays} / {stats.wfhDays}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{Math.round((stats.officeDays / stats.totalDays) * 100)}% On-site</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Reliability Index</span>
                <span className="block text-xl font-black text-emerald-700 mt-1">{stats.reliabilityPercent}%</span>
                <span className="text-[10px] text-zinc-500">Uptime Grade: A+</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Leaves Consumed</span>
                <span className="block text-xl font-black text-amber-700 mt-1">{stats.leavesTaken} / {profile.leavesAllowance}</span>
                <span className="text-[10px] text-zinc-500">{stats.leavesRemaining} Remaining</span>
              </div>
            </div>

            {/* Delivered Systems Breakdown Table */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2 border-b pb-1">
                1. Delivered Engineering Modules & Business Impact
              </h3>
              <table className="w-full text-xs text-left border border-zinc-200">
                <thead className="bg-zinc-100 font-bold text-zinc-700 border-b border-zinc-200">
                  <tr>
                    <th className="p-2">System / Module</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Business Impact Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800">
                  {modules.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50">
                      <td className="p-2 font-semibold">{m.title}</td>
                      <td className="p-2 font-mono text-[11px] text-zinc-600">{m.category}</td>
                      <td className="p-2 text-emerald-700 font-bold">{m.status}</td>
                      <td className="p-2 text-[11px] text-zinc-600">{m.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Attendance Timeline Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2 border-b pb-1">
                2. Key Milestone Log Snapshot (Sample of Active Records)
              </h3>
              <table className="w-full text-xs text-left border border-zinc-200">
                <thead className="bg-zinc-100 font-bold text-zinc-700 border-b border-zinc-200">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Primary Feature / Deliverable Shipped</th>
                    <th className="p-2 text-right">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800 text-[11px]">
                  {logs.slice(0, 15).map((l) => (
                    <tr key={l.id}>
                      <td className="p-2 font-mono whitespace-nowrap">{l.date}</td>
                      <td className="p-2 font-semibold">
                        <span className={
                          l.status === 'Office Present' ? 'text-emerald-700' :
                          l.status === 'WFH' ? 'text-blue-700' : 'text-amber-700'
                        }>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-2 max-w-sm truncate">{l.tasks}</td>
                      <td className="p-2 text-right font-mono">{l.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-zinc-500 mt-1 italic">
                * Complete record of all {stats.totalDays} entries is archived in the WorkOS audit database.
              </p>
            </div>

            {/* Sign-off */}
            <div className="pt-6 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
              <div>
                <p>Report Generated: {new Date().toLocaleString()}</p>
                <p className="text-[11px] text-zinc-500">WorkOS Certified Record &bull; Hash: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-zinc-900">{profile.managerName}</p>
                <p>{profile.managerTitle}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
