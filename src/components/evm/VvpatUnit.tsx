import React from 'react';
import { VvpatSlipData } from '../../types/election';
import { CandidateSymbol } from './CandidateSymbols';
import { Eye, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface VvpatUnitProps {
  slipData: VvpatSlipData | null;
  isLightOn: boolean;
  secondsRemaining: number;
  isDropped: boolean;
  isCompleted: boolean;
}

export const VvpatUnit: React.FC<VvpatUnitProps> = ({
  slipData,
  isLightOn,
  secondsRemaining,
  isDropped,
  isCompleted,
}) => {
  return (
    <div
      id="vvpat-unit"
      className="bg-stone-900 border-4 border-stone-800 rounded-2xl p-5 text-slate-100 shadow-2xl max-w-sm w-full mx-auto select-none"
      role="region"
      aria-label="Voter Verifiable Paper Audit Trail Unit"
    >
      {/* Unit Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            BEL / ECIL • AUDIT PRINTER
          </span>
          <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-400" />
            VVPAT UNIT (PRINTER)
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded border border-stone-700 text-[10px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>STATUTORY AUDIT</span>
        </div>
      </div>

      {/* 7-Second Audit Countdown Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isLightOn ? 'bg-amber-400 animate-ping' : 'bg-stone-600'
              }`}
            ></span>
            7-Second Verification Window
          </span>
          <span className="font-bold text-amber-400 font-mono">
            {isLightOn ? `${secondsRemaining.toFixed(1)}s` : isCompleted ? 'AUDITED' : 'IDLE'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-100 ease-linear"
            style={{
              width: isLightOn
                ? `${(secondsRemaining / 7) * 100}%`
                : isCompleted
                ? '100%'
                : '0%',
            }}
          ></div>
        </div>
      </div>

      {/* Transparent Viewing Window with Internal LED Light */}
      <div
        id="vvpat-viewing-window"
        className={`relative h-64 rounded-xl border-4 transition-all duration-300 overflow-hidden flex items-center justify-center p-3 ${
          isLightOn
            ? 'bg-amber-50/95 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]'
            : isCompleted
            ? 'bg-stone-950 border-emerald-900/60'
            : 'bg-stone-950 border-stone-800'
        }`}
      >
        {/* Glass glare simulation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>

        {/* Paper Slip */}
        {slipData && !isDropped ? (
          <div
            id="vvpat-printed-slip"
            className="w-full max-w-[260px] bg-white text-slate-900 p-3 rounded shadow-md border border-slate-300 font-mono transition-transform duration-700 ease-in"
            style={{
              transform: isDropped ? 'translateY(160%)' : 'translateY(0%)',
              opacity: isDropped ? 0 : 1,
            }}
          >
            {/* Slip Header */}
            <div className="border-b border-dashed border-slate-300 pb-1.5 mb-2 text-center">
              <div className="text-[9px] font-bold tracking-wider text-slate-600 uppercase">
                Election Commission of India
              </div>
              <div className="text-[8px] text-slate-500">Voter Verifiable Paper Audit Trail</div>
            </div>

            {/* Slip Body */}
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                  {slipData.serialNumber}
                </span>
                <div>
                  <div className="font-bold text-xs leading-tight text-slate-900">
                    {slipData.candidateName}
                  </div>
                  <div className="text-[9px] text-slate-600 font-medium">
                    {slipData.partyName}
                  </div>
                </div>
              </div>

              {/* Symbol */}
              <div className="p-1 bg-slate-50 rounded border border-slate-200">
                <CandidateSymbol symbolKey={slipData.symbolName} className="w-8 h-8" />
              </div>
            </div>

            {/* Slip Security Stamp */}
            <div className="pt-2 flex items-center justify-between text-[8px] text-slate-500 font-mono">
              <span>{slipData.timestamp}</span>
              <span className="font-bold text-indigo-900">{slipData.secureToken}</span>
            </div>

            {/* Simulated barcode */}
            <div className="mt-1.5 h-3 flex items-center justify-center gap-0.5 overflow-hidden opacity-70">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i % 3 === 0 ? 'w-1 bg-black' : 'w-0.5 bg-black'}`}
                ></div>
              ))}
            </div>
          </div>
        ) : isCompleted ? (
          <div className="text-center p-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
            <div className="font-bold text-sm text-emerald-300">Vote Successfully Recorded</div>
            <p className="text-xs text-stone-400 mt-1">
              Printed audit slip dropped into sealed statutory compartment.
            </p>
          </div>
        ) : (
          <div className="text-center p-4 text-stone-600 font-mono text-xs">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-stone-700 flex items-center justify-center mx-auto mb-2 text-stone-600">
              <Eye className="w-5 h-5" />
            </div>
            <span>VVPAT WINDOW READY</span>
            <p className="text-[10px] text-stone-600 mt-1">
              Window will light up for 7 seconds upon ballot button press.
            </p>
          </div>
        )}
      </div>

      {/* Drop Box Section (Sealed Compartment) */}
      <div className="mt-4 bg-stone-950 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-500" />
          <div className="flex flex-col">
            <span className="font-mono font-bold text-stone-200">SEALED DROP COMPARTMENT</span>
            <span className="text-[10px] text-stone-500">
              Double-sealed with candidate agent paper seals
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
          RULE 56D
        </span>
      </div>
    </div>
  );
};
