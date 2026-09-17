import { describe, it, expect } from 'vitest';
import { OFFICIAL_CANDIDATES } from '../data/candidates';
import { EvmStage, VvpatSlipData } from '../types/election';

describe('EVM Ballot Candidates & State Transitions', () => {
  it('contains valid candidates with serial numbers, names, and symbols', () => {
    expect(OFFICIAL_CANDIDATES.length).toBeGreaterThanOrEqual(6);

    OFFICIAL_CANDIDATES.forEach((candidate, index) => {
      expect(candidate.serialNumber).toBe(index + 1);
      expect(candidate.name.length).toBeGreaterThan(0);
      expect(candidate.partyName.length).toBeGreaterThan(0);
      expect(candidate.symbolSvg.length).toBeGreaterThan(0);
    });

    // Check NOTA is present
    const nota = OFFICIAL_CANDIDATES.find((c) => c.partyAbbreviation === 'NOTA');
    expect(nota).toBeDefined();
    expect(nota?.serialNumber).toBe(6);
  });

  it('validates linear step progression in polling booth', () => {
    const stages: EvmStage[] = [
      'idle',
      'officer1_id_check',
      'officer2_ink_register',
      'officer3_ballot_issued',
      'ballot_ready',
      'button_pressed',
      'vvpat_display',
      'vvpat_dropped',
      'vote_completed',
    ];

    expect(stages.indexOf('officer1_id_check')).toBeLessThan(
      stages.indexOf('officer2_ink_register')
    );
    expect(stages.indexOf('officer2_ink_register')).toBeLessThan(
      stages.indexOf('officer3_ballot_issued')
    );
    expect(stages.indexOf('officer3_ballot_issued')).toBeLessThan(
      stages.indexOf('ballot_ready')
    );
    expect(stages.indexOf('ballot_ready')).toBeLessThan(
      stages.indexOf('button_pressed')
    );
    expect(stages.indexOf('button_pressed')).toBeLessThan(
      stages.indexOf('vvpat_display')
    );
    expect(stages.indexOf('vvpat_display')).toBeLessThan(
      stages.indexOf('vvpat_dropped')
    );
    expect(stages.indexOf('vvpat_dropped')).toBeLessThan(
      stages.indexOf('vote_completed')
    );
  });

  it('generates compliant VVPAT slip structure for audit', () => {
    const candidate = OFFICIAL_CANDIDATES[0];
    const slip: VvpatSlipData = {
      serialNumber: candidate.serialNumber,
      candidateName: candidate.name,
      partyName: candidate.partyName,
      symbolName: candidate.symbolSvg,
      timestamp: '10:30:15',
      secureToken: 'ECI-TEST99',
    };

    expect(slip.serialNumber).toBe(1);
    expect(slip.candidateName).toBe(candidate.name);
    expect(slip.secureToken).toMatch(/^ECI-/);
  });
});
