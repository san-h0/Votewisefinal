import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVoterPath } from '../../context/VoterPathContext';
import { OFFICIAL_CANDIDATES } from '../../data/candidates';
import { Candidate, EvmStage, VvpatSlipData } from '../../types/election';
import { playEvmBeep, stopCurrentTone } from '../../utils/beep';
import { BallotUnit } from './BallotUnit';
import { VvpatUnit } from './VvpatUnit';
import {
  UserCheck,
  FilePenLine,
  Ticket,
  Vote,
  RotateCcw,
  Sparkles,
  Award,
  Fingerprint,
  Link,
  ShieldCheck,
} from 'lucide-react';

export const EvmSimulator: React.FC = () => {
  const { soundEnabled, incrementSimulations, totalSimulationsRun } = useVoterPath();

  // Initialize with ballot ready so users can test voting immediately
  const [currentStage, setCurrentStage] = useState<EvmStage>('ballot_ready');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [vvpatSlip, setVvpatSlip] = useState<VvpatSlipData | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(7.0);
  const [voterName] = useState<string>('Ananya Sen');
  const [epicNumber] = useState<string>('IND8492041');
  const [electoralRollPart] = useState<number>(142);
  const [electoralRollSerial] = useState<number>(318);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioStopFnRef = useRef<(() => void) | null>(null);

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      stopCurrentTone();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Step 1: Officer 1 Verification (No beep)
  const handleOfficer1Verify = useCallback(() => {
    setCurrentStage('officer2_ink_register');
  }, []);

  // Step 2: Officer 2 Ink Marking & Register 17A (No beep)
  const handleOfficer2MarkInk = useCallback(() => {
    setCurrentStage('officer3_ballot_issued');
  }, []);

  // Step 3: Officer 3 authorizes ballot (No beep)
  const handlePressBallotOnCU = useCallback(() => {
    setSelectedCandidate(null);
    setVvpatSlip(null);
    setSecondsRemaining(7.0);
    setCurrentStage('ballot_ready');
  }, []);

  // Step 4: Voter presses Blue Vote Button on Ballot Unit -> triggers 5-second beep
  const handleVoteCandidate = useCallback(
    (candidate: Candidate) => {
      // Prevent double votes while voting process is ongoing
      if (['button_pressed', 'vvpat_display', 'vvpat_dropped'].includes(currentStage)) {
        return;
      }

      setSelectedCandidate(candidate);
      setCurrentStage('button_pressed');

      // 1. Play authentic 440Hz tone for strictly 5 seconds upon pressing vote
      const stopTone = playEvmBeep(5000, soundEnabled);
      audioStopFnRef.current = stopTone;

      // 2. Prepare VVPAT slip data
      const token = `ECI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const slip: VvpatSlipData = {
        serialNumber: candidate.serialNumber,
        candidateName: candidate.name,
        partyName: candidate.partyName,
        symbolName: candidate.symbolSvg,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        secureToken: token,
      };
      setVvpatSlip(slip);

      // 3. Light up VVPAT for 7 seconds
      setCurrentStage('vvpat_display');
      setSecondsRemaining(7.0);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remain = Math.max(0, 7.0 - elapsed);
        setSecondsRemaining(remain);

        if (remain <= 0) {
          clearInterval(interval);
          setCurrentStage('vvpat_dropped');

          // Wait brief moment for drop animation to finish, then complete
          setTimeout(() => {
            setCurrentStage('vote_completed');
            incrementSimulations();
          }, 700);
        }
      }, 100);

      countdownTimerRef.current = interval;
    },
    [currentStage, soundEnabled, incrementSimulations]
  );

  // Direct activation of VVPAT Audit Unit -> triggers 5-second beep
  const handleTriggerVvpatAudit = useCallback(() => {
    const candidateToAudit = selectedCandidate || OFFICIAL_CANDIDATES[0];
    setSelectedCandidate(candidateToAudit);

    // Play 5-second tone upon voting/audit trigger
    const stopTone = playEvmBeep(5000, soundEnabled);
    audioStopFnRef.current = stopTone;

    const token = `ECI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const slip: VvpatSlipData = {
      serialNumber: candidateToAudit.serialNumber,
      candidateName: candidateToAudit.name,
      partyName: candidateToAudit.partyName,
      symbolName: candidateToAudit.symbolSvg,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      secureToken: token,
    };
    setVvpatSlip(slip);

    setCurrentStage('vvpat_display');
    setSecondsRemaining(7.0);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remain = Math.max(0, 7.0 - elapsed);
      setSecondsRemaining(remain);

      if (remain <= 0) {
        clearInterval(interval);
        setCurrentStage('vvpat_dropped');
        setTimeout(() => {
          setCurrentStage('vote_completed');
          incrementSimulations();
        }, 700);
      }
    }, 100);

    countdownTimerRef.current = interval;
  }, [selectedCandidate, soundEnabled, incrementSimulations]);

  // Reset simulator for new vote session
  const handleResetSimulation = useCallback(() => {
    stopCurrentTone();
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setSelectedCandidate(null);
    setVvpatSlip(null);
    setSecondsRemaining(7.0);
    setCurrentStage('ballot_ready');
  }, []);

  return (
    <section className="space-y-8" aria-label="EVM & VVPAT Booth Simulator">
      {/* Hero Intro Banner */}
      <div className="bg-white dark:bg-[#111827] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-md border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Web EVM Booth • Model M3 & VVPAT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EVM & VVPAT Polling Booth Simulator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Experience the complete authentic voting journey. Step inside the booth to cast your vote on the
            Ballot Unit and audit the 7-second printed verification slip on the VVPAT.
          </p>
        </div>

        {/* Polling Station Stage Indicator Bar (Interactive) */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              STATION FLOW PROGRESS (CLICK ANY STAGE TO INSPECT):
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-emerald-400 border border-indigo-200 dark:border-slate-700">
              STATUS: {currentStage.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Step 1 */}
            <button
              type="button"
              id="step-1-btn"
              onClick={() => setCurrentStage('officer1_id_check')}
              className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                currentStage === 'officer1_id_check'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30 font-bold shadow-xs'
                  : ['officer2_ink_register', 'officer3_ballot_issued', 'ballot_ready', 'button_pressed', 'vvpat_display', 'vvpat_dropped', 'vote_completed'].includes(currentStage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Step 1</span>
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="font-medium mt-1">Polling Officer 1</div>
              <div className="text-[10px] opacity-75">ID & Roll Check</div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              id="step-2-btn"
              onClick={() => setCurrentStage('officer2_ink_register')}
              className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                currentStage === 'officer2_ink_register'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30 font-bold shadow-xs'
                  : ['officer3_ballot_issued', 'ballot_ready', 'button_pressed', 'vvpat_display', 'vvpat_dropped', 'vote_completed'].includes(currentStage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Step 2</span>
                <Fingerprint className="w-3.5 h-3.5" />
              </div>
              <div className="font-medium mt-1">Polling Officer 2</div>
              <div className="text-[10px] opacity-75">Ink & Register 17A</div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              id="step-3-btn"
              onClick={() => setCurrentStage('officer3_ballot_issued')}
              className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                currentStage === 'officer3_ballot_issued'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30 font-bold shadow-xs'
                  : ['ballot_ready', 'button_pressed', 'vvpat_display', 'vvpat_dropped', 'vote_completed'].includes(currentStage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Step 3</span>
                <Ticket className="w-3.5 h-3.5" />
              </div>
              <div className="font-medium mt-1">Polling Officer 3</div>
              <div className="text-[10px] opacity-75">Clearance</div>
            </button>

            {/* Step 4 */}
            <button
              type="button"
              id="step-4-btn"
              onClick={handlePressBallotOnCU}
              className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                ['ballot_ready', 'button_pressed'].includes(currentStage)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30 font-bold shadow-xs'
                  : ['vvpat_display', 'vvpat_dropped', 'vote_completed'].includes(currentStage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Step 4</span>
                <Vote className="w-3.5 h-3.5" />
              </div>
              <div className="font-medium mt-1">Ballot Unit (BU)</div>
              <div className="text-[10px] opacity-75">Cast Secret Vote</div>
            </button>

            {/* Step 5 */}
            <button
              type="button"
              id="step-5-btn"
              onClick={handleTriggerVvpatAudit}
              className={`p-3 rounded-xl border text-xs text-left transition-all col-span-2 md:col-span-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-hidden ${
                ['vvpat_display', 'vvpat_dropped'].includes(currentStage)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30 font-bold shadow-xs'
                  : currentStage === 'vote_completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Step 5</span>
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="font-medium mt-1">VVPAT Audit Slip</div>
              <div className="text-[10px] opacity-75">7-Sec Paper Audit</div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Polling Officers Desk (Steps 1 to 3) */}
      <div className="bg-[#180933] rounded-3xl border border-indigo-900/60 p-6 sm:p-8 shadow-xl text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-indigo-900/60 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Statutory Polling Station Entry Desk
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Steps 1–3: Polling Officers Verification & Ballot Enablement
            </h3>
          </div>
          <div className="text-xs font-mono px-3 py-1 bg-indigo-950/80 rounded-lg text-slate-300 border border-indigo-800/80">
            Total Sessions Completed: <strong className="text-emerald-400">{totalSimulationsRun}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card: Polling Officer 1 */}
          <div
            id="officer-1-card"
            className={`rounded-2xl p-5 border transition-all ${
              currentStage === 'officer1_id_check'
                ? 'bg-[#281352] border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg'
                : 'bg-[#200e3f] border-indigo-900/50 opacity-90'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                PO 1
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">First Polling Officer</h4>
                <p className="text-[11px] text-slate-400">In charge of Marked Electoral Roll</p>
              </div>
            </div>

            <div className="bg-[#15072b] rounded-xl p-3.5 border border-indigo-950 text-xs space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Voter Name:</span>
                <span className="font-bold text-white">{voterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EPIC ID:</span>
                <span className="font-bold text-white">{epicNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Part / Serial:</span>
                <span className="font-bold text-teal-300">
                  Part {electoralRollPart} / No. {electoralRollSerial}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              PO1 verifies your face against the photo roll, reads your name and serial aloud for party agents, and crosses your roll entry.
            </p>

            <button
              type="button"
              id="po1-verify-btn"
              onClick={handleOfficer1Verify}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 outline-hidden"
            >
              <UserCheck className="w-4 h-4" />
              <span>{currentStage === 'officer1_id_check' ? 'Verify Identity & Roll (PO1) → Advance' : '✓ Re-Verify Identity (PO1)'}</span>
            </button>
          </div>

          {/* Card: Polling Officer 2 */}
          <div
            id="officer-2-card"
            className={`rounded-2xl p-5 border transition-all ${
              currentStage === 'officer2_ink_register'
                ? 'bg-[#281352] border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                : 'bg-[#200e3f] border-indigo-900/50 opacity-90'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                PO 2
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Second Polling Officer</h4>
                <p className="text-[11px] text-slate-400">Indelible Ink & Register of Voters 17A</p>
              </div>
            </div>

            <div className="bg-[#15072b] rounded-xl p-3.5 border border-indigo-950 text-xs space-y-2 mb-4">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-purple-500 ring-1 ring-purple-300"></span>
                <span>Silver nitrate ink on left index finger</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FilePenLine className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory signature recorded in Register 17A</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span>Voter's Slip issued to elector</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              PO2 marks your left index finger with permanent indelible ink, records your signature in Form 17A, and issues your slip.
            </p>

            <button
              type="button"
              id="po2-ink-btn"
              onClick={handleOfficer2MarkInk}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 outline-hidden"
            >
              <Fingerprint className="w-4 h-4" />
              <span>
                {currentStage === 'officer2_ink_register'
                  ? 'Mark Ink & Issue Slip (PO2) → Advance'
                  : '✓ Apply Ink & Slip (PO2)'}
              </span>
            </button>
          </div>

          {/* Card: Polling Officer 3 / Presiding Officer */}
          <div
            id="officer-3-card"
            className={`rounded-2xl p-5 border transition-all ${
              currentStage === 'officer3_ballot_issued'
                ? 'bg-[#281352] border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                : 'bg-[#200e3f] border-indigo-900/50 opacity-90'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                PO 3
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Third Polling Officer (CU)</h4>
                <p className="text-[11px] text-slate-400">Collects slip & issues electronic ballot</p>
              </div>
            </div>

            <div className="bg-[#15072b] rounded-xl p-3.5 border border-indigo-950 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Ink Inspection:</span>
                <span className="font-bold text-emerald-400">Verified on Left Forefinger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slip Deposited:</span>
                <span className="font-bold text-white">Serial No. 318</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Control Unit:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {currentStage === 'officer3_ballot_issued' ? 'READY FOR BALLOT' : 'BALLOT OPEN'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              PO3 takes your voter slip and presses the BALLOT button on the Control Unit. This electronically unlocks the Ballot Unit inside the voting compartment.
            </p>

            <button
              type="button"
              id="po3-ballot-btn"
              onClick={handlePressBallotOnCU}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold shadow-xs focus-visible:ring-2 focus-visible:ring-amber-300 outline-hidden"
            >
              <Ticket className="w-4 h-4" />
              <span>Press Ballot Button on CU → Arm EVM Booth</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: The Polling Booth (2-Block Layout: Ballot Unit & VVPAT) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${['ballot_ready'].includes(currentStage) ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                Inside The Polling Compartment (Rule 49M)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
              EVM Ballot Unit (BU) & VVPAT Audit System
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="arm-ballot-header-btn"
              onClick={handlePressBallotOnCU}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white border border-emerald-400/40 text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 outline-hidden transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Arm Booth (Ready to Vote)</span>
            </button>
            <button
              type="button"
              id="reset-sim-btn"
              onClick={handleResetSimulation}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 outline-hidden transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Booth</span>
            </button>
          </div>
        </div>

        {/* 2-Block Arranged Layout for Web */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Block 1: The EVM Ballot Unit (BU) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                UNIT 1: BALLOT UNIT (BU)
              </span>
              <span className="text-slate-400">VOTER COMPARTMENT</span>
            </div>
            <BallotUnit
              candidates={OFFICIAL_CANDIDATES}
              isReady={['ballot_ready'].includes(currentStage)}
              isLocked={['button_pressed', 'vvpat_display', 'vvpat_dropped'].includes(currentStage)}
              votedCandidateId={selectedCandidate?.id ?? null}
              onVote={handleVoteCandidate}
            />
          </div>

          {/* Block 2: The VVPAT Unit */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                UNIT 2: VVPAT AUDIT PRINTER
              </span>
              <span className="text-amber-300">7-SECOND AUDIT</span>
            </div>
            <VvpatUnit
              slipData={vvpatSlip}
              isLightOn={['vvpat_display'].includes(currentStage)}
              secondsRemaining={secondsRemaining}
              isDropped={['vvpat_dropped', 'vote_completed'].includes(currentStage)}
              isCompleted={currentStage === 'vote_completed'}
            />

            {/* Direct Cord Connection Visual Badge */}
            <div className="mt-4 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Link className="w-3.5 h-3.5" />
                <span>Direct Air-Gapped Connection</span>
              </span>
              <span className="text-slate-300 font-semibold">BU ↔ VVPAT CORDED INTERFACE</span>
            </div>
          </div>
        </div>

        {/* Completion Confirmation Banner */}
        {currentStage === 'vote_completed' && selectedCandidate && (
          <div
            id="vote-completed-banner"
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border-2 border-emerald-500/80 text-white shadow-xl animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Official ECI Simulation Audit Record
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black">
                      VOTE CAST & AUDITED
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    Vote Recorded for Candidate #{selectedCandidate.serialNumber}: {selectedCandidate.name} ({selectedCandidate.partyAbbreviation})
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    The 5-second confirmation beep sounded, the ballot registered on the internal tamper-proof OTP chip, and the VVPAT slip was audited for 7 seconds before securely dropping into the sealed drop box.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  id="vote-again-btn"
                  onClick={handleResetSimulation}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-300 outline-hidden flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Test Another Vote</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Civic Walkthrough Guide */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-800 dark:text-slate-200 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-emerald-400" />
          <span>Why the EVM + VVPAT Architecture is 100% Tamper-Proof</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Air-Gapped Hardware (No Wireless)
            </h4>
            <p>
              EVMs have no Wi-Fi, Bluetooth, cellular, internet, or operating system. They cannot communicate with external networks and operate purely on sealed 7.5V battery packs.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              7-Second Physical Paper Audit
            </h4>
            <p>
              The VVPAT gives voters direct visual verification of their choice for 7 seconds. The printed slip is stored in a sealed box and physically counted to cross-verify EVM electronic tallies.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              One-Time Programmable (OTP) Chips
            </h4>
            <p>
              Microcontrollers are manufactured by BEL and ECIL with permanently burnt machine code. Once written at the factory, the microchip software cannot be modified, reprogrammed, or rewritten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
