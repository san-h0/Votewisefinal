import React, { useState, useMemo, useCallback } from 'react';
import { CIVIC_MYTHS, JARGON_LEXICON } from '../../data/mythsAndJargon';
import { normalizeSearchTerm } from '../../utils/sanitize';
import {
  HelpCircle,
  BookMarked,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  FileText,
  Filter,
  Sparkles,
} from 'lucide-react';

export const MythBuster: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'myths' | 'lexicon'>('myths');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Defensive sanitization of search query
  const cleanQuery = useMemo(() => {
    return normalizeSearchTerm(searchQuery);
  }, [searchQuery]);

  // Filtered myths list
  const filteredMyths = useMemo(() => {
    return CIVIC_MYTHS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!cleanQuery) return true;

      const normalizedMyth = item.myth.toLowerCase();
      const normalizedFact = item.fact.toLowerCase();
      const normalizedRef = item.officialReference.toLowerCase();

      return (
        normalizedMyth.includes(cleanQuery) ||
        normalizedFact.includes(cleanQuery) ||
        normalizedRef.includes(cleanQuery)
      );
    });
  }, [cleanQuery, selectedCategory]);

  // Filtered jargon list
  const filteredJargon = useMemo(() => {
    return JARGON_LEXICON.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!cleanQuery) return true;

      const normalizedTerm = item.term.toLowerCase();
      const normalizedFullForm = (item.fullForm || '').toLowerCase();
      const normalizedDef = item.definition.toLowerCase();

      return (
        normalizedTerm.includes(cleanQuery) ||
        normalizedFullForm.includes(cleanQuery) ||
        normalizedDef.includes(cleanQuery)
      );
    });
  }, [cleanQuery, selectedCategory]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  return (
    <section className="space-y-8" aria-label="Myth Buster and Civic Lexicon">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#180933] via-[#241247] to-[#180933] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence-Based Civic Literacy & Lexicon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Civic Myth Buster & Jargon Lexicon
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Combat disinformation with verified statutory rules from the Representation of the People Act, ECI Technical Security manuals, and Supreme Court rulings.
            </p>
          </div>

          {/* Subtab Switcher */}
          <div className="bg-[#13072b] p-1.5 rounded-2xl border border-indigo-900/60 shrink-0 flex items-center gap-1.5">
            <button
              type="button"
              id="subtab-myths-btn"
              onClick={() => {
                setActiveSubTab('myths');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                activeSubTab === 'myths'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Myth Buster ({CIVIC_MYTHS.length})</span>
            </button>
            <button
              type="button"
              id="subtab-lexicon-btn"
              onClick={() => {
                setActiveSubTab('lexicon');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden ${
                activeSubTab === 'lexicon'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/60'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Jargon Lexicon ({JARGON_LEXICON.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input with Sanitization */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="civic-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeSubTab === 'myths'
                  ? 'Search myths (e.g. Wi-Fi, NOTA, lost ID, ink)...'
                  : 'Search terms (e.g. Form 17A, VVPAT, BLO, Mock Poll)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13072b] border border-indigo-900/60 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {activeSubTab === 'myths' ? (
              <>
                {[
                  { id: 'all', label: 'All Myths' },
                  { id: 'evm_security', label: 'EVM Security' },
                  { id: 'voter_rights', label: 'Voter Rights' },
                  { id: 'polling_day', label: 'Polling Day' },
                  { id: 'reforms', label: 'Reforms & NRI' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                      selectedCategory === c.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-[#13072b] text-slate-300 border-indigo-900/50 hover:bg-indigo-950'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { id: 'all', label: 'All Terms' },
                  { id: 'machinery', label: 'Machinery' },
                  { id: 'forms', label: 'Official Forms' },
                  { id: 'protocols', label: 'Protocols' },
                  { id: 'personnel', label: 'Officers' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                      selectedCategory === c.id
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-[#13072b] text-slate-300 border-indigo-900/50 hover:bg-indigo-950'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* BODY CONTENT: Myths vs Lexicon */}
      {activeSubTab === 'myths' ? (
        /* MYTH BUSTER CARDS */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Showing {filteredMyths.length} verified fact checks</span>
            {cleanQuery && <span>Filtered by: "{cleanQuery}"</span>}
          </div>

          {filteredMyths.length === 0 ? (
            <div className="bg-[#180933] rounded-3xl border border-indigo-900/60 p-12 text-center text-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">No myths match your search</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for general keywords like "EVM", "slip", "ink", or clear filters.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer hover:bg-indigo-500"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredMyths.map((item) => (
                <div
                  key={item.id}
                  id={`myth-card-${item.id}`}
                  className="bg-[#180933] rounded-2xl border border-indigo-900/60 p-5 shadow-lg hover:border-indigo-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Myth Header */}
                    <div className="flex items-start gap-2.5 pb-3 border-b border-rose-900/40 mb-3.5 bg-[#2d121c] p-3 rounded-xl border border-rose-800/60">
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                          Common Misconception
                        </span>
                        <h4 className="font-bold text-sm text-rose-100 mt-0.5 leading-snug">
                          "{item.myth}"
                        </h4>
                      </div>
                    </div>

                    {/* Fact / Reality */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0e271f] border border-emerald-800/60 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                          Verified Statutory Fact
                        </span>
                        <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed font-medium">
                          {item.fact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Official Reference Footer */}
                  <div className="pt-2 mt-2 border-t border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-mono gap-1">
                    <span className="flex items-center gap-1 text-teal-300 font-medium">
                      <Shield className="w-3.5 h-3.5" /> {item.officialReference}
                    </span>
                    <span className="text-slate-400">{item.eciManualSection}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* JARGON LEXICON CARDS */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Showing {filteredJargon.length} statutory terms</span>
            {cleanQuery && <span>Filtered by: "{cleanQuery}"</span>}
          </div>

          {filteredJargon.length === 0 ? (
            <div className="bg-[#180933] rounded-3xl border border-indigo-900/60 p-12 text-center text-slate-200">
              <BookMarked className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">No jargon terms matched</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for official terms like "Form", "Officer", or "Ballot".
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-400"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJargon.map((term, i) => (
                <div
                  key={i}
                  className="bg-[#180933] rounded-2xl border border-indigo-900/60 p-5 shadow-lg hover:border-indigo-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-950 text-teal-300 border border-indigo-800">
                        {term.category}
                      </span>
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <h4 className="font-bold text-base text-white tracking-tight">
                      {term.term}
                    </h4>
                    {term.fullForm && (
                      <div className="text-xs font-semibold text-amber-400 mt-0.5 mb-2">
                        {term.fullForm}
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {term.definition}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-900/60 text-[10px] font-mono text-slate-400">
                    Authority: {term.officialContext}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
