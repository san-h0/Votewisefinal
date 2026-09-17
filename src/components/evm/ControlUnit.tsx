import React from 'react';
import { Shield, Radio, KeyRound } from 'lucide-react';

interface ControlUnitProps {
  isBallotEnabled: boolean;
  isBusy: boolean;
  totalVotes: number;
  onPressBallot: () => void;
  disabled?: boolean;
}

export const ControlUnit: React.FC<ControlUnitProps> = ({
  isBallotEnabled,
  isBusy,
  totalVotes,
  onPressBallot,
  disabled = false,
}) => {
  const handleBallotClick = () => {
    console.log(
      `[ControlUnit] BALLOT button pressed. State: isBusy=${isBusy}, isBallotEnabled=${isBallotEnabled}, totalVotes=${totalVotes}`
    );
    onPressBallot();
  };

  return (
    <div
      id="evm-control-unit"
      className="bg-stone-900 border-4 border-stone-800 rounded-2xl p-5 text-slate-100 shadow-xl max-w-sm w-full mx-auto select-none"
    >
      {/* CU Header */}
      <div className="flex items-center justify-between border-b border-stone-700 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
            ECIL / BEL • MODEL M3
          </span>
          <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            CONTROL UNIT (CU)
          </h2>
        </div>
        <div className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-[10px] font-mono text-stone-300 flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-amber-400" />
          <span>SEALED</span>
        </div>
      </div>

      {/* Seven-Segment Digital Display */}
      <div className="bg-emerald-950/80 border-2 border-emerald-800/80 rounded-lg p-3.5 mb-4 shadow-inner">
        <div className="flex justify-between items-center text-[10px] text-emerald-400/80 font-mono uppercase mb-1">
          <span>STATUS DISPLAY</span>
          <span>CANDIDATES: 06</span>
        </div>
        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400 text-center py-1 bg-black/40 rounded border border-emerald-900/50">
          {isBusy ? 'BUSY' : isBallotEnabled ? 'SLIP PRINT' : 'READY TO POLL'}
        </div>
        <div className="flex justify-between text-[11px] font-mono text-emerald-300/80 mt-1.5 px-1">
          <span>VOTES POLLED: {String(totalVotes).padStart(3, '0')}</span>
          <span>BATTERY: 98%</span>
        </div>
      </div>

      {/* Indicator Lamps Row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* ON LED */}
        <div className="bg-stone-800/90 rounded-lg p-2.5 border border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"
              aria-hidden="true"
            ></span>
            <span className="text-xs font-mono font-semibold text-stone-200">POWER ON</span>
          </div>
        </div>

        {/* BUSY LED */}
        <div className="bg-stone-800/90 rounded-lg p-2.5 border border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                isBusy
                  ? 'bg-rose-500 shadow-[0_0_14px_#f43f5e]'
                  : 'bg-stone-600'
              }`}
              aria-hidden="true"
            ></span>
            <span className="text-xs font-mono font-semibold text-stone-200">BUSY LAMP</span>
          </div>
          {isBusy && <span className="text-[10px] font-mono text-rose-400 font-bold">ACTIVE</span>}
        </div>
      </div>

      {/* BALLOT Button Section */}
      <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 text-center">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 mb-2">
          Officer 3 Action: Issue One Ballot
        </div>
        <button
          type="button"
          id="cu-ballot-button"
          onClick={handleBallotClick}
          disabled={isBusy}
          className={`w-full py-3.5 px-6 rounded-xl font-bold font-mono text-sm tracking-wide uppercase shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400 outline-hidden ${
            isBusy
              ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
              : isBallotEnabled
              ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-emerald-600/30 border-2 border-emerald-400'
              : 'bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 shadow-amber-500/20 border-2 border-amber-300 ring-2 ring-amber-400/30'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
          <span>
            {isBusy
              ? 'VOTING IN PROGRESS...'
              : isBallotEnabled
              ? '✓ BALLOT ACTIVE • READY TO VOTE'
              : 'PRESS BALLOT BUTTON (ENABLE VOTE)'}
          </span>
        </button>
        <p className="text-[10px] text-stone-500 mt-2">
          Unlocks the EVM Ballot Unit for exactly one vote.
        </p>
      </div>

      {/* Statutory Security Stamp */}
      <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-500 font-mono">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-stone-400" /> TAMPER-PROOF HARDWARE
        </span>
        <span>ONE-TIME PROGRAMMABLE (OTP)</span>
      </div>
    </div>
  );
};
