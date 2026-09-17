import React, { useState } from 'react';
import { useVoterPath } from '../../context/VoterPathContext';
import { TabType } from '../../types/election';
import { Volume2, VolumeX, Landmark, Sun, Moon, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenMitra: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMitra }) => {
  const { activeTab, setActiveTab, soundEnabled, toggleSound, theme, toggleTheme } = useVoterPath();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string }[] = [
    { id: 'readiness', label: 'Readiness' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'myths', label: 'Myths' },
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById('main-workspace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/95 dark:bg-[#0b0f19]/95 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white sticky top-0 z-40 backdrop-blur-md shadow-xs dark:shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="brand-logo-btn"
              onClick={() => handleNavClick('readiness')}
              className="flex items-center gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                VoteWise
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-all relative py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                    isActive
                      ? 'text-indigo-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-emerald-400 rounded-full animate-in fade-in duration-200"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              id="header-audio-toggle-btn"
              onClick={toggleSound}
              title={soundEnabled ? 'EVM Sound Enabled (5s Vote Beep)' : 'EVM Sound Muted'}
              aria-label={soundEnabled ? 'Disable EVM Audio Tone' : 'Enable EVM Audio Tone'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme Toggle (Sun/Moon icon) */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle display brightness theme"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Ask Mitra Button */}
            <button
              type="button"
              id="nav-ask-mitra-btn"
              onClick={onOpenMitra}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 outline-hidden"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Ask Mitra</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-emerald-500/20 text-indigo-600 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
