import { describe, it, expect } from 'vitest';
import { calculateReadinessScore } from '../utils/readinessCalc';
import { ReadinessAnswerState } from '../types/election';

describe('calculateReadinessScore', () => {
  it('marks voter as not eligible if under 18', () => {
    const answers: ReadinessAnswerState = {
      is18OrAbove: false,
      qualifyingDateAcknowledged: true,
      isIndianCitizen: true,
      isNameOnRoll: true,
      hasEpicCard: true,
      selectedAlternateId: null,
      knowsPollingStation: true,
      hasVoterSlipOrApp: true,
    };

    const result = calculateReadinessScore(answers);
    expect(result.status).toBe('not_eligible');
    expect(result.score).toBe(0);
    expect(result.actionItems).toContain(
      'Mark your calendar for the qualifying date prior to your 18th birthday.'
    );
  });

  it('marks voter as not eligible if not an Indian citizen', () => {
    const answers: ReadinessAnswerState = {
      is18OrAbove: true,
      qualifyingDateAcknowledged: true,
      isIndianCitizen: false,
      isNameOnRoll: true,
      hasEpicCard: true,
      selectedAlternateId: null,
      knowsPollingStation: true,
      hasVoterSlipOrApp: true,
    };

    const result = calculateReadinessScore(answers);
    expect(result.status).toBe('not_eligible');
    expect(result.score).toBe(0);
  });

  it('returns fully_ready with score >= 85 when all requirements are satisfied', () => {
    const answers: ReadinessAnswerState = {
      is18OrAbove: true,
      qualifyingDateAcknowledged: true,
      isIndianCitizen: true,
      isNameOnRoll: true,
      hasEpicCard: true,
      selectedAlternateId: null,
      knowsPollingStation: true,
      hasVoterSlipOrApp: true,
    };

    const result = calculateReadinessScore(answers);
    expect(result.status).toBe('fully_ready');
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.missingDocuments.length).toBe(0);
  });

  it('alerts critically when voter has EPIC card but name is not on the Electoral Roll', () => {
    const answers: ReadinessAnswerState = {
      is18OrAbove: true,
      qualifyingDateAcknowledged: true,
      isIndianCitizen: true,
      isNameOnRoll: false,
      hasEpicCard: true,
      selectedAlternateId: null,
      knowsPollingStation: true,
      hasVoterSlipOrApp: true,
    };

    const result = calculateReadinessScore(answers);
    expect(result.status).toBe('needs_action');
    expect(result.actionItems.some((item) => item.includes('Form 6'))).toBe(true);
    expect(result.missingDocuments).toContain('Inclusion in current constituency Electoral Roll');
  });

  it('starts at 0% when all questions are unanswered', () => {
    const blankState: ReadinessAnswerState = {
      is18OrAbove: null,
      qualifyingDateAcknowledged: null,
      isIndianCitizen: null,
      isNameOnRoll: null,
      hasEpicCard: null,
      selectedAlternateId: null,
      knowsPollingStation: null,
      hasVoterSlipOrApp: null,
    };

    const result = calculateReadinessScore(blankState);
    expect(result.score).toBe(0);
    expect(result.status).toBe('needs_action');
    expect(result.title).toContain('Diagnostic Not Started (0%)');
  });

  it('progressively increments readiness percentage after answering each question', () => {
    const state: ReadinessAnswerState = {
      is18OrAbove: null,
      qualifyingDateAcknowledged: null,
      isIndianCitizen: null,
      isNameOnRoll: null,
      hasEpicCard: null,
      selectedAlternateId: null,
      knowsPollingStation: null,
      hasVoterSlipOrApp: null,
    };

    // Initially 0%
    expect(calculateReadinessScore(state).score).toBe(0);

    // Q1: Age 18+ answered (+20%)
    state.is18OrAbove = true;
    expect(calculateReadinessScore(state).score).toBe(20);

    // Q2: Citizen answered (+15%)
    state.isIndianCitizen = true;
    expect(calculateReadinessScore(state).score).toBe(35);

    // Q3: Name on Roll answered (+25%)
    state.isNameOnRoll = true;
    expect(calculateReadinessScore(state).score).toBe(60);

    // Q4: Has EPIC answered (+15%)
    state.hasEpicCard = true;
    expect(calculateReadinessScore(state).score).toBe(75);

    // Q5: Polling station answered (+15%)
    state.knowsPollingStation = true;
    expect(calculateReadinessScore(state).score).toBe(90);

    // Q6: Voter slip / app answered (+10%)
    state.hasVoterSlipOrApp = true;
    expect(calculateReadinessScore(state).score).toBe(100);
  });
});
