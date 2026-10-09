'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Sparkles, 
  Calendar,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { ProjectModule, ModuleCategory, ModuleStatus } from '../types';

export const ModulesView: React.FC = () => {
  const { modules, addModule, updateModule, deleteModule } = useWorkOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ProjectModule | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ModuleCategory>('AI Systems');
  const [status, setStatus] = useState<ModuleStatus>('Shipped');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [impact, setImpact] = useState('');
  const [techStackStr, setTechStackStr] = useState('');
  const [repoOrDocUrl, setRepoOrDocUrl] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');

  const categories: ModuleCategory[] = ['AI Systems', 'Automation', 'Frontend', 'Backend', 'Infrastructure'];

  const filteredModules = modules.filter(
    (m) => selectedCategory === 'ALL' || m.category === selectedCategory
  );

  const handleOpenAdd = () => {
    setEditingModule(null);
    setTitle('');
    setCategory('AI Systems');
    setStatus('Shipped');
    setStartDate(new Date().toISOString().slice(0, 10));
    setCompletionDate('');
    setImpact('');
    setTechStackStr('Next.js, Tailwind CSS, TypeScript');
    setRepoOrDocUrl('');
    setFeaturesStr('Automated pipeline execution\nResponsive dashboard UI\nReal-time monitoring');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mod: ProjectModule) => {
    setEditingModule(mod);
    setTitle(mod.title);
    setCategory(mod.category);
    setStatus(mod.status);
    setStartDate(mod.startDate);
    setCompletionDate(mod.completionDate || '');
    setImpact(mod.impact);
    setTechStackStr(mod.techStack.join(', '));
    setRepoOrDocUrl(mod.repoOrDocUrl || '');
    setFeaturesStr(mod.keyFeatures.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !impact.trim()) return;

    const techStack = techStackStr.split(',').map((t) => t.trim()).filter(Boolean);
    const keyFeatures = featuresStr.split('\n').map((f) => f.trim()).filter(Boolean);

    if (editingModule) {
      updateModule({
        ...editingModule,
        title: title.trim(),
        category,
        status,
        startDate,
        completionDate: completionDate || undefined,
        impact: impact.trim(),
        techStack,
        repoOrDocUrl: repoOrDocUrl.trim() || undefined,
        keyFeatures,
      });
    } else {
      addModule({
        title: title.trim(),
        category,
        status,
        startDate,
        completionDate: completionDate || undefined,
        impact: impact.trim(),
        techStack,
        repoOrDocUrl: repoOrDocUrl.trim() || undefined,
        keyFeatures,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              System Portfolio & Impact Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mt-1">
            Major Project Modules Delivered
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            High-leverage engineering projects, AI agents, and internal tools built at RKD Furnishings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Project Module</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All Modules ({modules.length})
        </button>
        {categories.map((cat) => {
          const count = modules.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 p-5 flex flex-col justify-between transition-all group relative overflow-hidden"
          >
            {/* Top Bar with Category & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                  {mod.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {mod.status}
                  </span>
                </div>
              </div>

              {/* Module Title */}
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                {mod.title}
              </h3>

              {/* Timeline */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {mod.startDate} {mod.completionDate ? `→ ${mod.completionDate}` : '(Ongoing)'}
                </span>
              </div>

              {/* Impact Callout Banner */}
              <div className="my-3.5 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-xs font-medium text-amber-200">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-0.5">
                  <Sparkles className="w-3 h-3" /> Verified Business Impact
                </div>
                {mod.impact}
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Highlights:
                </div>
                {mod.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-300">
                    <span className="text-amber-400 mt-0.5 font-bold">&bull;</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tech Stack & Action Links */}
            <div className="pt-3 border-t border-zinc-800/80">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {mod.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                {mod.repoOrDocUrl ? (
                  <a
                    href={mod.repoOrDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    <span>View System</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-zinc-500 italic">Internal Deployment</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(mod)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    title="Edit Module"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete project module "${mod.title}"?`)) {
                        deleteModule(mod.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h2 className="text-base font-bold text-zinc-100">
                {editingModule ? 'Edit Project Module' : 'Add New Project Module'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Module / System Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Automated Inventory Reconciliation Pipeline"
                  className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ModuleCategory)}
                    className="w-full h-9 px-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ModuleStatus)}
                    className="w-full h-9 px-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Shipped">Shipped</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Verified Impact Metric</label>
                <input
                  type="text"
                  required
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  placeholder="e.g. Reduced manual data entry by 80%"
                  className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  placeholder="Next.js, Python, PostgreSQL"
                  className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">System / Repo URL (Optional)</label>
                <input
                  type="url"
                  value={repoOrDocUrl}
                  onChange={(e) => setRepoOrDocUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Key Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2"
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
