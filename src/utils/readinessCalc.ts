import { ReadinessAnswerState, ReadinessEvaluation } from '../types/election';
import { ACCEPTED_ALTERNATE_IDS } from '../data/readinessChecklist';

/**
 * Calculates the dynamic voter readiness evaluation score and diagnostic advice.
 * Starting at 0% when unanswered, the score increments progressively as each question is answered:
 * - Age (18+): +20%
 * - Indian Citizen: +15%
 * - Name on Electoral Roll: +25%
 * - Photo ID (EPIC or 1 of 12 Alternate IDs): +15%
 * - Polling Booth known: +15%
 * - Voter Slip / e-EPIC App: +10%
 * Total: 100%
 */
export function calculateReadinessScore(answers: ReadinessAnswerState): ReadinessEvaluation {
  let score = 0;
  const strengths: string[] = [];
  const actionItems: string[] = [];
  const missingDocuments: string[] = [];

  // Check if all questions are unanswered (blank/reset initial state)
  const isAllUnanswered =
    answers.is18OrAbove === null &&
    answers.isIndianCitizen === null &&
    answers.isNameOnRoll === null &&
    answers.hasEpicCard === null &&
    answers.selectedAlternateId === null &&
    answers.knowsPollingStation === null &&
    answers.hasVoterSlipOrApp === null;

  if (isAllUnanswered) {
    return {
      score: 0,
      status: 'needs_action',
      title: 'Diagnostic Not Started (0%)',
      summary: 'Your voter readiness is currently at 0%. Answer each question across Steps 1 to 4 to verify your prerequisites and watch your readiness percentage climb to 100%.',
      strengths: [],
      actionItems: [
        'Step 1: Confirm your age (18+) and Indian citizenship (+35% readiness).',
        'Step 2: Verify your name in the current Electoral Roll (+25% readiness).',
        'Step 3: Confirm possession of EPIC Voter ID or 1 of 12 approved photo IDs (+15% readiness).',
        'Step 4: Identify your assigned Polling Station and Voter Information Slip (+25% readiness).',
      ],
      missingDocuments: ['Complete questionnaire to identify missing documents'],
    };
  }

  // 1. Age verification (+20%)
  if (answers.is18OrAbove === false) {
    return {
      score: 0,
      status: 'not_eligible',
      title: 'Not Yet Eligible (Under 18)',
      summary: 'You must be at least 18 years old on one of the four qualifying dates (Jan 1, Apr 1, Jul 1, Oct 1) to enroll.',
      strengths: [],
      actionItems: [
        'Mark your calendar for the qualifying date prior to your 18th birthday.',
        'File advance Form 6 application at voters.eci.gov.in starting at age 17+.',
      ],
      missingDocuments: ['Age Proof (Birth Certificate / Class 10 Certificate)'],
    };
  } else if (answers.is18OrAbove === true) {
    score += 20;
    strengths.push('Meets constitutional minimum age threshold (18+).');
  } else {
    actionItems.push('Confirm you are 18+ on or before the next statutory qualifying date.');
  }

  // 2. Citizenship verification (+15%)
  if (answers.isIndianCitizen === false) {
    return {
      score: 0,
      status: 'not_eligible',
      title: 'Ineligible (Must Be Indian Citizen)',
      summary: 'Only citizens of India are eligible to register and vote under Section 19 of the Representation of the People Act, 1950.',
      strengths: [],
      actionItems: ['Review Indian nationality and naturalization statutes before seeking electoral registration.'],
      missingDocuments: ['Proof of Indian Nationality'],
    };
  } else if (answers.isIndianCitizen === true) {
    score += 15;
    strengths.push('Confirmed Indian Citizenship.');
  } else {
    actionItems.push('Confirm Indian citizenship status (Section 19 of RPA 1950).');
  }

  // 3. Name in Electoral Roll (+25%) - Single most important voting prerequisite
  if (answers.isNameOnRoll === true) {
    score += 25;
    strengths.push('Name is actively listed in the Electoral Roll (Form 20).');
  } else if (answers.isNameOnRoll === false) {
    actionItems.push('CRITICAL: Having an ID card is not enough! Your name MUST be on the Electoral Roll. File Form 6 immediately on voters.eci.gov.in.');
    missingDocuments.push('Inclusion in current constituency Electoral Roll');
  } else {
    actionItems.push('Check your name on the Electoral Roll search portal (electoralsearch.eci.gov.in) using your details or EPIC number.');
  }

  // 4. Identification (EPIC or 1 of 12 Alternate IDs) (+15%)
  const selectedAltIdObj = ACCEPTED_ALTERNATE_IDS.find(
    (id) => id.id === answers.selectedAlternateId || id.name === answers.selectedAlternateId
  );
  const alternateIdName = selectedAltIdObj?.name || answers.selectedAlternateId;

  if (answers.hasEpicCard === true) {
    score += 15;
    strengths.push('Possesses official Electors Photo Identity Card (EPIC).');
    if (alternateIdName) {
      strengths.push(`Alternate photo ID on standby: ${alternateIdName}.`);
    }
  } else if (alternateIdName) {
    score += 15;
    strengths.push(`Possesses approved alternate photo ID: ${alternateIdName}.`);
  } else if (answers.hasEpicCard === false) {
    actionItems.push('Prepare at least one of the 12 ECI-approved alternative photo IDs (e.g. Aadhaar, Driving License, Passport, PAN Card).');
    missingDocuments.push('EPIC or approved alternate government photo ID');
  } else {
    actionItems.push('Confirm possession of EPIC card or select one of the 12 approved alternative photo IDs in Step 3.');
  }

  // 5. Polling Station & Booth Awareness (+15%)
  if (answers.knowsPollingStation === true) {
    score += 15;
    strengths.push('Knows precise Polling Station & Booth location.');
  } else if (answers.knowsPollingStation === false) {
    actionItems.push('Locate your assigned polling station and booth room using the Voter Helpline App or SMS helpline (1950).');
  } else {
    actionItems.push('Identify your designated polling station and booth room in Step 4.');
  }

  // 6. Voter Information Slip or App (+10%)
  if (answers.hasVoterSlipOrApp === true) {
    score += 10;
    strengths.push('Voter Information Slip / Voter Helpline App QR code ready for fast lookup.');
  } else if (answers.hasVoterSlipOrApp === false) {
    actionItems.push('Download your digital Voter Information Slip (e-EPIC) or keep your Part & Serial Number handy.');
  } else {
    actionItems.push('Download digital Voter Information Slip (e-EPIC) or locate Part and Serial Number.');
  }

  // Final score clamping
  score = Math.min(100, Math.max(0, score));

  let status: 'fully_ready' | 'needs_action' | 'not_eligible' = 'needs_action';
  let title = `Readiness Diagnostic: ${score}% Ready`;
  let summary = 'Answer diagnostic questions to complete your verification and build readiness.';

  if (score === 100) {
    status = 'fully_ready';
    title = 'Fully Polling Ready (100%) 🗳️';
    summary = 'Outstanding! You satisfy all statutory prerequisites and are 100% prepared to exercise your franchise smoothly on polling day.';
  } else if (score >= 85) {
    status = 'fully_ready';
    title = `Well Prepared (${score}%) 🗳️`;
    summary = 'Great job! You satisfy all essential prerequisites to vote. Review remaining items for a quick, hassle-free voting experience.';
  } else if (score >= 50) {
    status = 'needs_action';
    title = `Good Progress (${score}%)`;
    summary = 'Good progress! Key legal prerequisites are met. Complete your polling station location and documentation in Steps 3 & 4.';
  } else if (score > 0) {
    status = 'needs_action';
    title = `Getting Started (${score}%)`;
    summary = `Your voter readiness is at ${score}%. Continue answering each question in the steps above to increase your readiness score.`;
  } else {
    status = 'needs_action';
    title = 'Diagnostic Not Started (0%)';
    summary = 'Your voter readiness is at 0%. Answer each question across Steps 1 to 4 to verify your prerequisites and see your readiness percentage increase.';
  }

  return {
    score,
    status,
    title,
    summary,
    strengths,
    actionItems,
    missingDocuments,
  };
}
