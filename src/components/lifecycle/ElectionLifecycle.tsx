import React, { useState, useMemo, useCallback } from 'react';
import { ELECTION_PHASES } from '../../data/lifecycleData';
import { LifecycleViewMode } from '../../types/election';
import {
  Calendar,
  BookOpen,
  Scale,
  ShieldCheck,
  Users,
  CheckCircle2,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const ElectionLifecycle: React.FC = () => {
  const [viewMode, setViewMode] = useState<LifecycleViewMode>('summary');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const currentPhase = useMemo(() => {
    return ELECTION_PHASES[activePhaseIndex] || ELECTION_PHASES[0];
  }, [activePhaseIndex]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <section className="space-y-8" aria-label="Election Lifecycle Visualizer">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#180933] via-[#241247] to-[#180933] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Constitutional Framework & Statutory Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Election Lifecycle Visualizer
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Explore the end-to-end democratic machinery across 4 rigorous statutory phases—from electoral roll revisions and Model Code of Conduct to polling day sealing and VVPAT audit reconciliation.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="bg-[#13072b] p-1.5 rounded-2xl border border-indigo-900/60 shrink-0 flex flex-col sm:flex-row items-center gap-1.5">
            <button
              type="button"
              id="viewmode-summary-btn"
              onClick={() => setViewMode('summary')}
              aria-pressed={viewMode === 'summary'}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                viewMode === 'summary'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Summary (New Voters)</span>
            </button>
            <button
              type="button"
              id="viewmode-deepdive-btn"
              onClick={() => setViewMode('deep_dive')}
              aria-pressed={viewMode === 'deep_dive'}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                viewMode === 'deep_dive'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Constitutional Deep Dive (Statutory)</span>
            </button>
          </div>
        </div>

        {/* 4 Phases Navigation Tabs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-indigo-900/60">
          {ELECTION_PHASES.map((phase, idx) => {
            const isSelected = activePhaseIndex === idx;
            return (
              <button
                key={phase.id}
                id={`lifecycle-tab-${idx}`}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                  isSelected
                    ? 'bg-[#2f1b61] border-amber-400 text-white shadow-lg ring-2 ring-amber-400/30'
                    : 'bg-[#221042] hover:bg-[#2b1552] border-indigo-900/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-amber-400">PHASE 0{phase.phaseNumber}</span>
                  <span className="text-[11px] text-slate-400">{phase.period.split(' ')[0]}</span>
                </div>
                <div className="font-bold text-sm line-clamp-1">{phase.title.split(':')[0]}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {phase.title.split(':')[1] || phase.period}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Deep Content Container */}
      <div className="bg-[#180933] rounded-3xl border border-indigo-900/60 p-6 sm:p-8 shadow-xl text-slate-200">
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-900/60 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                Phase {currentPhase.phaseNumber} of 4
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {currentPhase.period}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {currentPhase.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="print-lifecycle-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-slate-200 border border-indigo-800 text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Statutory Summary</span>
            </button>
          </div>
        </div>

        {/* Phase Executive Summary */}
        <div className="bg-[#221042] rounded-2xl p-4 sm:p-5 border border-indigo-900/60 mb-8 text-sm text-slate-200 leading-relaxed">
          <p className="font-medium">{currentPhase.summary}</p>
        </div>

        {/* Content Dependent on View Mode */}
        {viewMode === 'summary' ? (
          /* QUICK SUMMARY MODE */
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Key Takeaways for Voters & Citizens
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPhase.quickPoints.map((point, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[#221042] border border-indigo-900/50 text-xs sm:text-sm text-slate-200 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Officials Spotlight */}
            <div className="pt-4 border-t border-indigo-900/60">
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Key Electoral Authorities in This Phase
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentPhase.keyOfficials.map((officer, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-[#221042] border border-indigo-900/50 shadow-sm text-xs font-semibold text-white flex items-center gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-950 text-teal-300 flex items-center justify-center shrink-0 border border-indigo-800">
                      {index + 1}
                    </div>
                    <span>{officer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CONSTITUTIONAL DEEP DIVE MODE */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Constitutional Articles */}
              <div className="bg-[#281c12] rounded-2xl p-5 border border-amber-800/60">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Constitutional Articles (Supreme Law)
                </h4>
                <ul className="space-y-2.5">
                  {currentPhase.constitutionalArticles.map((art, index) => (
                    <li
                      key={index}
                      className="p-3 rounded-xl bg-[#1c1209] border border-amber-900/50 text-xs text-amber-100 font-medium leading-relaxed shadow-sm"
                    >
                      {art}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statutory Rules & Acts */}
              <div className="bg-[#221042] rounded-2xl p-5 border border-indigo-900/50">
                <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  Statutory Provisions & Election Rules
                </h4>
                <ul className="space-y-2.5">
                  {currentPhase.statutoryRules.map((rule, index) => (
                    <li
                      key={index}
                      className="p-3 rounded-xl bg-[#180933] border border-indigo-900/50 text-xs text-slate-200 font-medium leading-relaxed shadow-sm"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Critical Safeguards & Audit Protocols */}
            <div className="bg-[#122822] rounded-2xl p-5 border border-emerald-800/60">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anti-Fraud & Transparency Safeguards
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentPhase.criticalSafeguards.map((guard, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-[#0c1f1a] border border-emerald-900/50 text-xs text-emerald-100 font-medium shadow-sm leading-relaxed"
                  >
                    {guard}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
            disabled={activePhaseIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePhaseIndex === 0
                ? 'text-slate-500 cursor-not-allowed border border-indigo-950/40'
                : 'text-slate-200 hover:bg-indigo-950/80 cursor-pointer border border-indigo-800'
            }`}
          >
            ← Previous Phase
          </button>

          <span className="text-xs font-mono text-slate-400">
            Phase {activePhaseIndex + 1} of {ELECTION_PHASES.length}
          </span>

          <button
            type="button"
            onClick={() =>
              setActivePhaseIndex((prev) => Math.min(ELECTION_PHASES.length - 1, prev + 1))
            }
            disabled={activePhaseIndex === ELECTION_PHASES.length - 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePhaseIndex === ELECTION_PHASES.length - 1
                ? 'text-slate-500 cursor-not-allowed border border-indigo-950/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md'
            }`}
          >
            Next Phase →
          </button>
        </div>
      </div>
    </section>
  );
};
