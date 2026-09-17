import React, { useCallback } from 'react';
import { Candidate } from '../../types/election';
import { CandidateSymbol } from './CandidateSymbols';
import { Shield, Sparkles } from 'lucide-react';

interface BallotUnitProps {
  candidates: Candidate[];
  isReady: boolean; // Green ready lamp on
  isLocked: boolean; // Locked after voting or before ballot is issued
  votedCandidateId: number | null;
  onVote: (candidate: Candidate) => void;
}

// Braille representations for numbers 1-6
const BRAILLE_DOTS: Record<number, string> = {
  1: '⠁',
  2: '⠃',
  3: '⠉',
  4: '⠙',
  5: '⠑',
  6: '⠋',
};

export const BallotUnit: React.FC<BallotUnitProps> = ({
  candidates,
  isReady,
  isLocked,
  votedCandidateId,
  onVote,
}) => {
  // A vote is only strictly in progress if currently processing a vote
  const isVotingInProgress = isLocked && votedCandidateId !== null;

  const handleVoteClick = useCallback(
    (candidate: Candidate) => {
      console.log(
        `[BallotUnit] Vote button clicked for Candidate #${candidate.serialNumber}: ${candidate.name} (${candidate.partyName}). State: isReady=${isReady}, isLocked=${isLocked}, isVotingInProgress=${isVotingInProgress}`
      );
      if (isVotingInProgress) {
        console.warn(
          `[BallotUnit] Vote button click ignored: voting cycle is currently in progress for candidate ID ${votedCandidateId}.`
        );
        return;
      }
      onVote(candidate);
    },
    [isVotingInProgress, isReady, isLocked, votedCandidateId, onVote]
  );

  return (
    <div
      id="evm-ballot-unit"
      className="bg-stone-200 border-4 border-stone-400 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-xl w-full mx-auto select-none"
      role="region"
      aria-label="Electronic Voting Machine Ballot Unit"
    >
      {/* Unit Top Header */}
      <div className="bg-stone-300 rounded-xl p-3 mb-4 border border-stone-400 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-stone-600 font-semibold">
            BEL / ECIL • BALLOT UNIT (BU)
          </span>
          <div className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-stone-700" />
            <span>ELECTRONIC VOTING MACHINE • MODEL M3</span>
          </div>
        </div>

        {/* READY LED Lamp */}
        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-300 shadow-inner">
          <span
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              isReady
                ? 'bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse'
                : 'bg-stone-300 border border-stone-400'
            }`}
            aria-hidden="true"
          ></span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold tracking-wider text-stone-800">
              READY LAMP
            </span>
            <span className="text-[9px] font-mono text-stone-500">
              {isReady ? 'BALLOT OPEN' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Instruction Strip */}
      <div
        className={`px-3 py-2 rounded-lg text-xs font-medium mb-4 flex items-center justify-between transition-colors ${
          isReady && !isLocked
            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            : isLocked && votedCandidateId
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-stone-300 text-stone-700'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          {isReady && !isLocked
            ? 'Ballot Active: Press the Blue Button against your chosen candidate.'
            : isLocked && votedCandidateId
            ? 'Vote Locked: Look at the VVPAT window to audit your printed slip.'
            : 'Awaiting Polling Officer activation from Control Unit.'}
        </span>
        <span className="text-[10px] font-mono font-semibold">
          {isReady && !isLocked ? 'STATUS: ACTIVE' : 'STATUS: LOCKED'}
        </span>
      </div>

      {/* Candidates Ballot Table */}
      <div className="space-y-2 bg-white rounded-xl p-2 border-2 border-stone-300 shadow-inner">
        {candidates.map((c) => {
          const isSelected = votedCandidateId === c.id;

          return (
            <div
              key={c.id}
              id={`ballot-row-${c.id}`}
              className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
              }`}
            >
              {/* Col 1: Serial Number & Braille */}
              <div className="flex items-center gap-2 w-12 sm:w-16">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  {c.serialNumber}
                </span>
                <span
                  className="text-stone-400 font-mono text-sm font-bold select-none hidden sm:inline"
                  title={`Braille numeral ${c.serialNumber}`}
                >
                  {BRAILLE_DOTS[c.serialNumber] || '•'}
                </span>
              </div>

              {/* Col 2: Candidate & Party Details */}
              <div className="flex-1 px-2 sm:px-3 text-left">
                <div className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                  {c.name}
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">
                  {c.partyName}
                </div>
              </div>

              {/* Col 3: Official Symbol */}
              <div className="flex items-center justify-center px-2">
                <CandidateSymbol symbolKey={c.symbolSvg} className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              {/* Col 4: Red Confirmation LED */}
              <div className="px-2 sm:px-3 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span
                    id={`led-candidate-${c.id}`}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-100 ${
                      isSelected
                        ? 'bg-red-600 shadow-[0_0_16px_#dc2626] ring-2 ring-red-400 scale-125'
                        : 'bg-stone-300 border border-stone-400'
                    }`}
                    aria-hidden="true"
                  ></span>
                  <span className="text-[8px] font-mono text-stone-400 mt-0.5">LED</span>
                </div>
              </div>

              {/* Col 5: Tactile Blue Voting Button */}
              <div className="pl-1 sm:pl-2">
                <button
                  type="button"
                  id={`vote-button-${c.id}`}
                  onClick={() => handleVoteClick(c)}
                  disabled={isVotingInProgress}
                  aria-label={`Vote for candidate number ${c.serialNumber}: ${c.name}, ${c.partyName}`}
                  className={`w-14 h-10 sm:w-16 sm:h-11 rounded-lg font-bold font-mono text-xs shadow-md transition-all duration-100 flex items-center justify-center cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-500 outline-hidden ${
                    isVotingInProgress
                      ? 'bg-blue-300 text-blue-100 opacity-60 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-600 active:scale-95 active:bg-blue-800 text-white shadow-blue-700/40 border-b-4 border-blue-900 ring-1 ring-blue-500/50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-200/60 mr-1 hidden sm:inline-block"></span>
                  <span>VOTE</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Footer Stamp */}
      <div className="mt-4 pt-3 border-t border-stone-300 flex flex-wrap items-center justify-between text-[10px] text-stone-500 font-mono">
        <span>SECURITY SEAL: ECI-BU-2026-X8</span>
        <span>BALLOT SECRECY GUARANTEED BY SECTION 128 RPA 1951</span>
      </div>
    </div>
  );
};
