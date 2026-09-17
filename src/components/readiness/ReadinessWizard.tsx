import React, { useState, useMemo, useCallback } from 'react';
import { useVoterPath } from '../../context/VoterPathContext';
import { ACCEPTED_ALTERNATE_IDS, QUALIFYING_DATES } from '../../data/readinessChecklist';
import { calculateReadinessScore } from '../../utils/readinessCalc';
import {
  CheckSquare,
  AlertTriangle,
  Award,
  Download,
  RotateCcw,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';

export const ReadinessWizard: React.FC = () => {
  const { readinessAnswers, setReadinessAnswers, resetReadiness } = useVoterPath();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);

  const handleReset = useCallback(
    (mode: 'blank' | 'sample' = 'blank') => {
      resetReadiness(mode);
      setCurrentStep(1);
      if (mode === 'blank') {
        setNotification('Voter readiness reset to 0%. Answer each question to increase your readiness score progressively.');
      } else {
        setNotification('Sample eligible voter answers loaded successfully (100% readiness).');
      }
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    },
    [resetReadiness]
  );

  // Dynamic evaluation calculation
  const evaluation = useMemo(() => {
    return calculateReadinessScore(readinessAnswers);
  }, [readinessAnswers]);

  const handlePrintCertificate = useCallback(() => {
    window.print();
  }, []);

  return (
    <section className="space-y-8" aria-label="Voter Readiness Diagnostic Wizard">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Universal Adult Franchise Diagnostic Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Voter Readiness Diagnostic Wizard
            </h2>
            <p className="text-indigo-100/80 text-sm sm:text-base mt-2 leading-relaxed">
              Voter readiness starts at 0%. Answer each statutory question across Steps 1 to 4 to verify your constitutional eligibility, roll inclusion, and polling booth readiness — watching your percentage climb to 100%.
            </p>

            {/* Quick Action Controls */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                id="reset-questions-banner-btn"
                onClick={() => handleReset('blank')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 text-xs font-semibold cursor-pointer transition-all backdrop-blur-xs shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 outline-hidden"
                title="Reset all questions to 0% readiness"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>Reset to 0%</span>
              </button>
              <button
                type="button"
                id="fill-sample-banner-btn"
                onClick={() => handleReset('sample')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-200 border border-emerald-400/30 text-xs font-semibold cursor-pointer transition-all backdrop-blur-xs shadow-xs"
                title="Pre-fill sample verified voter answers"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Pre-fill Sample Answers (100%)</span>
              </button>
            </div>
          </div>

          {/* Dynamic Score Badge */}
          <div
            id="readiness-score-card"
            className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shrink-0 text-center min-w-[220px]"
          >
            <span className="text-xs uppercase tracking-wider font-mono text-indigo-200">
              Readiness Score
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-amber-400 my-1 transition-all duration-300">
              {evaluation.score}%
            </div>
            <div className="text-xs font-semibold">
              {evaluation.status === 'not_eligible' ? (
                <span className="text-rose-400">Ineligible to Vote</span>
              ) : evaluation.score === 100 ? (
                <span className="text-emerald-300">100% — Fully Ready to Vote</span>
              ) : evaluation.score >= 85 ? (
                <span className="text-emerald-300">{evaluation.score}% — Ready to Vote</span>
              ) : evaluation.score > 0 ? (
                <span className="text-amber-300">{evaluation.score}% — In Progress</span>
              ) : (
                <span className="text-slate-300">0% — Diagnostic Not Started</span>
              )}
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  evaluation.score >= 85
                    ? 'bg-emerald-400'
                    : evaluation.score >= 50
                    ? 'bg-amber-400'
                    : evaluation.score > 0
                    ? 'bg-indigo-400'
                    : 'bg-slate-500'
                }`}
                style={{ width: `${Math.max(evaluation.score, evaluation.score > 0 ? 5 : 0)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-indigo-200/70 mt-2 font-mono">
              {evaluation.score === 100
                ? 'All prerequisites verified'
                : 'Increases with each answered question'}
            </p>
          </div>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div className="mt-8 pt-6 border-t border-indigo-800 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              step: 1,
              title: 'Age & Eligibility',
              icon: Calendar,
              isDone: readinessAnswers.is18OrAbove !== null && readinessAnswers.isIndianCitizen !== null,
            },
            {
              step: 2,
              title: 'Electoral Roll & EPIC',
              icon: ShieldCheck,
              isDone: readinessAnswers.isNameOnRoll !== null && readinessAnswers.hasEpicCard !== null,
            },
            {
              step: 3,
              title: '12 Approved IDs',
              icon: CreditCard,
              isDone: readinessAnswers.hasEpicCard === true || readinessAnswers.selectedAlternateId !== null,
            },
            {
              step: 4,
              title: 'Booth & Constituency',
              icon: MapPin,
              isDone: readinessAnswers.knowsPollingStation !== null && readinessAnswers.hasVoterSlipOrApp !== null,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                id={`wizard-step-tab-${item.step}`}
                onClick={() => setCurrentStep(item.step)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 outline-hidden ${
                  isCurrent
                    ? 'bg-indigo-600 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                    : item.isDone
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span>STEP 0{item.step}</span>
                  {item.isDone ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                      ✓ Done
                    </span>
                  ) : (
                    <Icon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-white">{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notification Banner */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-spin" style={{ animationIterationCount: 1, animationDuration: '600ms' }} />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Wizard Interactive Body */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-xl text-slate-800 dark:text-slate-200 transition-colors duration-200">
        {/* Step 1: Age & Eligibility */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-teal-400">
                  Step 1 of 4 • Article 326 of Constitution of India
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Age Milestone & Qualifying Dates
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  To vote in Indian elections, you must be a citizen of India and at least 18 years old on or before one of the 4 annual qualifying dates.
                </p>
              </div>
              <button
                type="button"
                id="reset-step-1-btn"
                onClick={() => handleReset('blank')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                title="Reset all questions to start over"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Reset Questions</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {/* Q1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +20% Readiness
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Are you at least 18 years of age or turning 18 this year?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Constitutional minimum voting age under the 61st Constitutional Amendment Act.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        is18OrAbove: prev.is18OrAbove === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.is18OrAbove === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (18+) {readinessAnswers.is18OrAbove === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        is18OrAbove: prev.is18OrAbove === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.is18OrAbove === false
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    No (Under 18)
                  </button>
                </div>
              </div>

              {/* Q2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +15% Readiness
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Are you an Indian citizen?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Required under Section 19 of Representation of the People Act, 1950.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        isIndianCitizen: prev.isIndianCitizen === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.isIndianCitizen === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (Citizen) {readinessAnswers.isIndianCitizen === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        isIndianCitizen: prev.isIndianCitizen === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.isIndianCitizen === false
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    No (Non-Citizen)
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Qualifying Dates Info Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-teal-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                The 4 Statutory Qualifying Dates in India
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {QUALIFYING_DATES.map((q) => (
                  <div key={q.date} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">{q.date}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{q.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Electoral Roll & EPIC Status */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-teal-400">
                  Step 2 of 4 • Statutory Roll Inclusion
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Electoral Roll Check & Voter ID (EPIC)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Golden Rule of Indian Elections: Having a Voter ID card is not enough—your name MUST be published on the current constituency Electoral Roll!
                </p>
              </div>
              <button
                type="button"
                id="reset-step-2-btn"
                onClick={() => handleReset('blank')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                title="Reset all questions to start over"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Reset Questions</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Q3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +25% Readiness
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Is your name officially listed in the current Electoral Roll?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verified on voters.eci.gov.in or electoralsearch.eci.gov.in
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        isNameOnRoll: prev.isNameOnRoll === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.isNameOnRoll === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (Name on Roll) {readinessAnswers.isNameOnRoll === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        isNameOnRoll: prev.isNameOnRoll === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.isNameOnRoll === false
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    No / Not Sure
                  </button>
                </div>
              </div>

              {/* Q4 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +15% Readiness
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      (or select 1 of 12 Alternate IDs in Step 3)
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Do you possess your physical or digital Electors Photo Identity Card (EPIC)?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Includes physical card, plastic smart card, or e-EPIC PDF download.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        hasEpicCard: prev.hasEpicCard === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.hasEpicCard === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (Have EPIC) {readinessAnswers.hasEpicCard === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        hasEpicCard: prev.hasEpicCard === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.hasEpicCard === false
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    No EPIC Card
                  </button>
                </div>
              </div>
            </div>

            {/* Helpful ECI Portal Link */}
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-300 dark:border-amber-500/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Missing from the roll? </span>
                If your name is not on the roll, submit <strong>Form 6 (Application for New Voter Registration)</strong> on the official National Voters' Service Portal (voters.eci.gov.in) before the constituency nomination deadline.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: The 12 Approved Alternate IDs */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-teal-400">
                  Step 3 of 4 • Identification Safeguards
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                    +15% Readiness if no EPIC
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  The 12 Official Alternative Photo IDs Permitted by ECI
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  If you do not have an EPIC card on polling day, you can produce ANY ONE of these 12 approved government photo identity documents to cast your vote (provided your name is on the roll).
                </p>
              </div>
              <button
                type="button"
                id="reset-step-3-btn"
                onClick={() => handleReset('blank')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                title="Reset all questions to start over"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Reset Questions</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            {/* 12 IDs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACCEPTED_ALTERNATE_IDS.map((idOption) => {
                const isSelected = readinessAnswers.selectedAlternateId === idOption.id;
                return (
                  <button
                    key={idOption.id}
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        selectedAlternateId: isSelected ? null : idOption.id,
                      }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-[#2c1a59] border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{idOption.name}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected
                            ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold border-emerald-400'
                            : 'border-slate-400 dark:border-indigo-700'
                        }`}
                      >
                        {isSelected && '✓'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {idOption.description}
                    </p>
                    <div className="text-[10px] text-emerald-700 dark:text-teal-300 font-mono mt-2 font-medium">
                      {idOption.authority}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Booth & Constituency Locator */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-teal-400">
                  Step 4 of 4 • Polling Booth Readiness
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Polling Station & Booth Locator
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Ensure you know your designated polling booth room number, part number, and serial number before polling day to avoid queues and confusion.
                </p>
              </div>
              <button
                type="button"
                id="reset-step-4-btn"
                onClick={() => handleReset('blank')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                title="Reset all questions to start over"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Reset Questions</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Q5 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +15% Readiness
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Do you know your designated Polling Station and room?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Found via Voter Helpline App, SMS to 1950, or your local BLO.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        knowsPollingStation: prev.knowsPollingStation === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.knowsPollingStation === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (I Know My Booth) {readinessAnswers.knowsPollingStation === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        knowsPollingStation: prev.knowsPollingStation === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.knowsPollingStation === false
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    No / Not Yet Located
                  </button>
                </div>
              </div>

              {/* Q6 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-mono">
                      +10% Readiness
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Do you have your Voter Information Slip (VIS) or digital e-EPIC?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Contains your Part number, Serial number, and Polling Station QR code.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        hasVoterSlipOrApp: prev.hasVoterSlipOrApp === true ? null : true,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.hasVoterSlipOrApp === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes (Slip / App Ready) {readinessAnswers.hasVoterSlipOrApp === true && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReadinessAnswers((prev) => ({
                        ...prev,
                        hasVoterSlipOrApp: prev.hasVoterSlipOrApp === false ? null : false,
                      }))
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      readinessAnswers.hasVoterSlipOrApp === false
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Not Yet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 1
                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-indigo-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-indigo-950/80 cursor-pointer border border-slate-300 dark:border-indigo-800'
            }`}
          >
            ← Previous Step
          </button>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-slate-500 dark:text-slate-400">Step {currentStep} of 4</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              id="reset-wizard-nav-btn"
              onClick={() => handleReset('blank')}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              title="Reset all questions to start fresh"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset questions</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            disabled={currentStep === 4}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 4
                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-indigo-950/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md'
            }`}
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* SECTION: Diagnostic Results & Action Plan */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-xl text-slate-800 dark:text-slate-200 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-teal-400">
              Personalized Civic Evaluation
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {evaluation.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{evaluation.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              id="print-readiness-btn"
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Report</span>
            </button>
            <button
              type="button"
              id="reset-readiness-btn"
              onClick={() => handleReset('blank')}
              title="Reset diagnostic questions"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>Reset Questions</span>
            </button>
            <button
              type="button"
              id="sample-readiness-btn"
              onClick={() => handleReset('sample')}
              title="Pre-fill sample verified voter answers"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Fill Sample</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed Strengths */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100">
            <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Confirmed Voting Assets ({evaluation.strengths.length})
            </h4>
            {evaluation.strengths.length > 0 ? (
              <ul className="space-y-2 text-xs font-medium">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700 dark:text-emerald-300/80">No prerequisites verified yet. Answer questions above to diagnose your readiness.</p>
            )}
          </div>

          {/* Action Items */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100">
            <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Pending Action Items Before Polling Day ({evaluation.actionItems.length})
            </h4>
            {evaluation.actionItems.length > 0 ? (
              <ul className="space-y-2 text-xs font-medium">
                {evaluation.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                No pending action items! You are 100% prepared for polling day.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
