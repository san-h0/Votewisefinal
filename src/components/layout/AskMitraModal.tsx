import React, { useState } from 'react';
import { X, Sparkles, Send, ShieldCheck, HelpCircle, CheckCircle2, MessageSquare } from 'lucide-react';

interface AskMitraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QnAPair {
  question: string;
  answer: string;
  category: string;
  followUps: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  followUps?: string[];
}

const CIVIC_KNOWLEDGE_BASE: QnAPair[] = [
  {
    category: 'VVPAT & EVM Verification',
    question: 'How does the VVPAT 7-second audit work?',
    answer:
      'Under Rule 49M of the Conduct of Elections Rules 1961, when you press the blue button on the Ballot Unit, the VVPAT machine prints a paper slip displaying the serial number, candidate name, and allotted symbol. The slip remains visible behind a transparent glass window for exactly 7 seconds under bright LED illumination so you can verify your vote with your own eyes before it automatically cuts and drops into the sealed drop box.',
    followUps: [
      'What if the VVPAT paper slip does not match my vote?',
      'Can I take the printed VVPAT slip home with me?',
      'How are VVPAT slips counted on counting day?',
    ],
  },
  {
    category: 'Identification & Documents',
    question: 'Can I vote without an EPIC voter card if I have Aadhaar?',
    answer:
      'YES! As long as your name appears in the current Electoral Roll for your polling station, you DO NOT strictly need a physical EPIC card. The Election Commission of India authorizes 12 alternative government photo identity documents, including: Aadhaar Card, Driving License, Passport, PAN Card, MNREGA Job Card, Bank/Post Office Passbook with photo, and Official Identity Cards.',
    followUps: [
      'Which 12 alternative photo IDs are accepted by ECI?',
      'What if my photo on the electoral roll is blurry?',
      'Can a digital copy of Aadhaar on mobile be used?',
    ],
  },
  {
    category: 'Electoral Registration',
    question: 'What is the difference between Form 6 and Form 8?',
    answer:
      'Form 6 is used for FIRST-TIME voter registration by any Indian citizen who has reached 18 years of age. Form 8 is used for correction of details (name, photo, DOB, address) or shifting of residence within or outside your constituency. You can submit both online via voters.eci.gov.in or the Voter Helpline App.',
    followUps: [
      'How do I track my Form 6 application status?',
      'What are the 4 qualifying dates for turning 18?',
      'How do I shift my voting address to a new constituency?',
    ],
  },
  {
    category: 'EVM Integrity & Security',
    question: 'Can EVMs be hacked through Wi-Fi, Bluetooth, or cellular networks?',
    answer:
      'NO. Indian EVMs (M3 generation manufactured by BEL and ECIL) are 100% standalone battery-operated computers. They contain NO operating system, NO internet access, NO Wi-Fi, NO Bluetooth, and NO radio receivers. The microchip is One-Time Programmable (OTP) fused at the factory, meaning firmware cannot be rewritten or modified wirelessly.',
    followUps: [
      'Why do EVMs use One-Time Programmable (OTP) chips?',
      'Who manufactures EVMs in India?',
      'How is mock poll conducted before voting begins?',
    ],
  },
  {
    category: 'Polling Day Rights',
    question: 'What happens if someone else already voted in my name?',
    answer:
      'Under Rule 49P of Conduct of Elections Rules, if a voter finds that someone has already cast a vote in their name, they can immediately inform the Presiding Officer. After answering questions to establish true identity, the elector is issued a "Tendered Ballot Paper" to record their genuine vote, which is securely kept in a special envelope.',
    followUps: [
      'What is a Tendered Ballot Paper under Rule 49P?',
      'What is a Challenged Vote by a polling agent?',
      'Can the Presiding Officer turn away a registered elector?',
    ],
  },
  {
    category: 'Voting Options',
    question: 'What is NOTA (None of the Above)?',
    answer:
      'NOTA is the final option on every Ballot Unit panel (with an inverted triangular symbol). It allows electors to exercise their democratic right to reject all contesting candidates without compromising the secrecy of their ballot under Rule 49B.',
    followUps: [
      'What happens if NOTA gets the highest votes in a constituency?',
      'Does NOTA cause an election to be cancelled?',
      'Where is the NOTA button located on the Ballot Unit?',
    ],
  },
  // Additional comprehensive civic items for follow-ups
  {
    category: 'VVPAT Complaints',
    question: 'What if the VVPAT paper slip does not match my vote?',
    answer:
      'Under Rule 49MA of Conduct of Elections Rules, you can make a written declaration to the Presiding Officer if you allege the VVPAT showed a symbol different from your button press. The Presiding Officer will permit you to cast a test vote in the presence of polling agents. Note: If the test vote confirms the machine is accurate, statutory penal action can be initiated.',
    followUps: [
      'Can I take the printed VVPAT slip home with me?',
      'How are VVPAT slips counted on counting day?',
    ],
  },
  {
    category: 'Alternative IDs',
    question: 'Which 12 alternative photo IDs are accepted by ECI?',
    answer:
      'ECI accepts: 1. Aadhaar Card, 2. MNREGA Job Card, 3. Bank/Post Office Passbook with photo, 4. Health Insurance Smart Card (Ministry of Labour), 5. Driving License, 6. PAN Card, 7. Smart Card issued by RGI under NPR, 8. Indian Passport, 9. Pension Document with photo, 10. Service ID Card (Govt/PSU/Public Ltd), 11. Official ID Card for MPs/MLAs/MLCs, 12. Unique Disability ID (UDID).',
    followUps: [
      'Can I vote without an EPIC voter card if I have Aadhaar?',
      'Can a digital copy of Aadhaar on mobile be used?',
    ],
  },
  {
    category: 'Qualifying Dates',
    question: 'What are the 4 qualifying dates for turning 18?',
    answer:
      'Under the amended Section 14(b) of the Representation of the People Act 1950, young citizens can enroll as electors upon reaching 18 years on any of four statutory qualifying dates in a calendar year: January 1, April 1, July 1, or October 1.',
    followUps: [
      'What is the difference between Form 6 and Form 8?',
      'How do I track my Form 6 application status?',
    ],
  },
  {
    category: 'EVM Mock Poll',
    question: 'How is mock poll conducted before voting begins?',
    answer:
      'At least 90 minutes before actual polling begins, the Presiding Officer conducts a mandatory Mock Poll in the presence of contesting candidates and polling agents. A minimum of 50 mock votes are cast across all candidates including NOTA, verified on the Control Unit and VVPAT slips, cleared with the CLEAR button, and recorded in a signed Mock Poll Certificate.',
    followUps: [
      'Can EVMs be hacked through Wi-Fi, Bluetooth, or cellular networks?',
      'How does the VVPAT 7-second audit work?',
    ],
  },
  {
    category: 'Voter Secrecy',
    question: 'What is Rule 49M voter secrecy?',
    answer:
      'Rule 49M guarantees absolute secrecy of voting. The Ballot Unit and VVPAT are placed inside an opaque Voting Compartment. If any elector violates voting secrecy or attempts to photograph their vote, the Presiding Officer has statutory power to seize their slip and cancel their vote under Rule 49M.',
    followUps: [
      'What happens if someone else already voted in my name?',
      'What is NOTA (None of the Above)?',
    ],
  },
];

export const AskMitraModal: React.FC<AskMitraModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Namaste! I am Mitra, your non-partisan AI Civic Assistant. How can I assist you with your voting rights, electoral registration, or the EVM/VVPAT voting process today?',
      followUps: [
        'How does the VVPAT 7-second audit work?',
        'Can I vote without an EPIC voter card if I have Aadhaar?',
        'Can EVMs be hacked through Wi-Fi or Bluetooth?',
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleAskQuestion = (question: string) => {
    // Append user question
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setIsTyping(true);

    // Search knowledge base or provide intelligent answer with follow-up suggestions
    setTimeout(() => {
      const matched = CIVIC_KNOWLEDGE_BASE.find(
        (item) =>
          item.question.toLowerCase().includes(question.toLowerCase().slice(0, 18)) ||
          question.toLowerCase().includes(item.question.toLowerCase().slice(0, 18))
      );

      let answerText = '';
      let generatedFollowUps: string[] = [];

      if (matched) {
        answerText = matched.answer;
        generatedFollowUps = matched.followUps;
      } else {
        // Fallback keyword-based answers with curated follow-up questions
        const q = question.toLowerCase();
        if (q.includes('age') || q.includes('18') || q.includes('qualifying')) {
          answerText =
            'Under Indian electoral law, you can apply for registration if you turn 18 on any of the 4 statutory qualifying dates: January 1, April 1, July 1, or October 1. Submit Form 6 on voters.eci.gov.in.';
          generatedFollowUps = [
            'What is the difference between Form 6 and Form 8?',
            'What are the 4 qualifying dates for turning 18?',
            'Which 12 alternative photo IDs are accepted by ECI?',
          ];
        } else if (q.includes('vvpat') || q.includes('slip') || q.includes('paper')) {
          answerText =
            'The VVPAT (Voter Verifiable Paper Audit Trail) prints a paper slip showing serial number, candidate name, and symbol. It is visible for 7 seconds behind a sealed viewing window before dropping into the audit box.';
          generatedFollowUps = [
            'What if the VVPAT paper slip does not match my vote?',
            'How does the VVPAT 7-second audit work?',
            'How are VVPAT slips counted on counting day?',
          ];
        } else if (q.includes('rule 49') || q.includes('secrecy') || q.includes('booth')) {
          answerText =
            'Under Rule 49M, voter secrecy is inviolable. No one, including polling agents or officers, is permitted to observe your button press inside the voting compartment.';
          generatedFollowUps = [
            'What is Rule 49M voter secrecy?',
            'What happens if someone else already voted in my name?',
            'What is NOTA (None of the Above)?',
          ];
        } else if (q.includes('hacked') || q.includes('tamper') || q.includes('chip')) {
          answerText =
            'ECI EVMs are standalone battery-powered embedded devices. They have no network interface, no Wi-Fi, and use OTP (One-Time Programmable) microcontrollers sealed with cryptographic hashes.';
          generatedFollowUps = [
            'Can EVMs be hacked through Wi-Fi, Bluetooth, or cellular networks?',
            'How is mock poll conducted before voting begins?',
            'Why do EVMs use One-Time Programmable (OTP) chips?',
          ];
        } else {
          answerText =
            'Thank you for your civic question! For official statutory verification, always consult voters.eci.gov.in or the Election Commission of India National Grievance Portal (Call 1950 toll-free). Every vote is sacred, secret, and legally protected under the Representation of the People Act.';
          generatedFollowUps = [
            'How does the VVPAT 7-second audit work?',
            'Can I vote without an EPIC voter card if I have Aadhaar?',
            'What is the difference between Form 6 and Form 8?',
          ];
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: answerText, followUps: generatedFollowUps },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const q = inputQuery.trim();
    setInputQuery('');
    handleAskQuestion(q);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mitra-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md relative">
              M
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="mitra-title" className="font-bold text-base text-slate-900 dark:text-white">
                  Mitra — AI Civic Assistant
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Non-Partisan Electoral Guidance & ECI Compliance Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Mitra assistant dialog"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Starter Chips */}
        <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] text-emerald-700 dark:text-teal-300 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Popular:
          </span>
          {CIVIC_KNOWLEDGE_BASE.slice(0, 4).map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAskQuestion(item.question)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {item.question}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    M
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Follow-up Questions Pill Bar for Assistant messages */}
              {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && (
                <div className="pl-10 space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-teal-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>Follow-up questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.followUps.map((followUp, fIdx) => (
                      <button
                        key={fIdx}
                        type="button"
                        onClick={() => handleAskQuestion(followUp)}
                        className="text-left px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors cursor-pointer hover:border-emerald-500 flex items-center gap-1 shadow-2xs"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-teal-400 shrink-0" />
                        <span>{followUp}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300 text-xs italic pl-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-300"></span>
              <span>Mitra is referencing ECI civic handbook...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Field */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about voter ID, Form 6, EVM security, VVPAT, polling hours..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
