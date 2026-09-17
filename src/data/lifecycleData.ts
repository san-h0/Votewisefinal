import { LifecyclePhase } from '../types/election';

export const ELECTION_PHASES: LifecyclePhase[] = [
  {
    id: 'phase_1_pre_election',
    phaseNumber: 1,
    title: 'Pre-Election: Delimitation & Voter Roll Revision',
    period: 'T - 6 Months to T - 30 Days',
    summary:
      'The foundational phase where boundaries are gazetted, electoral rolls undergo Special Summary Revision (SSR), election dates are notified, and candidates file sworn affidavits.',
    quickPoints: [
      'Special Summary Revision allows eligible 18-year-olds to register using Form 6.',
      'Draft electoral rolls published at all local polling booths for public claims and objections.',
      'Official statutory notification issued by the President / Governor on recommendation of ECI.',
      'Candidates submit nomination papers along with mandatory Form 26 criminal background and asset affidavits.',
      'Returning Officer scrutinizes nominations in front of candidates; valid list is published.',
    ],
    constitutionalArticles: [
      'Article 324: Superintendence, direction, and control of elections vested in the Election Commission.',
      'Article 326: Universal adult suffrage for every Indian citizen aged 18+ not otherwise disqualified.',
      'Article 82 & 170: Readjustment and delimitation of parliamentary and assembly constituencies.',
    ],
    statutoryRules: [
      'Representation of the People Act, 1950 (Sections 14-25: Preparation of electoral rolls and qualifying dates).',
      'Representation of the People Act, 1951 (Section 30: Dates for nominations, scrutiny, and withdrawal).',
      'Conduct of Elections Rules, 1961 (Form 26: Candidate affidavit disclosure of assets, liabilities & criminal cases).',
    ],
    keyOfficials: [
      'Chief Electoral Officer (CEO) of the State',
      'District Election Officer (DEO) / District Magistrate',
      'Electoral Registration Officer (ERO)',
      'Booth Level Officers (BLOs)',
    ],
    criticalSafeguards: [
      'Public notice period for any addition, deletion, or correction in draft voter rolls.',
      'Two-stage randomisation of EVM Ballot Units and Control Units via dedicated EVM Management System (EMS).',
      'Mandatory video recording of candidate nomination submissions and scrutiny hearings.',
    ],
  },
  {
    id: 'phase_2_campaign',
    phaseNumber: 2,
    title: 'Campaign Phase: Model Code of Conduct & Silence Period',
    period: 'T - 21 Days to T - 48 Hours',
    summary:
      'Parties campaign under strict ethical and financial supervision. The Model Code of Conduct (MCC) comes into force immediately upon announcement to ensure a level playing field.',
    quickPoints: [
      'Model Code of Conduct prohibits ministers from announcing new financial grants or using public resources.',
      'Expenditure limits per candidate strictly tracked by expenditure observers and flying squads.',
      'Use of places of worship, hate speech, or appeals to caste/communal feelings is strictly prohibited.',
      'Strict 48-Hour Silence Period before the conclusion of poll stops all public rallies, loudspeakers, and TV broadcasts.',
      'Pre-certification of political advertisements in electronic media by the MCMC committee is mandatory.',
    ],
    constitutionalArticles: [
      'Article 19(1)(a) & 19(2): Freedom of speech during electioneering balanced with reasonable public order restrictions.',
      'Article 329(b): Bar to interference by courts in electoral matters once election process is set in motion.',
    ],
    statutoryRules: [
      'Section 77 of RPA 1951: Account of election expenses and maximum ceiling compliance.',
      'Section 123 of RPA 1951: Corrupt practices including bribery, undue influence, and promoting communal hatred.',
      'Section 126 of RPA 1951: Prohibition of public meetings and propaganda during period of 48 hours ending with hour fixed for conclusion of poll.',
    ],
    keyOfficials: [
      'General Observers (IAS officers from other states)',
      'Expenditure Observers (IRS officers)',
      'Police Observers (IPS officers)',
      'Flying Squad Teams (FST) & Static Surveillance Teams (SST)',
    ],
    criticalSafeguards: [
      'cVIGIL citizen mobile application enabling any citizen to report MCC violations with geotagged proof in 100 minutes.',
      'Daily physical shadow registers maintained by expenditure monitoring cells.',
      'Candidate bank account tracking exclusively dedicated to election expenses.',
    ],
  },
  {
    id: 'phase_3_polling_day',
    phaseNumber: 3,
    title: 'Polling Day: Mock Poll, Booth Operations & EVM Sealing',
    period: 'Polling Day (05:30 AM to 06:00 PM+)',
    summary:
      'The democratic climax. Starts with an open mock poll witnessed by polling agents, followed by continuous secret voting, and ends with strict multi-party EVM sealing and strong room deposit.',
    quickPoints: [
      '05:30 AM: Mandatory Mock Poll of at least 50 votes cast across all candidates in front of party polling agents.',
      'Mock poll data erased, VVPAT mock slips stamped "MOCK POLL SLIP" and sealed in black envelope.',
      '07:00 AM: Voting commences. Voters undergo 3-officer verification, indelible ink marking, and vote secretly.',
      'EVM Ballot Unit generates an authentic beep and red LED glow, while VVPAT displays the printed slip for 7 seconds.',
      '06:00 PM: Anyone in queue by closing time is given a signed token and permitted to vote.',
      'Presiding Officer records final vote counts in Form 17C, gives copies to all party agents, and seals EVM with green paper seals.',
    ],
    constitutionalArticles: [
      'Article 324: Complete constitutional authority of Presiding Officers inside the polling booth precinct.',
      'Right to Secret Ballot upheld by Supreme Court as an integral facet of free and fair elections.',
    ],
    statutoryRules: [
      'Conduct of Elections Rules, 1961 (Rule 49A to 49X: Procedure for voting by Electronic Voting Machines).',
      'Rule 49M: Maintenance of secrecy of voting by electors within voting compartment.',
      'Rule 49S & 49V: Preparation of Form 17C (Account of Votes Recorded) and sealing of voting machine.',
      'Rule 49MA: Procedure for voter complaint / test vote if VVPAT display is alleged incorrect.',
    ],
    keyOfficials: [
      'Presiding Officer (PrO) - Booth Commander',
      'Polling Officer 1 (PO1) - In charge of marked electoral roll & identity verification',
      'Polling Officer 2 (PO2) - In charge of indelible ink & Register of Voters (Form 17A)',
      'Polling Officer 3 (PO3) - In charge of Control Unit & issuing ballot',
      'Micro-Observers & Webcasting operators',
    ],
    criticalSafeguards: [
      'Green Paper Seal, Special Tag, and Strip Seal applied to Control Unit carrying signatures of party polling agents.',
      'Unique Serial Number of Control Unit, Ballot Unit, and VVPAT documented on Form 17C.',
      'Armed CAPF (Central Armed Police Forces) escort accompanying EVMs straight to fortified Strong Rooms.',
    ],
  },
  {
    id: 'phase_4_counting',
    phaseNumber: 4,
    title: 'Counting & Declaration: Strong Room Audit & Form 21E',
    period: 'Counting Day (08:00 AM onwards)',
    summary:
      'Strong rooms opened before candidates and observers. Postal ballots counted first, followed by round-wise EVM Control Unit count display and mandatory 5-booth VVPAT slip audits.',
    quickPoints: [
      'Strong rooms unsealed only in the presence of Returning Officer, ECI Observer, and candidate agents.',
      '08:00 AM: Counting starts with Postal Ballots and Electronically Transmitted Postal Ballots (ETPBS).',
      '08:30 AM: EVM Control Units brought to counting tables in strictly regulated rounds under CCTV surveillance.',
      'Seal numbers on each Control Unit matched against Form 17C copies before pressing "Result" button.',
      'Mandatory lottery draw to select 5 random polling stations per assembly segment for 100% VVPAT paper slip physical count.',
      'Returning Officer compiles Form 20 (Final Result Sheet) and formally issues Form 21E Certificate of Election.',
    ],
    constitutionalArticles: [
      'Article 324: ECI oversight on declaration of results and dispute resolution before election petitions.',
      'Representation of the People Act, 1951: Section 64 (Counting of votes) and Section 66 (Declaration of results).',
    ],
    statutoryRules: [
      'Conduct of Elections Rules, 1961 (Rule 56C: Counting of votes from voting machines).',
      'Rule 56D: Procedure for counting of paper slips from VVPAT printer upon candidate application.',
      'Form 21C / 21E: Official statutory proclamation and Certificate of Return of Election.',
    ],
    keyOfficials: [
      'Returning Officer (RO) - Sole legal authority to declare winner',
      'Counting Supervisors & Counting Assistants',
      'ECI Counting Observers (Neutral Senior Civil Servants)',
      'Counting Agents of contesting candidates',
    ],
    criticalSafeguards: [
      'Round-by-round tally signed by candidate counting agents and uploaded in real-time to ENCORE portal.',
      'Double physical count verification if the victory margin is less than rejected postal ballots.',
      'VVPAT slips and EVMs stored in sealed trunks in district treasury strong rooms for 45-day election petition window.',
    ],
  },
];
