import { AlternateIdOption } from '../types/election';

export const ACCEPTED_ALTERNATE_IDS: AlternateIdOption[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: '12-digit UIDAI biometric identification card / letter / e-Aadhaar',
    authority: 'Unique Identification Authority of India (UIDAI)',
    category: 'Universal Biometric',
  },
  {
    id: 'driving_licence',
    name: 'Driving Licence',
    description: 'Smart card or laminated paper driving license with photograph',
    authority: 'Regional Transport Office (Ministry of Road Transport & Highways)',
    category: 'Transport & Motor Vehicle',
  },
  {
    id: 'passport',
    name: 'Indian Passport',
    description: 'Valid Republic of India passport (mandatory for registered NRI voters)',
    authority: 'Ministry of External Affairs (Consular, Passport & Visa Division)',
    category: 'Citizenship & Travel',
  },
  {
    id: 'pan_card',
    name: 'PAN Card (Permanent Account Number)',
    description: 'Physical laminated PAN card containing taxpayer photo and signature',
    authority: 'Income Tax Department (CBDT)',
    category: 'Financial & Tax Identity',
  },
  {
    id: 'mnrega_card',
    name: 'MGNREGA Job Card',
    description: 'Mahatma Gandhi National Rural Employment Guarantee Act card with photo',
    authority: 'Ministry of Rural Development / District Programme Coordinator',
    category: 'Rural Welfare & Livelihood',
  },
  {
    id: 'bank_passbook',
    name: 'Bank / Post Office Passbook with Photo',
    description: 'Passbook issued by Public Sector Banks, Regional Rural Banks, or India Post',
    authority: 'Scheduled Commercial Banks / Department of Posts',
    category: 'Banking & Postal',
  },
  {
    id: 'health_insurance_card',
    name: 'Smart Card under Ministry of Labour Schemes',
    description: 'Ayushman Bharat PMJAY or Rashtriya Swasthya Bima Yojana smart card',
    authority: 'Ministry of Labour & Employment / National Health Authority',
    category: 'Social Health Security',
  },
  {
    id: 'pension_document',
    name: 'Pension Document with Photograph',
    description: 'Pension Payment Order (PPO) booklet or ex-servicemen contributory health card',
    authority: 'Central / State Pension Directorate or Ministry of Defence',
    category: 'Retirement & Veteran',
  },
  {
    id: 'service_id_card',
    name: 'Official Service Identity Card',
    description: 'Photo identity card issued to employees by Central/State Govts, PSUs, or Public Limited Cos',
    authority: 'Appropriate Government / Public Sector Undertaking',
    category: 'Public Sector Employment',
  },
  {
    id: 'mp_mla_id',
    name: 'Official Identity Card for MPs / MLAs / MLCs',
    description: 'Identity cards issued to sitting or former legislators',
    authority: 'Secretariat of Lok Sabha / Rajya Sabha / State Legislative Assemblies',
    category: 'Constitutional Office',
  },
  {
    id: 'udid_card',
    name: 'Unique Disability ID (UDID) Card',
    description: 'National disability identity card issued to Persons with Disabilities (PwD)',
    authority: 'Department of Empowerment of Persons with Disabilities (DEPwD)',
    category: 'Special Accessibility',
  },
  {
    id: 'npr_smart_card',
    name: 'Smart Card issued by RGI under NPR',
    description: 'Microprocessor chip card issued under the National Population Register',
    authority: 'Registrar General of India (Ministry of Home Affairs)',
    category: 'Demographic Register',
  },
];

export const QUALIFYING_DATES = [
  { date: 'January 1', description: 'Primary annual qualifying milestone' },
  { date: 'April 1', description: 'Quarterly rolling update registration' },
  { date: 'July 1', description: 'Monsoon cycle continuous update' },
  { date: 'October 1', description: 'Autumn pre-revision enrollment window' },
];
