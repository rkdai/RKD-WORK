'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useWorkOS } from '../context/WorkOSContext';
import { ModuleCategory } from '../types';

export const ModulesView: React.FC = () => {
  const { modules } = useWorkOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: ModuleCategory[] = ['AI Systems', 'Automation', 'Frontend', 'Backend', 'Infrastructure'];

  const filteredModules = modules.filter(
    (m) => selectedCategory === 'ALL' || m.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              System Portfolio & Impact Engine
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs text-zinc-400">Verified Engineering Projects</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mt-1">
            Major Project Modules Delivered
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            High-leverage engineering projects, AI agents, and internal tools built at RKD Furnishings.
          </p>
        </div>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat ? 'bg-black/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800/80 text-amber-400 font-semibold border border-zinc-700/50">
                      {mod.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Shipped
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                    {mod.title}
                  </h3>
                </div>
              </div>

              {/* Impact / Summary */}
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {mod.impact}
              </p>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-4">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  {mod.startDate} {mod.completionDate ? `→ ${mod.completionDate}` : '→ Active'}
                </span>
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    <span>View System Repository / Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-zinc-500 italic">Verified Internal Engine</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
