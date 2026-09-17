import React, { useState, useEffect } from 'react';
import { useVoterPath } from '../../context/VoterPathContext';
import { ShieldCheck, Vote, CheckCircle, BarChart3, Clock, Users, Sparkles } from 'lucide-react';

const TYPEWRITER_PHRASES = [
  'First-Time Voters',
  'Informed Citizens',
  'Every Indian Voter',
  'Democratic Clarity',
  'You',
];

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useVoterPath();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullPhrase = TYPEWRITER_PHRASES[currentPhraseIndex];
    const typingSpeed = isDeleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullPhrase.length) {
          setCurrentText(fullPhrase.slice(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullPhrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  const scrollToTool = (tabId: 'readiness' | 'simulator' | 'lifecycle' | 'myths') => {
    setActiveTab(tabId);
    const element = document.getElementById('main-workspace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-indigo-50/30 to-slate-50 dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#0b0f19] border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Subtle Diamond Checkerboard Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(99, 102, 241, 0.08) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(99, 102, 241, 0.08) 25%, transparent 25%),
            linear-gradient(135deg, rgba(99, 102, 241, 0.08) 25%, transparent 25%),
            linear-gradient(-135deg, rgba(99, 102, 241, 0.08) 25%, transparent 25%)
          `,
          backgroundSize: '54px 54px',
          backgroundPosition: '0 0, 0 27px, 27px -27px, -27px 0px',
        }}
      />

      {/* Radial soft lighting glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16 text-center flex flex-col items-center">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Voter Education Platform • India 🇮🇳</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] max-w-4xl text-slate-900 dark:text-white">
          Democracy Made Simple.
          <br />
          <span className="text-emerald-600 dark:text-emerald-400">Your Interactive</span>{' '}
          <span className="text-amber-500 dark:text-amber-300">Guide</span>
          <br />
          <span className="text-slate-900 dark:text-white">
            Built for{' '}
            <span className="text-indigo-600 dark:text-indigo-200 underline decoration-indigo-400/40 underline-offset-8">
              {currentText}
            </span>
            <span className="text-emerald-500 dark:text-emerald-400 font-normal animate-pulse">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Demystify the election process through intuitive visual steps, a realistic EVM simulator, and
          an AI civic assistant — built for every voter in India.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            id="hero-check-readiness-btn"
            onClick={() => scrollToTool('readiness')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 outline-hidden"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Check Your Readiness</span>
          </button>

          <button
            type="button"
            id="hero-try-simulator-btn"
            onClick={() => scrollToTool('simulator')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 active:scale-98 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-md backdrop-blur-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden"
          >
            <Vote className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
            <span>Try the EVM Simulator</span>
          </button>
        </div>

        {/* 4 Bottom Stat Cards */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          {/* Card 1: Lifecycle Steps */}
          <div
            onClick={() => scrollToTool('lifecycle')}
            className="group bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-98 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-md transition-all cursor-pointer shadow-xs dark:shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-500/30 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">5</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">Lifecycle Steps</div>
          </div>

          {/* Card 2: Myths Busted */}
          <div
            onClick={() => scrollToTool('myths')}
            className="group bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-98 border border-slate-200 dark:border-white/10 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-md transition-all cursor-pointer shadow-xs dark:shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto mb-2 border border-amber-200 dark:border-amber-500/30 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">12</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">Myths Busted</div>
          </div>

          {/* Card 3: VVPAT Seconds */}
          <div
            onClick={() => scrollToTool('simulator')}
            className="group bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-98 border border-slate-200 dark:border-white/10 hover:border-teal-500/40 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-md transition-all cursor-pointer shadow-xs dark:shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center mx-auto mb-2 border border-teal-200 dark:border-teal-500/30 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">7s</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">VVPAT Seconds</div>
          </div>

          {/* Card 4: Million Voters */}
          <div
            onClick={() => scrollToTool('readiness')}
            className="group bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-98 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-md transition-all cursor-pointer shadow-xs dark:shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto mb-2 border border-indigo-200 dark:border-indigo-500/30 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">968M</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">Million Voters</div>
          </div>
        </div>
      </div>
    </div>
  );
};
