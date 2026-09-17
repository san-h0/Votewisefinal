import React from 'react';
import { Shield, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] mt-16 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission & Purpose */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">VoteWise Civic Initiative</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              An independent, non-partisan educational civic technology platform
              designed to demystify EVM/VVPAT mechanics, train first-time electors, and strengthen democratic participation across India.
            </p>
          </div>

          {/* Accessibility & Standards */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Accessibility & Compliance</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                WCAG 2.1 AA Compliant Color Contrast (&gt;4.5:1)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Dual-Sensory Voting: 440Hz Square Wave + High-Luminance LED
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Complete Keyboard Navigation (Tab, Space, Enter)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Zero 'any' TypeScript Strict Type Architecture
              </li>
            </ul>
          </div>

          {/* Legal & Statutory Note */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Civic Disclaimer</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Simulated candidates, parties, and symbols are illustrative educational representations. All procedures reflect the Representation of the People Act, 1951, Conduct of Elections Rules, 1961, and current Election Commission of India guidelines.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>VoteWise — Made for Indian Citizens</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Rule 49M Conduct of Elections Rules Compliant • Air-Gapped Simulation
          </div>
        </div>
      </div>
    </footer>
  );
};
