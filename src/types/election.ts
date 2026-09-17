export type TabType = 'simulator' | 'lifecycle' | 'readiness' | 'myths';

export interface Candidate {
  id: number;
  serialNumber: number;
  name: string;
  partyName: string;
  partyAbbreviation: string;
  symbolName: string;
  symbolSvg: string; // SVG path or identifier
  color: string;
}

export type EvmStage =
  | 'idle'
  | 'officer1_id_check'
  | 'officer2_ink_register'
  | 'officer3_ballot_issued'
  | 'ballot_ready'
  | 'button_pressed'
  | 'vvpat_display'
  | 'vvpat_dropped'
  | 'vote_completed';

export interface VvpatSlipData {
  serialNumber: number;
  candidateName: string;
  partyName: string;
  symbolName: string;
  timestamp: string;
  secureToken: string;
}

export type LifecycleViewMode = 'summary' | 'deep_dive';

export interface LifecyclePhase {
  id: string;
  phaseNumber: number;
  title: string;
  period: string;
  summary: string;
  quickPoints: string[];
  constitutionalArticles: string[];
  statutoryRules: string[];
  keyOfficials: string[];
  criticalSafeguards: string[];
}

export interface ReadinessAnswerState {
  is18OrAbove: boolean | null;
  qualifyingDateAcknowledged: boolean | null;
  isIndianCitizen: boolean | null;
  isNameOnRoll: boolean | null;
  hasEpicCard: boolean | null;
  selectedAlternateId: string | null;
  knowsPollingStation: boolean | null;
  hasVoterSlipOrApp: boolean | null;
}

export interface ReadinessEvaluation {
  score: number;
  status: 'fully_ready' | 'needs_action' | 'not_eligible';
  title: string;
  summary: string;
  strengths: string[];
  actionItems: string[];
  missingDocuments: string[];
}

export interface AlternateIdOption {
  id: string;
  name: string;
  description: string;
  authority: string;
  category: string;
}

export interface MythCard {
  id: string;
  myth: string;
  fact: string;
  category: 'evm_security' | 'voter_rights' | 'polling_day' | 'reforms';
  officialReference: string;
  eciManualSection: string;
}

export interface JargonTerm {
  term: string;
  fullForm?: string;
  definition: string;
  category: 'forms' | 'machinery' | 'personnel' | 'protocols';
  officialContext: string;
}
